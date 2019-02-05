import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import db, { auth } from '../../../services/firebase';

import Loader from '../loader/Loader';

export const AppContext = createContext();
export const { Consumer, Provider } = AppContext;

const tokens = {
  client_secret: '39e5f4613d7c4c23e96b7ad2f0b2b7546e05fb19',
  client_id: 'edc304d4e5871143c167',
};

class AppProvider extends Component {
  users = db.collection('users');

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
    try {
      const id = window.localStorage.getItem('rx-user-id');
      const token = window.localStorage.getItem('rx-user-token');
      if (id && token) {
        this.fetchRateLimit();
        axios
          .get('https://api.github.com/user', {
            params: { access_token: token },
          })
          .then(() => {
            this.users.doc(id).get().then((user) => {
              this.setState({
                user: { ...user.data() },
                token,
                isLoading: false,
                isAuthenticated: true,
                isAuthenticating: false,
              });
            });
          })
          .catch(({ response }) => {
            if (response.data.message === 'Bad credentials') {
              window.localStorage.removeItem('rx-user-id');
              window.localStorage.removeItem('rx-user-token');
              this.setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthenticating: false,
              });
              auth().signOut();
            }
          });
      } else {
        this.fetchRateLimit();
        this.setState({ isLoading: false });
      }
    } catch (err) {
      console.log(err);
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
      });
  }

  fetchPopularRepos = () => {
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
          q: 'stars:>=30000',
          sort: 'stars',
          order: 'desc',
          per_page: 100,
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
      })
      .catch((err) => {
        this.fetchRateLimit();
        return err;
      });
  }

  searchRepo = (query, perPage) => {
    const { client_id, client_secret } = tokens;
    const { token } = this.state;
    return axios
      .get(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${perPage}`, {
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

  updateUser = (field, value) => {
    const { user } = this.state;
    return this.users.doc(user.id).update({ [field]: value }).then(() => {
      this.users.doc(user.id).get().then((u) => {
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
    auth().signInWithPopup(new auth.GithubAuthProvider()).then((result) => {
      const {
        additionalUserInfo: {
          profile,
        },
        user,
        credential,
      } = result;
      this.users.doc(result.user.uid).get().then((doc) => {
        if (doc.exists) {
          window.localStorage.setItem('rx-user-id', user.uid);
          window.localStorage.setItem('rx-user-token', credential.accessToken);
          this.setState(() => ({
            user: {
              ...doc.data(),
            },
            token: credential.accessToken,
            isAuthenticated: true,
            isAuthenticating: false,
          }), () => this.fetchRateLimit());
        } else {
          const newUser = {
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar_url,
            blog: profile.blog,
            bio: profile.bio,
            id: user.uid,
            favorites: [],
          };
          this.users.doc(result.user.uid).set(newUser).then(() => {
            window.localStorage.setItem('rx-user-id', user.uid);
            window.localStorage.setItem('rx-user-token', credential.accessToken);
            this.setState(() => ({
              user: newUser,
              token: credential.accessToken,
              isAuthenticated: true,
              isAuthenticating: false,
            }), () => this.fetchRateLimit());
          });
        }
      });
    });
  }

  logOut = () => {
    auth().signOut().then(() => {
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
