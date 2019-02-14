import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Calendar } from '@nivo/calendar';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;

  color: #ec4343;
`;

const Commits = ({ commits, hasError, fetchCommits, isLoading }) => (
  <Panel title="Commits count">
    {hasError && (
      <Error>
        An error occurred while trying to fetch commits for this repo.
        <button type="button" onClick={fetchCommits}>Try again?</button>
      </Error>
    )}
    {!isLoading && !hasError && (
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
  commits: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  fetchCommits: PropTypes.func,
};

Commits.defaultProps = {
  commits: [],
  isLoading: false,
  hasError: false,
  fetchCommits: () => {},
};

export default Commits;
