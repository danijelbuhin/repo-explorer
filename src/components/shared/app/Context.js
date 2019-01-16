import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const AppContext = createContext();
export const { Consumer, Provider } = AppContext;
const tokens = {
  client_secret: '39e5f4613d7c4c23e96b7ad2f0b2b7546e05fb19',
  client_id: 'edc304d4e5871143c167',
};

class AppProvider extends Component {
  state = {
    rateLimit: {
      core: {},
      search: {},
    },
  }

  componentDidMount() {
    this.fetchRateLimit();
  }

  fetchRateLimit = () => axios
    .get('https://api.github.com/rate_limit', {
      params: {
        ...tokens,
      },
    })
    .then(({ data: { resources: { core, search } } }) => {
      this.setState(() => ({
        rateLimit: {
          core,
          search,
        },
      }));
    });

  fetchPopularRepos = () => axios
    .get('https://api.github.com/search/repositories', {
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
      },
      params: {
        ...tokens,
        q: 'stars:>=50000',
        sort: 'stars',
        order: 'desc',
      },
    })
    .then(({ data }) => {
      this.fetchRateLimit();
      return data;
    })
    .catch((err) => {
      this.fetchRateLimit();
      return err;
    });

  fetchRepo = () => axios
    .get('https://api.github.com/repos/facebook/react', {
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
      },
      params: {
        ...tokens,
      },
    })
    .then(({ data }) => {
      this.fetchRateLimit();
      return data;
    })
    .catch((err) => {
      this.fetchRateLimit();
      return err;
    });

  render() {
    const { rateLimit } = this.state;
    return (
      <Provider
        value={{
          rateLimit,
          fetchRateLimit: this.fetchRateLimit,
          fetchPopularRepos: this.fetchPopularRepos,
          fetchRepo: this.fetchRepo,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
