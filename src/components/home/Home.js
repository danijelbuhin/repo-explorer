import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

import withAppContext from '../shared/app/withAppContext';

import firebase from '../../services/firebase';
import paginate from '../../utils/paginate';

import { ReactComponent as StarSVG } from './assets/Star.svg';
import { ReactComponent as EyeSVG } from './assets/Eye.svg';

import RepoList from '../shared/repo/List';
import Card from '../shared/repo/Card';
import Pagination from '../shared/pagination/Pagination';
import Search from './search/Search';

import useApiState from '../../hooks/useApiState';

const Wrapper = styled.div`
  padding: 10px;
`;

const LastViewText = styled.span`
  text-align: center;
  strong {
    display: block;
  }
`;

const Home = ({ appContext }) => {
  const [viewsState, setViewsState] = useApiState();
  const [views, setViews] = useState([]);

  const [reposState, setReposState] = useApiState();
  const [repos, setRepos] = useState([]);

  const [page, setPage] = useState(1);

  const fetchViews = () => {
    setViewsState({ isLoading: true, hasError: false });
    firebase.views
      .orderBy('views', 'desc')
      .limit(5)
      .get()
      .then(({ docs }) => {
        const _views = [];
        docs.forEach(doc => _views.push({
          id: doc.data().id,
          ...doc.data(),
        }));
        setViews(_views);
        setViewsState({ isLoading: false, hasError: false });
      })
      .catch(() => {
        setViewsState({ isLoading: false, hasError: true });
      });
  };

  const fetchRepos = () => {
    const { fetchPopularRepos } = appContext;
    setReposState({ isLoading: true, hasError: false });
    return fetchPopularRepos()
      .then(({ items }) => {
        setRepos(items);
        setReposState({ isLoading: false, hasError: false });
      })
      .catch(() => {
        setReposState({ isLoading: false, hasError: true });
      });
  };

  useEffect(() => {
    fetchViews();
    fetchRepos();
  }, []);

  return (
    <Wrapper>
      <Search />
      <RepoList
        title="Most popular repos:"
        isLoading={reposState.isLoading}
        hasError={reposState.hasError}
        loadingPlaceholdersCount={10}
      >
        {paginate(repos, 10, page).map(repo => (
          <Card
            key={repo.id}
            avatar={repo.owner.avatar_url}
            name={repo.full_name}
            count={repo.stargazers_count}
            countIcon={<StarSVG />}
            language={repo.language}
            topic={repo.topics[0]}
            id={repo.id}
          />
        ))}
        <Pagination
          total={repos.length}
          page={page}
          limit={10}
          onPageNext={() => setPage(page + 1)}
          onPagePrevious={() => setPage(page - 1)}
        />
      </RepoList>
      <RepoList
        title="Most viewed repos:"
        isLoading={viewsState.isLoading}
        hasError={viewsState.hasError}
      >
        {views.map(repo => (
          <Card
            key={repo.id}
            avatar={repo.avatar_url}
            name={repo.full_name}
            count={repo.views}
            countIcon={<EyeSVG />}
            id={repo.id}
            text={(
              <LastViewText>
                <strong>Latest view: </strong>
                {`${moment(repo.viewed_at).format('DD MMM YYYY, HH:mm:ss')}h`} <br />
                <span>From: </span>
                {(!repo.viewed_from || repo.viewed_from.country === 'Unknown') && (
                  <span>Unknown location</span>
                )}
                {repo.viewed_from && repo.viewed_from !== 'Unknown' && (
                  <Tooltip
                    title={repo.viewed_from && repo.viewed_from.country}
                    theme="light"
                  >
                    <span
                      className={`flag-icon flag-icon-${repo.viewed_from && repo.viewed_from.country_code}`}
                    />
                  </Tooltip>
                )}
              </LastViewText>
            )}
          />
        ))}
      </RepoList>
    </Wrapper>
  );
};

Home.propTypes = {
  appContext: PropTypes.shape({
    fetchPopularRepos: PropTypes.func,
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(Home);
