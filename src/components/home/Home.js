import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../shared/app/withAppContext';

import db from '../../services/firebase';

import RateLimit from '../shared/rate-limit/RateLimit';
import Repo from '../shared/repo/Repo';
import { ReactComponent as StarSVG } from './assets/Star.svg';
import { ReactComponent as EyeSVG } from './assets/Eye.svg';

const RepoList = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
`;

const LastViewText = styled.span`
  text-align: center;
  strong {
    display: block;
  }
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
    this.views.orderBy('views', 'desc').limit(5).get().then(({ docs }) => {
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
        <RepoList>
          {popularRepos.map(repo => (
            <Repo
              key={repo.id}
              avatar={repo.owner.avatar_url}
              name={repo.full_name}
              count={repo.stargazers_count}
              countIcon={<StarSVG />}
              language={repo.language}
              topic={repo.topics[0]}
              onClick={() => {
                this.handleView({
                  id: repo.id,
                  name: repo.name,
                  full_name: repo.full_name,
                  avatar_url: repo.owner.avatar_url,
                  stargazers_count: repo.stargazers_count,
                });
              }}
            />
          ))}
        </RepoList>
        <h2>Most viewed repos:</h2>
        <RepoList>
          {popularViews.map(repo => (
            <Repo
              key={repo.id}
              avatar={repo.avatar_url}
              name={repo.full_name}
              count={repo.views}
              countIcon={<EyeSVG />}
              text={(
                <LastViewText>
                  <strong>Latest view: </strong>
                  {`${moment(repo.viewed_at).format('DD MMM YYYY, HH:mm:ss')}h`}
                </LastViewText>
              )}
            />
          ))}
        </RepoList>
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
