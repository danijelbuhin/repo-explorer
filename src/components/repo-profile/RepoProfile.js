import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import styled from 'styled-components';

import firebase from '../../services/firebase';

import withAppContext from '../shared/app/withAppContext';
import useApiState from '../../hooks/useApiState';
import generateTopic from '../../utils/generateTopic';

import Loader from '../shared/loader/Loader';
import Information from './information/Information';
import Languages from './languages/Languages';
import Commits from './commits/Commits';
import SimilarRepos from './similar-repos/SimilarRepos';
import Contributors from './contributors/Contributors';

const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  padding: 0 10px;
  margin: 20px auto;
`;

const storeView = (params, country, countryCode) => {
  firebase.views.doc(String(params.id)).get().then((doc) => {
    if (doc.exists) {
      firebase.views.doc(String(params.id)).set({
        ...params,
        views: doc.data().views + 1,
        viewed_at: moment().toDate().getTime(),
        viewed_from: {
          country,
          country_code: countryCode.toLowerCase(),
        },
      });
    } else {
      firebase.views.doc(String(params.id)).set({
        ...params,
        views: 1,
        viewed_at: moment().toDate().getTime(),
        viewed_from: {
          country,
          country_code: countryCode.toLowerCase(),
        },
      });
    }
  });
};

const handleView = (params) => {
  axios.get('https://json.geoiplookup.io/').then(({ data }) => {
    storeView(params, data.country_name, data.country_code);
  }).catch(() => {
    storeView(params, 'Unknown', '');
  });
};

const transformCommitData = (data = []) => {// eslint-disable-line
  return data.map((val) => { // eslint-disable-line
    return val.days.map((d, i) => ({
      day: moment(val.week * 1000).add(i, 'day').format('YYYY-MM-DD'),
      value: d,
    })).filter(d => d.value !== 0);
  }).flat();
};

const RepoProfile = (props) => {
  const { match: { params: { id } }, appContext } = props;

  const [apiState, setApiState] = useApiState({ isLoading: true, hasError: false });
  const [repo, setRepo] = useState({});

  const [commitsState, setCommitsState] = useApiState();
  const [commits, setCommits] = useState([]);

  const [contributorsState, setContributorsState] = useApiState();
  const [contributors, setContributors] = useState([]);

  const [languagesState, setLanguagesState] = useApiState();
  const [languages, setLanguages] = useState({});

  const [topic, setTopic] = useState(null);

  const fetchCommits = (repo_name) => {
    setCommitsState({ isLoading: true, hasError: false });
    return appContext
      .fetchCommits(decodeURIComponent(repo_name))
      .then((items) => {
        setCommitsState({ isLoading: false, hasError: false });
        setCommits(transformCommitData(items));
      })
      .catch(() => {
        setCommitsState({ isLoading: false, hasError: true });
      });
  };

  const fetchContributors = (repo_name) => {
    setContributorsState({ isLoading: true, hasError: false });
    return appContext
      .fetchContributors(decodeURIComponent(repo_name))
      .then((items) => {
        setContributorsState({ isLoading: false, hasError: false });
        setContributors(items);
      })
      .catch(() => {
        setContributorsState({ isLoading: false, hasError: true });
      });
  };

  const fetchLanguages = (repo_name) => {
    setLanguagesState({ isLoading: true, hasError: false });
    return appContext
      .fetchLanguages(decodeURIComponent(repo_name))
      .then((items) => {
        setLanguagesState({ isLoading: false, hasError: false });
        setLanguages(items);
      })
      .catch(() => {
        setLanguages({});
        setLanguagesState({ isLoading: false, hasError: true });
      });
  };

  const fetchRepo = () => {
    setApiState({ isLoading: true, hasError: false });
    return appContext.fetchRepo(decodeURIComponent(id))
      .then((data) => {
        document.title = `Exploring ${data.full_name} | Repo Explorer`;
        handleView({
          avatar_url: data.owner.avatar_url,
          full_name: data.full_name,
          id: data.id,
          name: data.name,
          stargazers_count: data.stargazers_count,
        });
        setRepo(data);
        setTopic(generateTopic({ topics: data.topics, language: data.language }));
        return data;
      })
      .catch(() => {
        setApiState({ isLoading: false, hasError: true });
      });
  };

  useEffect(() => {
    fetchRepo().then((data) => {
      axios
        .all([fetchCommits(data.full_name), fetchLanguages(data.full_name), fetchContributors(data.full_name)])
        .then(() => {
          setApiState({ isLoading: false, hasError: false });
        })
        .catch(() => setApiState({ isLoading: false, hasError: true }));
    });
    return () => {
      setCommits([]);
      setLanguages([]);
    };
  }, [id]);

  if (apiState.isLoading) {
    return <Loader text={`Fetching all information about ${decodeURIComponent(id)}`} />;
  }

  return (
    <Wrapper>
      <Information
        fullName={repo.full_name}
        avatarUrl={repo.owner && repo.owner.avatar_url}
        description={repo.description}
        createdAt={repo.created_at}
        updatedAt={repo.updated_at}
        topics={repo.topics}
      />
      <Languages
        languages={languages}
        isLoading={languagesState.isLoading}
        hasError={languagesState.hasError}
      />
      <Contributors
        contributors={contributors}
        isLoading={contributorsState.isLoading}
        hasError={contributorsState.hasError}
      />
      <Commits
        commits={commits}
        isLoading={commitsState.isLoading}
        hasError={commitsState.hasError}
        fetchCommits={appContext.fetchCommits}
      />
      <SimilarRepos
        topic={topic}
        searchRepo={appContext.searchRepo}
      />
    </Wrapper>
  );
};

RepoProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
    fetchLanguages: PropTypes.func,
    fetchCommits: PropTypes.func,
    fetchContributors: PropTypes.func,
  }).isRequired,
};

export default withAppContext(RepoProfile);
