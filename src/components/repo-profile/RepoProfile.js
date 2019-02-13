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
import SimilarRepos from './similar-repos/SimilarRepos';
import Wall from './wall/Wall';

const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  padding: 0 10px;
  margin: 20px auto;
`;

export const Panel = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;

  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(212, 221, 237, 0.25);
  background: #fff;
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

  const [apiState, setApiState] = useApiState();
  const [repo, setRepo] = useState({});

  const [topic, setTopic] = useState(null);

  const [commitsState, setCommitsState] = useApiState();
  const [commits, setCommits] = useState([]);

  const [languagesState, setLanguagesState] = useApiState();
  const [languages, setLanguages] = useState([]);

  const fetchCommits = (repo_name) => {
    setCommitsState({ isLoading: true, hasError: false });
    appContext
      .fetchCommits(decodeURIComponent(repo_name))
      .then((items) => {
        setCommitsState({ isLoading: false, hasError: false });
        setCommits(transformCommitData(items));
      })
      .catch(() => {
        setCommitsState({ isLoading: false, hasError: true });
      });
  };

  const fetchLanguages = (repo_name) => {
    setLanguagesState({ isLoading: true, hasError: false });
    appContext
      .fetchLanguages(decodeURIComponent(repo_name))
      .then((items) => {
        setLanguagesState({ isLoading: false, hasError: false });
        setLanguages(items);
      })
      .catch(() => {
        setLanguagesState({ isLoading: false, hasError: true });
      });
  };

  useEffect(() => {
    setApiState({ isLoading: true, hasError: false });
    appContext.fetchRepo(decodeURIComponent(id))
      .then((data) => {
        document.title = `Exploring ${data.full_name} | Repo Explorer`;
        handleView({
          avatar_url: data.owner.avatar_url,
          full_name: data.full_name,
          id: data.id,
          name: data.name,
          stargazers_count: data.stargazers_count,
        });
        setTopic(generateTopic({ topics: data.topics, language: data.language }));
        setApiState({ isLoading: false, hasError: false });
        setRepo(data);
        fetchCommits(data.full_name);
        fetchLanguages(data.full_name);
      })
      .catch(() => {
        setApiState({ isLoading: false, hasError: true });
      });
    return () => {
      setCommits([]);
      setLanguages([]);
    };
  }, [id]);

  if (apiState.isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
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
      <Wall
        repo={repo}
        languages={{
          data: languages,
          isLoading: languagesState.isLoading,
          hasError: languagesState.hasError,
        }}
        commits={{
          data: commits,
          isLoading: commitsState.isLoading,
          hasError: commitsState.hasError,
        }}
      >
        <Panel>
          <SimilarRepos
            topic={topic}
            searchRepo={appContext.searchRepo}
          />
        </Panel>
      </Wall>
    </Wrapper>
  );
};

RepoProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(RepoProfile);
