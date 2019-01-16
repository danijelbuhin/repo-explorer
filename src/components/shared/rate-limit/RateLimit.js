import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

import withAppContext from '../app/withAppContext';

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
    },
  },
}) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
    { isLoading && <SpinnerWrapper><Spinner /></SpinnerWrapper> }
    <div>
      Search Rate Limit:
      <ul>
        <li><strong>Limit: </strong> {search.limit}</li>
        <li><strong>Remaining: </strong> {search.remaining}</li>
        <li><strong>Reset: </strong> {`${moment(search.reset).format('DD MMM YYYY, HH:mm:ss')}h`}</li>
      </ul>
    </div>
    <div>
      Core Rate Limit:
      <ul>
        <li><strong>Limit: </strong> {core.limit}</li>
        <li><strong>Remaining: </strong> {core.remaining}</li>
        <li><strong>Reset: </strong> {`${moment(core.reset).format('DD MMM YYYY, HH:mm:ss')}h`}</li>
      </ul>
    </div>
  </div>
);

RateLimit.propTypes = {
  appContext: PropTypes.shape({
    rateLimit: PropTypes.shape({
      isLoading: PropTypes.bool,
      search: PropTypes.object,
      core: PropTypes.object,
    }),
  }).isRequired,
};

export default withAppContext(RateLimit);
