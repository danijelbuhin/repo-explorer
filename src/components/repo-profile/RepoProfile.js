import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

import db from '../../services/firebase';

import withAppContext from '../shared/app/withAppContext';
import useApiState from '../../hooks/useApiState';
import generateTopic from '../../utils/generateTopic';

import Loader from '../shared/loader/Loader';
import SimilarRepos from './similar-repos/SimilarRepos';

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
  axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_KEY}`).then(({ data }) => {
    storeView(params, data.country_name, data.country_code2);
  }).catch(() => {
    storeView(params, 'Unknown', '');
  });
};

const RepoProfile = (props) => {
  const { match: { params: { id } }, appContext } = props;

  const [apiState, setApiState] = useApiState();
  const [repo, setRepo] = useState({});

  const [topic, setTopic] = useState(null);

  useEffect(() => {
    setApiState({ isLoading: true, hasError: false });
    appContext.fetchRepo(decodeURIComponent(id))
      .then((data) => {
        document.title = `Exploring ${data.full_name} | Repo Explorer`;
        handleView({
          avatar_url: data.owner.avatar_url,
          full_name: data.full_name,
          id: data.id,
          name: data.name,
          stargazers_count: data.stargazers_count,
        });
        setTopic(generateTopic({ topics: data.topics, language: data.language }));
        setApiState({ isLoading: false, hasError: false });
        setRepo(data);
      })
      .catch(() => {
        setApiState({ isLoading: false, hasError: true });
      });
  }, [id]);

  if (apiState.isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
  }

  return (
    <div>
      {repo.full_name}
      <SimilarRepos
        topic={topic}
        searchRepo={appContext.searchRepo}
      />
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
