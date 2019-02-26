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
import Error from '../shared/error/Error';
import Totals from './totals/Totals';
import Participation from './participation/Participation';
import Readme from './readme/Readme';

const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  padding: 0 10px;
  margin: 20px auto;
`;

const RepoProfile = (props) => {
  const { match: { params: { id } }, appContext } = props;

  const [apiState, setApiState] = useApiState({ isLoading: true, hasError: false });
  const [repo, setRepo] = useState({});

  const [commitsState, setCommitsState] = useApiState();
  const [commits, setCommits] = useState([]);

  const [readmeState, setReadmeState] = useApiState();
  const [readme, setReadme] = useState('');

  const [participationState, setParticipationState] = useApiState();
  const [participation, setParticipation] = useState([]);

  const [contributorsState, setContributorsState] = useApiState();
  const [contributors, setContributors] = useState([]);

  const [languagesState, setLanguagesState] = useApiState();
  const [languages, setLanguages] = useState({});

  const [topic, setTopic] = useState(null);

  const [views, setViews] = useState(0);

  const getRepoViews = (repoId) => { // eslint-disable-line
    return firebase.views.doc(String(repoId)).get().then((doc) => {
      setCommitsState({ isLoading: false, hasError: false });
      if (doc.exists) {
        setViews(doc.data().views);
      }
      return 0;
    });
  };

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
        setTopic(generateTopic({
          topics: data.topics,
          language: data.language,
          name: data.full_name.replace('/', ' '),
          description: data.description,
        }));
        return data;
      });
  };

  const fetchSection = (setHook, setApiHook, apiMethod, initialData, customThen) => {
    setApiHook({ isLoading: true, hasError: false });
    return appContext[apiMethod](decodeURIComponent(id))
      .then((data) => { // eslint-disable-line
        if (customThen) {
          return data;
        }
        setApiHook({ isLoading: false, hasError: false });
        setHook(data);
      })
      .catch(({ response: { data } }) => {
        setHook(initialData);
        setApiHook({ isLoading: false, hasError: true, errorMessage: data.message });
      });
  };

  useEffect(() => {
    fetchRepo()
      .then((data) => {
        axios
          .all([
            fetchSection(setCommits, setCommitsState, 'fetchCommits', [], true).then((items) => {
              setCommitsState({ isLoading: false, hasError: false });
              setCommits(items);
            }),
            fetchSection(setParticipation, setParticipationState, 'fetchParticipation', [], true).then((items) => {
              setParticipationState({ isLoading: false, hasError: false });
              setParticipation(items);
            }),
            fetchSection(setLanguages, setLanguagesState, 'fetchLanguages', []),
            fetchSection(setContributors, setContributorsState, 'fetchContributors', []),
            fetchSection(setReadme, setReadmeState, 'fetchReadme', ''),
            getRepoViews(data.id),
          ])
          .then(() => {
            setApiState({ isLoading: false, hasError: false });
          });
      })
      .catch(({ response: { data } }) => {
        setApiState({ isLoading: false, hasError: true, errorMessage: data.message });
      });
  }, [id]);

  if (apiState.isLoading) {
    return <Loader text={`Fetching all information about ${decodeURIComponent(id)}`} />;
  }

  if (apiState.hasError) {
    return <Error source="github" message={apiState.errorMessage} />;
  }

  return (
    <Wrapper>
      <Information repo={repo} />
      <Totals
        forks={repo.forks_count}
        watchers={repo.watchers}
        stars={repo.stargazers_count}
        issues={repo.open_issues_count}
        subscribers={repo.subscribers_count}
        views={views}
      />
      <Languages
        languages={languages}
        isLoading={languagesState.isLoading}
        hasError={languagesState.hasError}
        errorMessage={languagesState.errorMessage}
      />
      <Contributors
        contributors={contributors}
        isLoading={contributorsState.isLoading}
        hasError={contributorsState.hasError}
        errorMessage={contributorsState.errorMessage}
      />
      <Commits
        commits={commits}
        isLoading={commitsState.isLoading}
        hasError={commitsState.hasError}
        errorMessage={commitsState.errorMessage}
        fetchCommits={() => {
          fetchSection(setCommits, setCommitsState, 'fetchCommits', [], true).then((items) => {
            setCommitsState({ isLoading: false, hasError: false });
            setCommits(items);
          });
        }}
      />
      <Participation
        participation={participation}
        isLoading={participationState.isLoading}
        hasError={participationState.hasError}
        errorMessage={participationState.errorMessage}
        fetchParticipation={() => {
          fetchSection(setParticipation, setParticipationState, 'fetchParticipation', [], true).then((items) => {
            setParticipationState({ isLoading: false, hasError: false });
            setParticipation(items);
          });
        }}
      />
      <SimilarRepos
        id={repo.id}
        topic={topic}
        searchRepo={appContext.searchRepo}
      />
      <Readme
        readme={readme}
        isLoading={readmeState.isLoading}
        hasError={readmeState.hasError}
        errorMessage={readmeState.errorMessage}
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
