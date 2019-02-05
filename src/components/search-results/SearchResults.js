import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import axios from 'axios';
import styled from 'styled-components';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

import Repo, { Wrapper as RepoWrapper } from '../shared/repo/Repo';

import { ReactComponent as StarSVG } from '../home/assets/Star.svg';

const Wrapper = styled.div`
  padding: 10px;
`;

const ListTitle = styled.h2`
  margin-bottom: 10px;
  padding-bottom: 10px;

  border-bottom: 1px solid #F4F6F9;
  color: #3A4044;
`;

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

class SearchResults extends Component {
  state = {
    isLoading: false,
    hasError: false,
    repos: [],
  }

  componentDidMount() {
    this.fetchRepos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchRepos();
    }
  }

  fetchRepos = () => {
    const { appContext, location: { search } } = this.props;
    const { token, client_id, client_secret, fetchRateLimit } = appContext;
    const { q: result } = qs.parse(search, { ignoreQueryPrefix: true });
    this.setState({ isLoading: true });
    axios
      .get(`https://api.github.com/search/repositories?q=${result}`, {
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
          sort: 'stars',
          order: 'desc',
        },
      })
      .then(({ data }) => {
        fetchRateLimit();
        this.setState({
          isLoading: false,
          hasError: false,
          repos: data.items,
        });
      })
      .catch(() => {
        fetchRateLimit();
        this.setState({
          isLoading: false,
          hasError: true,
          repos: [],
        });
      });
  }

  render() {
    const { isLoading, hasError, repos } = this.state;
    const { location: { search } } = this.props;
    const { q: result } = qs.parse(search, { ignoreQueryPrefix: true });
    if (isLoading && !hasError) {
      return <Loader text={`Fetching information about ${decodeURIComponent(result)}`} />;
    }
    return (
      <Wrapper>
        <ListTitle>Search results for {result} query</ListTitle>
        <RepoList>
          {repos.length > 0 && repos.map(repo => (
            <Repo
              key={repo.id}
              avatar={repo.owner.avatar_url}
              name={repo.full_name}
              count={repo.stargazers_count}
              countIcon={<StarSVG />}
              language={repo.language && repo.language}
              topic={repo.topis && repo.topics[0]}
              id={repo.id}
            />
          ))}
        </RepoList>
      </Wrapper>
    );
  }
}

SearchResults.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  appContext: PropTypes.shape({
    token: PropTypes.string,
    client_id: PropTypes.string,
    client_secret: PropTypes.string,
  }).isRequired,
};

export default withAppContext(SearchResults);
