import React, { Component } from 'react';

import withAppContext from '../shared/app/withAppContext';

class Home extends Component {
  state = {
    popularRepos: [],
  }

  componentDidMount() {
    this.fetchPopularRepos();
  }

  fetchPopularRepos() {
    const languages = ['ruby', 'php', 'javascript', 'java', 'python', 'css'];
    languages.map(l => fetch(`https://api.github.com/search/repositories?q=topic:${l}&client_id=edc304d4e5871143c167&client_secret=39e5f4613d7c4c23e96b7ad2f0b2b7546e05fb19&sort=stars&order=desc`, {
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
      },
    })
      .then(res => res.json())
      .then((body) => {
        const topFive = body.items.filter((_, i) => i < 5);
        console.log(l, topFive);
        this.setState(prevState => ({
          popularRepos: [...prevState.popularRepos, ...topFive],
        }));
      }));
  }

  render() {
    const sorted = this.state.popularRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    console.log(sorted);
    return (
      <div>Home</div>
    );
  }
}

export default withAppContext(Home);
