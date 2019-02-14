import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as StarSVG } from '../../home/assets/Star.svg';

import Card from '../../shared/repo/Card';
import RepoList from '../../shared/repo/List';

import useApiState from '../../../hooks/useApiState';

const SimilarRepos = (props) => {
  const { topic, searchRepo } = props;

  const [apiState, setApiState] = useApiState();
  const [similarRepos, setSimilarRepos] = useState([]);

  useEffect(() => {
    if (topic) {
      setApiState({ isLoading: true, hasError: false });
      searchRepo(topic, 5)
        .then(({ items }) => {
          setSimilarRepos(items);
          setApiState({ isLoading: false, hasError: false });
        })
        .catch(() => setApiState({ isLoading: false, hasError: true }));
    }
  }, [topic]);

  return (
    <RepoList isLoading={apiState.isLoading}>
      {similarRepos.map(similarRepo => (
        <Card
          key={similarRepo.id}
          avatar={similarRepo.owner.avatar_url}
          name={similarRepo.full_name}
          count={similarRepo.stargazers_count}
          countIcon={<StarSVG />}
          language={similarRepo.language}
          topic={similarRepo.topics[0]}
          id={similarRepo.id}
        />
      ))}
    </RepoList>
  );
};

SimilarRepos.propTypes = {
  topic: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  searchRepo: PropTypes.func.isRequired,
};

SimilarRepos.defaultProps = {
  topic: null,
};

export default SimilarRepos;
