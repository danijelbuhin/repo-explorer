import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';

import withAppContext from '../shared/app/withAppContext';

import db from '../../services/firebase';

import RateLimit from '../shared/rate-limit/RateLimit';

class Home extends Component {
  views = db.collection('views');

  state = {
    popularViews: [],
    popularRepos: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    const authCode = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).code;
    if (authCode) {
      this.props.appContext.authenticate(authCode);
    }
    axios
      .all([this.fetchRepos(), this.fetchViews()])
      .then(() => {
        this.setState(({ popularRepos, popularViews }) => ({
          isLoading: false,
          popularRepos,
          popularViews,
        }));
      })
      .catch(() => this.setState(() => ({ isLoading: false, hasError: true })));
  }

  fetchViews = () => (
    this.views.orderBy('views', 'desc').limit(3).get().then(({ docs }) => {
      const views = [];
      docs.forEach(doc => views.push({
        id: doc.id,
        ...doc.data(),
      }));
      this.setState({ popularViews: views });
    })
  )

  handleView = (params) => {
    this.views.doc(String(params.id)).get().then((doc) => {
      if (doc.exists) {
        this.views.doc(String(params.id)).set({
          ...params,
          views: doc.data().views + 1,
          viewed_at: moment().toDate().getTime(),
        });
      } else {
        this.views.doc(String(params.id)).set({
          ...params,
          views: 1,
          viewed_at: moment().toDate().getTime(),
        });
      }
    });
  }

  fetchRepos = () => {
    const { fetchPopularRepos } = this.props.appContext;
    return fetchPopularRepos()
      .then(({ items }) => {
        const topResults = items.filter((_, i) => i < 15);
        this.setState(() => ({
          popularRepos: topResults,
        }));
      });
  }

  render() {
    const { isLoading, hasError, popularRepos, popularViews } = this.state;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (hasError) {
      return <div>An error has occured.</div>;
    }
    return (
      <div>
        <RateLimit />
        <h2>Popular:</h2>
        <button onClick={this.props.appContext.fetchPopularRepos} type="button">Refetch</button>
        <button onClick={this.props.appContext.fetchRepo} type="button">Fetch repo</button>
        {popularRepos.map(repo => (
          <div
            key={repo.id}
            role="presentation"
            style={{ borderBottom: '1px solid black' }}
            onClick={() => {
              this.handleView({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                avatar_url: repo.owner.avatar_url,
                stargazers_count: repo.stargazers_count,
              });
            }}
          >
            <img
              src={repo.owner.avatar_url}
              alt={repo.name}
              style={{ width: 36, height: 36, marginRight: 10, borderRadius: '100%' }}
            />
            {repo.full_name} - {repo.stargazers_count} - {repo.language || `#${repo.topics[0]}` || 'N/A'}
          </div>
        ))}
        <h2>Most viewed repos:</h2>
        {popularViews.map(view => (
          <div key={view.id}>
            <img
              src={view.avatar_url}
              alt={view.name}
              style={{ width: 36, height: 36, marginRight: 10, borderRadius: '100%' }}
            />
            {view.full_name} - {view.views}
            <br />
            Latest viewed at: {`${moment(view.viewed_at).format('DD MMM YYYY, HH:mm:ss')}h`}
          </div>
        ))}
      </div>
    );
  }
}

Home.propTypes = {
  appContext: PropTypes.shape({
    fetchPopularRepos: PropTypes.func,
    fetchRepo: PropTypes.func,
    authenticate: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default withAppContext(Home);
