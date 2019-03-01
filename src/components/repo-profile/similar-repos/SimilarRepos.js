import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as StarSVG } from '../../home/assets/Star.svg';

import useApiState from '../../../hooks/useApiState';
import paginate from '../../../utils/paginate';
import Card from '../../shared/repo/Card';
import RepoList from '../../shared/repo/List';
import Panel from '../panel/Panel';
import Pagination from '../../shared/pagination/Pagination';

const SimilarRepos = (props) => {
  const { topic, searchRepo } = props;

  const [apiState, setApiState] = useApiState({ isLoading: true, hasError: false });
  const [similarRepos, setSimilarRepos] = useState([]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (topic) {
      searchRepo(
        {
          q: `topic:${topic}`,
          per_page: 100,
          sort: 'stars',
          order: 'desc',
        },
        props.id,
      )
        .then(({ items }) => {
          setSimilarRepos(items);
          setApiState({ isLoading: false, hasError: false });
        })
        .catch(({ response: { data } }) => setApiState({ isLoading: false, hasError: true, errorMessage: data.message }));
    }
  }, []);

  return (
    <Panel
      title="Repos with similar topic"
      isClosable={false}
    >
      <RepoList
        isLoading={apiState.isLoading}
        hasError={apiState.hasError}
        errorMessage={apiState.errorMessage}
        isEmpty={similarRepos.length === 0}
        emptyMessage="We couldn't find similar repos"
      >
        {paginate(similarRepos, 10, page).map(repo => (
          <Card
            key={repo.id}
            avatar={repo.owner.avatar_url}
            name={repo.full_name}
            count={repo.stargazers_count}
            countIcon={<StarSVG />}
            language={repo.language}
            topic={repo.topics[0]}
            id={repo.id}
          />
        ))}
        <Pagination
          total={similarRepos.length}
          page={page}
          limit={10}
          onPageNext={() => setPage(page + 1)}
          onPagePrevious={() => setPage(page - 1)}
        />
      </RepoList>
    </Panel>
  );
};

SimilarRepos.propTypes = {
  id: PropTypes.number,
  topic: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  searchRepo: PropTypes.func.isRequired,
};

SimilarRepos.defaultProps = {
  id: 0,
  topic: null,
};

export default SimilarRepos;
