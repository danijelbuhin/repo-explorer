import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { ResponsiveCalendar } from '@nivo/calendar';

import firebase from '../../services/firebase';

import withAppContext from '../shared/app/withAppContext';
import useApiState from '../../hooks/useApiState';
import generateTopic from '../../utils/generateTopic';

import Loader from '../shared/loader/Loader';
import SimilarRepos from './similar-repos/SimilarRepos';

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

  const [commits, setCommits] = useState([]);

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
        appContext
          .fetchCommits(decodeURIComponent(id))
          .then((items) => {
            setCommits(transformCommitData(items));
          })
          .catch(err => console.log(err));
      })
      .catch(() => {
        setApiState({ isLoading: false, hasError: true });
      });
    return () => {
      setCommits([]);
    };
  }, [id]);

  if (apiState.isLoading) {
    return <Loader text={`Fetching information about ${decodeURIComponent(id)}`} />;
  }


  return (
    <div>
      {repo.full_name}
      <h3>Commit count</h3>
      {commits.length > 0 && (
        <div style={{ width: 800, height: 400 }}>
          <ResponsiveCalendar
            data={commits}
            from={commits[0].day}
            to={commits[commits.length - 1].day}
            emptyColor="#eeeeee"
            colors={[
              '#a3ccff',
              '#77b5ff',
              '#5ea8ff',
              '#3E97FF',
            ]}
            margin={{
              top: 100,
              right: 30,
              bottom: 60,
              left: 30,
            }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            monthLegendOffset={10}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            tooltip={({ day, value }) => <div>{moment(day).format('dddd, MMMM Do, YYYY')} - {value} commits</div>}
          />
        </div>
      )}
      <SimilarRepos
        topic={topic}
        searchRepo={appContext.searchRepo}
      />
    </div>
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
