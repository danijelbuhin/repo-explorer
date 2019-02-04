import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loader from '../shared/loader/Loader';
import withAppContext from '../shared/app/withAppContext';

class RepoProfile extends Component {
  state = {
    isLoading: true,
    hasError: false,
    repo: {},
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    this.props.appContext.fetchRepo(decodeURIComponent(id)).then((data) => {
      this.setState({ isLoading: false, repo: { ...data } });
    });
  }

  render() {
    const { match: { params: { id } } } = this.props;
    const { isLoading, hasError, repo } = this.state;
    if (isLoading && !hasError) {
      return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
    }
    return (
      <div>
        {repo.full_name}
      </div>
    );
  }
}

RepoProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(RepoProfile);
