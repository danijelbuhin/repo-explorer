import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import styled from 'styled-components';

import db from '../../services/firebase';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

import { ReactComponent as StarSVG } from '../home/assets/Star.svg';

import Repo, { Wrapper as RepoWrapper } from '../shared/repo/Repo';

const RepoList = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;

  ${RepoWrapper} {
    width: 100%;
    @media (min-width: 420px) {
      width: 48%;
    }
    @media (min-width: 768px) {
      width: 31%;
    }
    @media (min-width: 900px) {
      width: 23%;
    }
    @media (min-width: 1200px) {
      width: 18%;
    }
  }
`;

const views = db.collection('views');

const storeView = (params, country, countryCode) => {
  views.doc(String(params.id)).get().then((doc) => {
    if (doc.exists) {
      views.doc(String(params.id)).set({
        ...params,
        views: doc.data().views + 1,
        viewed_at: moment().toDate().getTime(),
        viewed_from: {
          country,
          country_code: countryCode.toLowerCase(),
        },
      });
    } else {
      views.doc(String(params.id)).set({
        ...params,
        views: 1,
        viewed_at: moment().toDate().getTime(),
        viewed_from: {
          country,
          country_code: countryCode.toLowerCase(),
        },
      });
    }
  });
};

const handleView = (params) => {
  axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=400f298bfe8740648f023aced5623fef').then(({ data }) => {
    storeView(params, data.country_name, data.country_code2);
  }).catch(() => {
    storeView(params, 'Unknown', '');
  });
};

const RepoProfile = (props) => {
  const { match: { params: { id } }, appContext } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [repo, setRepo] = useState({});

  const [similarRepos, setSimilarRepos] = useState([]);
  const [isLoadingSimilarRepos, setIsLoadingSimilarRepos] = useState(true);

  useEffect(() => {
    document.title = `Fetching ${decodeURIComponent(id)} | Repo Explorer`;
    props.appContext.fetchRepo(decodeURIComponent(id)).then((data) => {
      document.title = `Exploring ${data.full_name} | Repo Explorer`;
      const viewedData = {
        avatar_url: data.owner.avatar_url,
        full_name: data.full_name,
        id: data.id,
        name: data.name,
        stargazers_count: data.stargazers_count,
      };
      handleView(viewedData);
      setIsLoading(false);
      setRepo(data);
      appContext.searchRepo(data.topics[0], 5).then(({ items }) => {
        setSimilarRepos(items);
        setIsLoadingSimilarRepos(false);
      });
    });
  }, [id]);

  if (isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
  }

  return (
    <div>
      {repo.full_name}
      <div>Repos with similar topic:</div>
      {isLoadingSimilarRepos && 'Loading similar repos....'}
      <RepoList>
        {!isLoadingSimilarRepos && similarRepos.length > 0 && similarRepos.map(similar => (
          <Repo
            key={similar.id}
            avatar={similar.owner.avatar_url}
            name={similar.full_name}
            count={similar.stargazers_count}
            countIcon={<StarSVG />}
            language={similar.language}
            topic={similar.topics[0]}
            id={similar.id}
          />
        ))}
      </RepoList>
    </div>
  );
};

RepoProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(RepoProfile);
