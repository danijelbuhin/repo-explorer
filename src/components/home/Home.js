import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../shared/app/withAppContext';

import db from '../../services/firebase';
import repoColors from '../../utils/repoColors.json';

import RateLimit from '../shared/rate-limit/RateLimit';

const Language = styled.div`
  display: inline-block;
  padding: 2px 4px;

  color: #fff;
  text-shadow: 0px 2px 1px rgba(0,0,0,0.2);

  background: ${({ color }) => color ? color : '#f7f7f7'};
  border-radius: 3px;
`;

const Tag = styled.div`
  display: inline-block;
  padding: 2px 4px;

  color: #0366d6; 
  background-color: #f1f8ff;

  border-radius: 3px;
  white-space: nowrap;
`;

class Home extends Component {
  views = db.collection('views');

  state = {
    popularViews: [],
    popularRepos: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
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
            style={{ borderBottom: '1px solid black', marginBottom: '10px', padding: '10px 0' }}
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
            {repo.full_name} - {repo.stargazers_count} <br />
            {repo.language && <Language color={repoColors[repo.language].color}>{repo.language}</Language>}
            {!repo.language && <Tag>#{repo.topics[0]}</Tag>}
            {!repo.language && repo.topics.length < 1 && 'N/A'}
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
  }).isRequired,
};

export default withAppContext(Home);
