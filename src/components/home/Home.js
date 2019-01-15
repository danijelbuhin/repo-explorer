import React, { Component } from 'react';
import axios from 'axios';

import withAppContext from '../shared/app/withAppContext';

class Home extends Component {
  state = {
    popularRepos: [],
    isLoading: true,
  }

  componentDidMount() {
    const languages = ['ruby', 'php', 'javascript', 'java', 'python'];
    const promises = [];
    languages.forEach((l) => {
      promises.push(this.fetchPopularRepos(l));
    });
    axios.all(promises).then(() => {
      this.setState(({ popularRepos }) => ({
        isLoading: false,
        popularRepos: popularRepos.sort((a, b) => b.stargazers_count - a.stargazers_count),
      }));
    });
  }

  fetchPopularRepos(language) {
    return axios
      .get(`https://api.github.com/search/repositories?q=topic:${language}&client_id=edc304d4e5871143c167&client_secret=39e5f4613d7c4c23e96b7ad2f0b2b7546e05fb19&sort=stars&order=desc`, {
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
      })
      .then(({ data }) => {
        const topFive = data.items.filter(item => item.language).filter((_, i) => i < 5);
        this.setState(prevState => ({
          popularRepos: [...prevState.popularRepos, ...topFive],
        }));
      });
  }

  render() {
    const { isLoading, popularRepos } = this.state;
    if (isLoading) {
      return <div>Loading..</div>;
    }
    return (
      <div>
        {popularRepos.map(repo => (
          <div key={repo.name} style={{ borderBottom: '1px solid black' }}>
            {repo.name} - {repo.stargazers_count} - {repo.language}
          </div>
        ))}
      </div>
    );
  }
}

export default withAppContext(Home);
