import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

import firebase from '../../../services/firebase';

import Loader from '../loader/Loader';

export const AppContext = createContext();
export const { Consumer, Provider } = AppContext;

const tokens = {
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  client_id: process.env.REACT_APP_CLIENT_ID,
};

class AppProvider extends Component {
  state = {
    isLoading: true,
    rateLimit: {
      core: {},
      search: {},
      isLoading: false,
      latest_usage: 0,
    },
    user: null,
    token: null,
    isAuthenticated: false,
    isAuthenticating: false,
  }

  componentDidMount() {
    const id = window.localStorage.getItem('rx-user-id');
    const token = window.localStorage.getItem('rx-user-token');
    if (id && token) {
      axios
        .get('https://api.github.com/user', {
          params: { access_token: token },
        })
        .then(() => {
          firebase.users.doc(id).get().then((user) => {
            this.setState(() => ({
              user: { ...user.data() },
              token,
              isLoading: false,
              isAuthenticated: true,
              isAuthenticating: false,
            }), () => this.fetchRateLimit());
          });
        })
        .catch(({ response }) => {
          if (response.data.message === 'Bad credentials') {
            window.localStorage.removeItem('rx-user-id');
            window.localStorage.removeItem('rx-user-token');
            this.setState(() => ({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isAuthenticating: false,
            }), () => this.fetchRateLimit());
            firebase.logOut();
          }
        });
    } else {
      this.setState({ isLoading: false });
      this.fetchRateLimit();
    }
  }

  fetchRateLimit = () => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
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
      })
      .catch(() => {
        toast.error('We could not fetch github rate limit.', {
          position: 'bottom-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        this.setState(({ rateLimit }) => ({
          rateLimit: {
            ...rateLimit,
            isLoading: false,
            hasError: true,
          },
        }));
      });
  }

  fetchPopularRepos = (params) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get('https://api.github.com/search/repositories', {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
          q: `stars:>=${params.minStars || 30000}`,
          sort: params.sort || 'stars',
          order: params.order || 'desc',
          per_page: params.per_page || 100,
        },
      })
      .then(({ data }) => {
        this.fetchRateLimit();
        return data;
      });
  }

  fetchRepo = (repo) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/repos/${repo}`, {
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
      });
  }

  searchRepo = (params, excludeId) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get('https://api.github.com/search/repositories', {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        params: {
          client_id: token ? undefined : client_id,
          client_secret: token ? undefined : client_secret,
          access_token: token ? token : undefined,
          ...params,
        },
      })
      .then(({ data }) => {
        this.fetchRateLimit();
        if (excludeId) {
          return {
            ...data,
            items: data.items.filter(r => r.id !== excludeId).filter((_, i) => i < 5),
          };
        }
        return data;
      });
  }

  fetchCommits = (repo) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/repos/${repo}/stats/commit_activity`, {
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
      });
  }

  fetchParticipation = (repo) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/repos/${repo}/stats/participation`, {
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
      });
  }

  fetchLanguages = (repo) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/repos/${repo}/languages`, {
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
      });
  }

  fetchContributors = (repo) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/repos/${repo}/contributors`, {
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
      });
  }

  updateUser = (field, value) => {
    const { user } = this.state;
    return firebase.users.doc(user.id).update({ [field]: value }).then(() => {
      firebase.users.doc(user.id).get().then((u) => {
        this.setState(() => ({
          user: {
            ...u.data(),
          },
        }));
      });
    });
  }

  authenticate = () => {
    this.setState({ isAuthenticating: true });
    firebase
      .authenticate()
      .then(({ token, user }) => {
        this.setState(() => ({
          user,
          token,
          isAuthenticated: true,
          isAuthenticating: false,
        }), () => this.fetchRateLimit());
      })
      .catch(() => {
        this.setState({ isAuthenticated: false, isAuthenticating: false });
        toast.error('Auth popup has been closed by the user before finalizing authentication.', {
          position: 'bottom-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  }

  logOut = () => {
    firebase.logOut().then(() => {
      window.localStorage.removeItem('rx-user-id');
      window.localStorage.removeItem('rx-user-token');
      this.setState({ user: null, token: null, isAuthenticated: false });
      this.fetchRateLimit();
    });
  }

  render() {
    const {
      isAuthenticated,
      isAuthenticating,
      rateLimit,
      user,
      isLoading,
      token,
    } = this.state;
    if (isLoading) {
      return <Loader text="Checking user authentication" />;
    }
    return (
      <Provider
        value={{
          rateLimit,
          user,
          isAuthenticated,
          isAuthenticating,
          tokens,
          token,
          fetchRateLimit: this.fetchRateLimit,
          fetchPopularRepos: this.fetchPopularRepos,
          fetchRepo: this.fetchRepo,
          authenticate: this.authenticate,
          updateUser: this.updateUser,
          logOut: this.logOut,
          searchRepo: this.searchRepo,
          fetchCommits: this.fetchCommits,
          fetchParticipation: this.fetchParticipation,
          fetchLanguages: this.fetchLanguages,
          fetchContributors: this.fetchContributors,
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
