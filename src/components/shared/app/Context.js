import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

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
      isLoading: false,
      latest_usage: 0,
    },
    user: {
      token: null,
    },
  }

  componentDidMount() {
    try {
      const token = window.localStorage.getItem('rx-user-token');
      if (token) {
        this.setState({ user: { token } });
      }
    } catch (err) {
      console.log(err);
    }
    this.fetchRateLimit();
  }

  fetchRateLimit = () => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state.user;
    this.setState(({ rateLimit }) => ({ rateLimit: { ...rateLimit, isLoading: true } }));
    return axios
      .get('https://api.github.com/rate_limit', {
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
        },
      })
      .then(({ data: { resources: { core, search } } }) => {
        this.setState(() => ({
          rateLimit: {
            core,
            search,
            isLoading: false,
            latest_usage: moment().unix(),
          },
        }));
      });
  }

  fetchPopularRepos = () => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state.user;
    return axios
      .get('https://api.github.com/search/repositories', {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
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
  }

  fetchRepo = () => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state.user;
    return axios
      .get('https://api.github.com/repos/facebook/react', {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
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
  }

    authenticate = (code) => {
      axios
        .get(`https://repo-explorer-auth.herokuapp.com/authenticate/${code}`)
        .then(({ data: { token } }) => {
          console.log('res', token);
          this.setState({ user: { token } });
          window.localStorage.setItem('rx-user-token', token);
        })
        .catch(err => console.log('auth', err));
    }

    render() {
      const { rateLimit, user } = this.state;
      return (
        <Provider
          value={{
            rateLimit,
            fetchRateLimit: this.fetchRateLimit,
            fetchPopularRepos: this.fetchPopularRepos,
            fetchRepo: this.fetchRepo,
            authenticate: this.authenticate,
            user,
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
