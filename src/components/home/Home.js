import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../shared/app/withAppContext';

import db from '../../services/firebase';
import repoColors from '../../utils/repoColors.json';

import RateLimit from '../shared/rate-limit/RateLimit';
import { ReactComponent as StarSVG } from './assets/Star.svg';

const RepoList = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
`;

const Repo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 18%;
  margin: 10px 1%;
  padding: 15px 33px;

  background: #FFFFFF;

  border: 1px solid rgba(212, 221, 237, 0.25);
  border-radius: 3px;
  box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
`;

const Image = styled.img`
  width: 48px;
  height: 48px;

  margin-bottom: 10px;
  border-radius: 100%;
`;

const Name = styled.span`
  font-size: 14px;
  text-align: center;

  white-space: nowrap; 
  max-width: 200px; 
  overflow: hidden;
  text-overflow: ellipsis;

  margin-bottom: 20px;
`;

const Count = styled.strong`
  font-size: 18px;
  margin-bottom: 20px;

  svg {
    display: inline-block;
    vertical-align: text-bottom;
  }
`;

const Text = styled.span`
  font-size: 12px;
`;

const Language = styled.div`
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
        <RepoList>
          {popularRepos.map(repo => (
            <Repo
              key={repo.id}
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
              <Image
                src={repo.owner.avatar_url}
                alt={repo.name}
              />
              <Name>{repo.full_name}</Name>
              <Count><StarSVG /> {repo.stargazers_count}</Count>
              {repo.language && <Language color={repoColors[repo.language].color}>{repo.language.toLowerCase()}</Language>}
              {!repo.language && <Tag>#{repo.topics[0].toLowerCase()}</Tag>}
              {!repo.language && repo.topics.length < 1 && 'N/A'}
            </Repo>
          ))}
        </RepoList>
        <h2>Most viewed repos:</h2>
        <RepoList>
          {popularViews.map(repo => (
            <Repo key={repo.id}>
              <Image
                src={repo.avatar_url}
                alt={repo.name}
              />
              <Name>{repo.full_name}</Name>
              <Count>{repo.views}</Count>
              <Text>
                <strong>Latest view: </strong>
                {`${moment(repo.viewed_at).format('DD MMM YYYY, HH:mm:ss')}h`}
              </Text>
            </Repo>
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
