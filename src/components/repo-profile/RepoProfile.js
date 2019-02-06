import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

import db from '../../services/firebase';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

class RepoProfile extends Component {
  views = db.collection('views');

  state = {
    isLoading: true,
    hasError: false,
    repo: {},
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.props.appContext.fetchRepo(decodeURIComponent(id)).then((data) => {
      const viewedData = {
        avatar_url: data.owner.avatar_url,
        full_name: data.full_name,
        id: data.id,
        name: data.name,
        stargazers_count: data.stargazers_count,
      };
      this.handleView(viewedData);
      this.setState({ isLoading: false, repo: { ...data } });
    });
  }

  handleView = (params) => {
    axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=400f298bfe8740648f023aced5623fef').then(({ data }) => {
      this.storeView(params, data.country_name, data.country_code2);
    }).catch(() => {
      this.storeView(params, 'Unknown', '');
    });
  }

  storeView = (params, country, countryCode) => {
    this.views.doc(String(params.id)).get().then((doc) => {
      if (doc.exists) {
        this.views.doc(String(params.id)).set({
          ...params,
          views: doc.data().views + 1,
          viewed_at: moment().toDate().getTime(),
          viewed_from: {
            country,
            country_code: countryCode.toLowerCase(),
          },
        });
      } else {
        this.views.doc(String(params.id)).set({
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
  }

  render() {
    const { match: { params: { id } } } = this.props;
    const { isLoading, hasError, repo } = this.state;
    if (isLoading && !hasError) {
      return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
    }
    return (
      <div>
        {repo.full_name}
      </div>
    );
  }
}

RepoProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(RepoProfile);
