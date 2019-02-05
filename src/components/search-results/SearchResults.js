import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';

class SearchResults extends Component {
  render() {
    const { location: { search } } = this.props;
    const { q: result } = qs.parse(search, { ignoreQueryPrefix: true });
    return (
      <div>Search results for <em>{result}</em></div>
    );
  }
}

SearchResults.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default SearchResults;
