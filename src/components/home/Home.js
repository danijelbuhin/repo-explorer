import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import withAppContext from '../shared/app/withAppContext';
import db from '../../utils/firebase';

class Home extends Component {
  views = db.collection('views');

  state = {
    popularViews: [],
    popularRepos: [],
    isLoading: true,
    hasError: false,
  }

  componentDidMount() {
    const topics = ['ruby', 'php', 'javascript', 'java', 'python', 'go', 'typescript'];
    const promises = [];
    topics.forEach((l) => {
      promises.push(this.fetchPopularRepos(l));
    });
    axios
      .all([...promises, this.handleSearchesUpdate()])
      .then(() => {
        this.setState(({ popularRepos, popularViews }) => ({
          isLoading: false,
          popularRepos: popularRepos
            .filter((repo, i, self) => i === self.findIndex(t => t.id === repo.id))
            .sort((a, b) => b.stargazers_count - a.stargazers_count),
          popularViews,
        }));
      })
      .catch(() => this.setState(() => ({ isLoading: false, hasError: true })));
  }

  handleSearchesUpdate = () => (
    this.views.orderBy('views', 'desc').limit(3).get().then(({ docs }) => {
      const views = [];
      docs.forEach(doc => views.push({
        id: doc.id,
        ...doc.data(),
      }));
      this.setState({ popularViews: views });
    })
  )

  handleView = (params) => {
    this.views.doc(String(params.id)).get().then((doc) => {
      if (doc.exists) {
        this.views.doc(String(params.id)).set({
          ...params,
          views: doc.data().views + 1,
          viewed_at: moment().toDate().getTime(),
        });
      } else {
        this.views.doc(String(params.id)).set({
          ...params,
          views: 1,
          viewed_at: moment().toDate().getTime(),
        });
      }
    });
  }

  fetchPopularRepos(topic) {
    return axios
      .get(`https://api.github.com/search/repositories?q=topic:${topic}&client_id=edc304d4e5871143c167&client_secret=39e5f4613d7c4c23e96b7ad2f0b2b7546e05fb19&sort=stars&order=desc`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
      })
      .then(({ data }) => {
        const topFive = data.items.filter((_, i) => i < 10);
        this.setState(prevState => ({
          popularRepos: [...prevState.popularRepos, ...topFive],
        }));
      });
  }

  render() {
    const { isLoading, hasError, popularRepos, popularViews } = this.state;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (hasError) {
      return <div>An error has occured.</div>;
    }
    return (
      <div>
        <h2>Popular:</h2>
        {popularRepos.filter((_, i) => i < 5).map(repo => (
          <div
            key={repo.id}
            role="presentation"
            style={{ borderBottom: '1px solid black' }}
            onClick={() => {
              this.handleView({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                avatar_url: repo.owner.avatar_url,
                stargazers_count: repo.stargazers_count,
              });
            }}
          >
            <img
              src={repo.owner.avatar_url}
              alt={repo.name}
              style={{ width: 36, height: 36, marginRight: 10, borderRadius: '100%' }}
            />
            {repo.full_name} - {repo.stargazers_count} - {repo.language || `#${repo.topics[0]}` || 'N/A'}
          </div>
        ))}
        <h2>Most viewed repos:</h2>
        {popularViews.map(view => (
          <div key={view.id}>
            <img
              src={view.avatar_url}
              alt={view.name}
              style={{ width: 36, height: 36, marginRight: 10, borderRadius: '100%' }}
            />
            {view.full_name} - {view.views}
            <br />
            Latest viewed at: {`${moment(view.viewed_at).format('DD MMM YYYY, HH:mm:ss')}h`}
          </div>
        ))}
      </div>
    );
  }
}

export default withAppContext(Home);
