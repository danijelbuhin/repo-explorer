import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import Loader from '../shared/loader/Loader';
import Pagination from '../shared/pagination/Pagination';
import Search from './search/Search';

const Wrapper = styled.div`
  padding: 10px;
`;

const LastViewText = styled.span`
  text-align: center;
  strong {
    display: block;
  }
`;

class Home extends Component {
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
    firebase.views.orderBy('views', 'desc').limit(5).get().then(({ docs }) => {
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
    return (
      <Wrapper>
        <Search />
        <RepoList
          title="Most popular repos:"
        >
          {paginate(popularRepos, 10, page).map(repo => (
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
            total={popularRepos.length}
            page={page}
            limit={10}
            onPageNext={this.onPageNext}
            onPagePrevious={this.onPagePrevious}
          />
        </RepoList>
        <RepoList
          title="Most viewed repos:"
        >
          {popularViews.map(repo => (
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
  }
}

Home.propTypes = {
  appContext: PropTypes.shape({
    fetchPopularRepos: PropTypes.func,
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(Home);
