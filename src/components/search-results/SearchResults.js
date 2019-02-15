import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import axios from 'axios';
import styled from 'styled-components';

import withAppContext from '../shared/app/withAppContext';

import Card from '../shared/repo/Card';
import RepoList from '../shared/repo/List';

import { ReactComponent as StarSVG } from '../home/assets/Star.svg';
import useApiState from '../../hooks/useApiState';

const Wrapper = styled.div`
  padding: 10px;
`;

const SearchResults = (props) => {
  const { location: { search }, appContext } = props;
  const { token, client_id, client_secret, fetchRateLimit } = appContext;
  const { q: result } = qs.parse(search, { ignoreQueryPrefix: true });

  const [apiState, setApiState] = useApiState();
  const [repos, setRepos] = useState([]);

  const fetchRepos = () => {
    setApiState({ isLoading: true, hasError: false });
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
        setApiState({ isLoading: false, hasError: false });
        setRepos(data.items);
      })
      .catch(({ response: { data } }) => {
        fetchRateLimit();
        setApiState({ isLoading: false, hasError: true, errorMessage: data.message });
      });
  };

  useEffect(() => {
    fetchRepos();
  }, [result]);

  return (
    <Wrapper>
      <RepoList
        title={`Search results for ${result} query`}
        isLoading={apiState.isLoading}
        hasError={apiState.hasError}
        errorMessage={apiState.errorMessage}
      >
        {repos.length > 0 && repos.map(repo => (
          <Card
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
};

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
