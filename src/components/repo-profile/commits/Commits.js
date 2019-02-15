import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from '@nivo/calendar';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';
import Error from '../../shared/error/Error';

const Commits = ({ commits, hasError, errorMessage, isLoading }) => (
  <Panel title="Commits count">
    {hasError && (
      <Error source="GitHub" message={errorMessage} />
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
  errorMessage: PropTypes.string,
  commits: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Commits.defaultProps = {
  errorMessage: '',
  commits: [],
  isLoading: false,
  hasError: false,
};

export default Commits;
