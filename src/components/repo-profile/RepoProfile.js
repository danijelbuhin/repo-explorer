import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

import db from '../../services/firebase';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

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
  const { match: { params: { id } } } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [repo, setRepo] = useState({});

  useEffect(() => {
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
    });
  }, []);

  if (isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
  }

  return (
    <div>
      {repo.full_name}
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
