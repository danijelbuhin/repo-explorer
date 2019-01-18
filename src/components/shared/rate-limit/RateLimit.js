import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../app/withAppContext';
import percentToColor from '../../../utils/percentToColor';

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
        Search Rate Limit:
        <ul>
          <li><strong>Limit: </strong> {search.limit}</li>
          <li>
            <strong>Remaining: </strong>
            <span style={{ padding: '2px 4px', background: percentToColor((search.remaining / search.limit) * 100) }}>
              {search.remaining}
            </span>
          </li>
          <li>
            <strong>Reset time: </strong>
            {`${moment(search.reset * 1000).format('DD MMM YYYY, HH:mm:ss')}h`}
          </li>
        </ul>
      </div>
      <div>
        Core Rate Limit:
        <ul>
          <li><strong>Limit: </strong> {core.limit}</li>
          <li><strong>Remaining: </strong>
            <span style={{ padding: '2px 4px', background: percentToColor((core.remaining / core.limit) * 100) }}>
              {core.remaining}
            </span>
          </li>
          <li><strong>Reset time: </strong>
            {`${moment(core.reset * 1000).format('DD MMM YYYY, HH:mm:ss')}h`}
          </li>
        </ul>
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
