import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

import db from '../../services/firebase';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

import { ReactComponent as StarSVG } from '../home/assets/Star.svg';

import Card from '../shared/repo/Card';
import RepoList from '../shared/repo/List';
import generateTopic from '../../utils/generateTopic';
import useApiState from '../../hooks/useApiState';

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

  // const [isLoading, setIsLoading] = useState(false);
  const [repoFetch, setRepoFetch] = useApiState();
  const [repo, setRepo] = useState({});

  // const [isLoadingSimilarRepos, setIsLoadingSimilarRepos] = useState(false);
  const [similarFetch, setSimilarFetch] = useApiState();
  const [similarRepos, setSimilarRepos] = useState([]);

  useEffect(() => {
    setRepoFetch({ isLoading: true, hasError: false });
    document.title = `Fetching ${decodeURIComponent(id)} | Repo Explorer`;
    props.appContext
      .fetchRepo(decodeURIComponent(id))
      .then((data) => {
        document.title = `Exploring ${data.full_name} | Repo Explorer`;
        const viewedData = {
          avatar_url: data.owner.avatar_url,
          full_name: data.full_name,
          id: data.id,
          name: data.name,
          stargazers_count: data.stargazers_count,
        };
        handleView(viewedData);
        setRepoFetch({ isLoading: false, hasError: false });
        setRepo(data);
        const query = generateTopic({
          topics: data.topics,
          language: data.language,
        });
        if (query) {
          setSimilarFetch({ isLoading: true, hasError: false });
          appContext
            .searchRepo(query, 5)
            .then(({ items }) => {
              setSimilarRepos(items);
              setSimilarFetch({ isLoading: false, hasError: false });
            })
            .catch(() => setSimilarFetch({ isLoading: false, hasError: true }));
        }
      })
      .catch(() => {
        setSimilarFetch({ isLoading: false, hasError: true });
      });
  }, [id]);

  if (repoFetch.isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
  }

  return (
    <div>
      {repo.full_name}
      <div>Repos with similar topic:</div>
      <RepoList
        title="Repos with similar topic:"
        isLoading={similarFetch.isLoading}
      >
        {similarRepos.map(similarRepo => (
          <Card
            key={similarRepo.id}
            avatar={similarRepo.owner.avatar_url}
            name={similarRepo.full_name}
            count={similarRepo.stargazers_count}
            countIcon={<StarSVG />}
            language={similarRepo.language}
            topic={similarRepo.topics[0]}
            id={similarRepo.id}
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
