import React from 'react';
import PropTypes from 'prop-types';
import { Line } from '@nivo/line';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';
import Error from '../../shared/error/Error';

const Participation = ({ participation, hasError, errorMessage, isLoading }) => (
  <Panel title="Commit participation in the last 12 months">
    {hasError && (
      <Error source="GitHub" message={errorMessage} />
    )}
    {!isLoading && !hasError && participation.length > 0 && (
      <Scrollbars style={{ width: '100%', height: 410 }}>
        {!hasError && participation.length > 0 && (
          <Line
            width={1060}
            height={400}
            data={participation}
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

Participation.propTypes = {
  errorMessage: PropTypes.string,
  participation: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Participation.defaultProps = {
  errorMessage: '',
  participation: [],
  isLoading: false,
  hasError: false,
};

export default Participation;
