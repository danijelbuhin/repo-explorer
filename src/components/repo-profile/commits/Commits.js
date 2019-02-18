import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { Calendar } from '@nivo/calendar';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';
import Button from '../../shared/button/Button';
import Error from '../../shared/error/Error';

const Warning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 40px;

  span {
    display: block;
  }
`;

const Commits = ({ commits, hasError, errorMessage, isLoading, fetchCommits }) => (
  <Panel title="Commits count">
    {commits.length === 0 && (
      <Warning>
        <span>No commits have been found.</span>
        <span>
          Note: GitHub sometimes returns empty results. If you think that this might be the case,
        </span>
        <Button onClick={fetchCommits} disabled={isLoading}>{isLoading ? 'Fetching commits...' : 'Fetch commits again'}</Button>
      </Warning>
    )}
    {hasError && (
      <Error source="GitHub" message={errorMessage} />
    )}
    {!isLoading && !hasError && commits.length > 0 && (
      <Scrollbars style={{ width: '100%', height: 410 }}>
        {!hasError && commits.length > 0 && (
          <Calendar
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
              top: 50,
              right: 0,
              left: 30,
              bottom: 0,
            }}
            width={1000}
            height={400}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            monthLegendOffset={10}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            tooltip={({ day, value }) => <div>{value} commits on {moment(day).format('MMMM Do, YYYY')}</div>}
          />
        )}
      </Scrollbars>
    )}
  </Panel>
);

Commits.propTypes = {
  errorMessage: PropTypes.string,
  commits: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  fetchCommits: PropTypes.func,
};

Commits.defaultProps = {
  errorMessage: '',
  commits: [],
  isLoading: false,
  hasError: false,
  fetchCommits: () => {},
};

export default Commits;