import React, { Component } from 'react';
import axios from 'axios';

import withAppContext from '../shared/app/withAppContext';

class Home extends Component {
  state = {
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
    axios.all(promises)
      .then(() => {
        this.setState(({ popularRepos }) => ({
          isLoading: false,
          popularRepos: popularRepos
            .filter((repo, i, self) => i === self.findIndex(t => t.id === repo.id))
            .sort((a, b) => b.stargazers_count - a.stargazers_count),
        }));
      })
      .catch(() => this.setState(() => ({ isLoading: false, hasError: true })));
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
    const { isLoading, hasError, popularRepos } = this.state;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (hasError) {
      return <div>An error has occured.</div>;
    }
    return (
      <div>
        {popularRepos.map(repo => (
          <div key={repo.id} style={{ borderBottom: '1px solid black' }}>
            <img
              src={repo.owner.avatar_url}
              alt={repo.name}
              style={{ width: 36, height: 36, marginRight: 10, borderRadius: '100%' }}
            />
            {repo.full_name} - {repo.stargazers_count} - {repo.language || `#${repo.topics[0]}` || 'N/A'}
          </div>
        ))}
      </div>
    );
  }
}

export default withAppContext(Home);
