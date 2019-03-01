import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Line } from '@nivo/line';
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

const Participation = ({
  participation,
  hasError,
  errorMessage,
  isLoading,
  fetchParticipation,
}) => {
  const groupData = (data = []) => { // eslint-disable-line
    const months = data.map((value, i) => {
      const date = moment().subtract(52 - i, 'weeks').toDate();
      return {
        month: moment(date).format('MMM YYYY'),
        value,
      };
    });
    return Array.from(
      months.reduce(
        (m, { month, value }) => m.set(month, (m.get(month) || 0) + value),
        new Map, // eslint-disable-line
      ),
      ([month, value]) => ({ month, value }),
    );
  };

  const transformData = (data = {}) => { //eslint-disable-line
    return Object.keys(data).map((key) => { //eslint-disable-line
      const groupedData = groupData(data[key]);
      return {
        id: key === 'all' ? 'All Contributors' : 'Repo Owner',
        color: key !== 'all' ? '#89E051' : '#3E97FF',
        data: groupedData.map((val) => { //eslint-disable-line
          return {
            x: val.month,
            y: val.value,
          };
        }),
      };
    });
  };

  const data = transformData(participation);

  return (
    <Panel title="Commit participation in the last 12 months">
      {data.length === 0 && (
        <Warning>
          <span>No commits have been found.</span>
          <span>
            Note: GitHub may return empty results if statistics calculation was not finished.
          </span>
          <Button onClick={fetchParticipation} disabled={isLoading}>{isLoading ? 'Fetching commits...' : 'Fetch commits again'}</Button>
        </Warning>
      )}
      {hasError && (
        <Error source="GitHub" message={errorMessage} />
      )}
      {!isLoading && !hasError && data.length > 0 && (
        <Scrollbars style={{ width: '100%', height: 410 }}>
          {!hasError && data.length > 0 && (
            <Line
              width={1060}
              height={400}
              data={data}
              margin={{
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              }}
              xScale={{
                type: 'point',
              }}
              yScale={{
                type: 'linear',
                stacked: false,
                min: 'auto',
                max: 'auto',
              }}
              colorBy={e => e.color}
              curve="monotoneX"
              dotSize={10}
              lineWidth={3}
              dotColor="inherit:darker(0.3)"
              dotBorderWidth={3}
              dotBorderColor="#ffffff"
              enableDotLabel={false}
              dotLabelYOffset={-12}
              animate
              motionStiffness={90}
              motionDamping={15}
              legends={[
                {
                  anchor: 'center',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -185,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemsSpacing: 4,
                  symbolSize: 13,
                  symbolShape: 'circle',
                  itemDirection: 'left-to-right',
                  itemTextColor: '#777',
                },
              ]}
            />
          )}
        </Scrollbars>
      )}
    </Panel>
  );
};

Participation.propTypes = {
  errorMessage: PropTypes.string,
  participation: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  fetchParticipation: PropTypes.func.isRequired,
};

Participation.defaultProps = {
  errorMessage: '',
  participation: {},
  isLoading: false,
  hasError: false,
};

export default Participation;
