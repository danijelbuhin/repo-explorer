import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import withAppContext from '../app/withAppContext';

const RateLimit = ({
  appContext: {
    rateLimit: {
      search,
      core,
    },
  },
}) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
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
      search: PropTypes.object,
      core: PropTypes.object,
    }),
  }).isRequired,
};

export default withAppContext(RateLimit);
