import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import styled from 'styled-components';

import db from '../../services/firebase';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

import { ReactComponent as StarSVG } from '../home/assets/Star.svg';

import Card, { Wrapper as RepoWrapper } from '../shared/repo/Card';
import generateTopic from '../../utils/generateTopic';

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
      const query = generateTopic({
        topics: data.topics,
        language: data.language,
      });
      if (query) {
        appContext.searchRepo(query, 5).then(({ items }) => {
          setSimilarRepos(items);
          setIsLoadingSimilarRepos(false);
        });
      }
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
