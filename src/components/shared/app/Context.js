import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import db, { auth } from '../../../services/firebase';

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
    hasError: false,
    rateLimit: {
      core: {},
      search: {},
      isLoading: false,
      latest_usage: 0,
    },
    user: {},
    token: null,
  }

  componentDidMount() {
    try {
      const id = window.localStorage.getItem('rx-user-id');
      const token = window.localStorage.getItem('rx-user-token');
      if (id && token) {
        this.users.doc(id).get().then((user) => {
          this.setState({
            user: { ...user.data() },
            token,
            isLoading: false,
            hasError: false,
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
    this.fetchRateLimit();
    this.onAuthStateChange();
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
    const { token } = this.state;
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

  authenticate = () => {
    auth().signInWithPopup(new auth.GithubAuthProvider()).then((result) => {
      this.users.doc(result.user.uid).get().then((user) => {
        if (user.exists) {
          window.localStorage.setItem('rx-user-id', result.user.uid);
          window.localStorage.setItem('rx-user-token', result.credential.accessToken);
          this.setState(() => ({
            user: {
              ...user.data(),
            },
            token: result.credential.accessToken,
          }), () => this.fetchRateLimit());
        } else {
          this.users.doc(result.user.uid).set({
            name: result.additionalUserInfo.profile.name,
            email: result.additionalUserInfo.profile.email,
            avatar: result.additionalUserInfo.profile.avatar_url,
            blog: result.additionalUserInfo.profile.blog,
            bio: result.additionalUserInfo.profile.bio,
            favorites: [],
          }).then(() => {
            window.localStorage.setItem('rx-user-id', result.user.uid);
            window.localStorage.setItem('rx-user-token', result.credential.accessToken);
            this.setState(() => ({
              user: {
                name: result.additionalUserInfo.profile.name,
                email: result.additionalUserInfo.profile.email,
                avatar: result.additionalUserInfo.profile.avatar_url,
                blog: result.additionalUserInfo.profile.blog,
                bio: result.additionalUserInfo.profile.bio,
                favorites: [],
              },
              token: result.credential.accessToken,
            }), () => this.fetchRateLimit());
          });
        }
      });
    });
  }

  onAuthStateChange = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isAuthenticated: true });
      } else {
        window.localStorage.removeItem('rx-user-id');
        window.localStorage.removeItem('rx-user-token');
        this.setState({ isAuthenticated: false });
      }
    });
  }

  logOut = () => {
    auth().signOut().then(() => {
      window.localStorage.removeItem('rx-user-id');
      window.localStorage.removeItem('rx-user-token');
      this.setState({ user: { }, token: null });
      this.fetchRateLimit();
    });
  }

  render() {
    const {
      isAuthenticated,
      rateLimit,
      user,
      isLoading,
      hasError,
    } = this.state;
    if (isLoading) {
      return <div>Checking user authentication...</div>;
    }
    if (hasError) {
      return <div>Critical error occured.</div>;
    }
    return (
      <Provider
        value={{
          rateLimit,
          user,
          isAuthenticated,
          fetchRateLimit: this.fetchRateLimit,
          fetchPopularRepos: this.fetchPopularRepos,
          fetchRepo: this.fetchRepo,
          authenticate: this.authenticate,
          logOut: this.logOut,
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
