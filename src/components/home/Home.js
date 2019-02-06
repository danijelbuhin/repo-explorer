import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

import withAppContext from '../shared/app/withAppContext';

import db from '../../services/firebase';
import paginate from '../../utils/paginate';

import { ReactComponent as StarSVG } from './assets/Star.svg';
import { ReactComponent as EyeSVG } from './assets/Eye.svg';

import Repo, { Wrapper as RepoWrapper } from '../shared/repo/Repo';
import Loader from '../shared/loader/Loader';
import Pagination from '../shared/pagination/Pagination';
import Search from './search/Search';

const Wrapper = styled.div`
  padding: 10px;
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

const LastViewText = styled.span`
  text-align: center;
  strong {
    display: block;
  }
`;

const ListTitle = styled.h2`
  margin-bottom: 10px;
  padding-bottom: 10px;

  border-bottom: 1px solid #F4F6F9;
  color: #3A4044;
`;

class Home extends Component {
  views = db.collection('views');

  state = {
    popularViews: [],
    popularRepos: [],
    isLoading: true,
    hasError: false,
    page: 1,
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
        id: doc.data().id,
        ...doc.data(),
      }));
      this.setState({ popularViews: views });
    })
  )

  fetchRepos = () => {
    const { fetchPopularRepos } = this.props.appContext;
    return fetchPopularRepos()
      .then(({ items }) => {
        this.setState(() => ({
          popularRepos: items,
        }));
      });
  }

  onPageNext = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  }

  onPagePrevious = () => {
    this.setState(({ page }) => ({ page: page - 1 }));
  }

  render() {
    const {
      page,
      isLoading,
      hasError,
      popularRepos,
      popularViews,
    } = this.state;
    if (isLoading) {
      return <Loader text="Fetching repositories" />;
    }
    if (hasError) {
      return <div>An error has occured.</div>;
    }
    console.log(popularViews);
    return (
      <Wrapper>
        <Search />
        <ListTitle>Popular repositories:</ListTitle>
        <RepoList>
          {paginate(popularRepos, 10, page).map(repo => (
            <Repo
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
            total={popularRepos.length}
            page={page}
            limit={10}
            onPageNext={this.onPageNext}
            onPagePrevious={this.onPagePrevious}
          />
        </RepoList>
        <ListTitle>Most viewed repos:</ListTitle>
        <RepoList>
          {popularViews.map(repo => (
            <Repo
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
  }
}

Home.propTypes = {
  appContext: PropTypes.shape({
    fetchPopularRepos: PropTypes.func,
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(Home);
