import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Panel from '../panel/Panel';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Total = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  padding: 10px;
`;

const Count = styled.strong`
  font-size: 24px;
  color: #3E97FF;
`;

const Totals = ({
  stars,
  watchers,
  forks,
  subscribers,
  issues,
  views,
}) => (
  <Panel>
    <Wrapper>
      <Total>
        Stars
        <Count>{stars}</Count>
      </Total>
      <Total>
        Watchers
        <Count>{watchers}</Count>
      </Total>
      <Total>
        Subscribers
        <Count>{subscribers}</Count>
      </Total>
      <Total>
        Forks
        <Count>{forks}</Count>
      </Total>
      <Total>
        Open Issues
        <Count>{issues}</Count>
      </Total>
      <Total>
        Explorer Views
        <Count>{views}</Count>
      </Total>
    </Wrapper>
  </Panel>
);

Totals.propTypes = {
  stars: PropTypes.number,
  watchers: PropTypes.number,
  forks: PropTypes.number,
  subscribers: PropTypes.number,
  issues: PropTypes.number,
  views: PropTypes.number,
};

Totals.defaultProps = {
  stars: 0,
  watchers: 0,
  forks: 0,
  subscribers: 0,
  issues: 0,
  views: 0,
};

export default Totals;
