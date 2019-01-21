import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../app/withAppContext';
import percentToColor from '../../../utils/percentToColor';
import generatePercentage from '../../../utils/generatePercentage';

import GaugeChart from './gauge-chart/GaugeChart';

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.5);
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;

  border-top: 1px solid #335abb;
  border-bottom: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 100%;
  background: transparent;

  animation: spin 0.6s infinite linear;
  transform: rotateZ(0deg);

  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    } to {
      transform: rotateZ(360deg);
    }
  }
`;

const RateLimit = ({
  appContext: {
    rateLimit: {
      search,
      core,
      isLoading,
      latest_usage,
    },
    user,
    isAuthenticated,
    authenticate,
    logOut,
  },
}) => (
  <div style={{ border: '1px solid #000', padding: 10 }}>
    <h2>Hello {isAuthenticated ? user.name : 'Guest'}, you{'\''}re using {isAuthenticated ? 'your own' : 'shared'} rate limit</h2>
    {isAuthenticated && (
      <button onClick={logOut} type="button">Log out</button>
    )}
    {!isAuthenticated && (
      <p>
        <button onClick={authenticate} type="button">Authenticate with github</button> {' '}
        to get your own limits.
      </p>
    )}
    <p>
      <strong>Latest usage: </strong>
      {`${moment(latest_usage * 1000).format('DD MMM YYYY, HH:mm:ss')}h`}
    </p>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {isLoading && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <GaugeChart
            color={percentToColor((search.remaining / search.limit) * 100)}
            percentage={generatePercentage(search.remaining, search.limit)}
            upValue={search.remaining}
            downValue={search.limit}
          />
          <span style={{ marginLeft: 10 }}>
            <strong>Search API usage</strong><br />
            <strong>Reset time: </strong>
            {`${moment(search.reset * 1000).format('DD MMM YYYY, HH:mm:ss')}h`}
          </span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GaugeChart
              color={percentToColor((core.remaining / core.limit) * 100)}
              percentage={generatePercentage(core.remaining, core.limit)}
              upValue={core.remaining}
              downValue={core.limit}
            />
            <span style={{ marginLeft: 10 }}>
              <strong>Core API usage</strong><br />
              <strong>Reset time: </strong>
              {`${moment(core.reset * 1000).format('DD MMM YYYY, HH:mm:ss')}h`}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

RateLimit.propTypes = {
  appContext: PropTypes.shape({
    rateLimit: PropTypes.shape({
      latest_usage: PropTypes.number,
      isLoading: PropTypes.bool,
      search: PropTypes.object,
      core: PropTypes.object,
    }),
  }).isRequired,
};

export default withAppContext(RateLimit);
