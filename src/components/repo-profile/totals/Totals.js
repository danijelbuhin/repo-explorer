import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Panel from '../panel/Panel';
import { ReactComponent as TrendingUpSVG } from './assets/TrendingUp.svg';
import { ReactComponent as TrendingDownSVG } from './assets/TrendingDown.svg';

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

const Label = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Trending = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;

  font-size: 12px;
  svg {
    width: 14px;
    height: 14px;
    margin-right: 5px;
    stroke: ${({ trend }) => trend === 'rising' ? '#6ece31' : '#FF3E3E'};
  }
`;

const showTrending = (newStat, oldStat) => {
  if (newStat === oldStat) return null;
  return (
    <Trending trend={newStat > oldStat ? 'rising' : 'falling'}>
      {newStat > oldStat && (
        <React.Fragment>
          <TrendingUpSVG />
          +{newStat - oldStat}
        </React.Fragment>
      )}
      {newStat < oldStat && (
        <React.Fragment>
          <TrendingDownSVG />
          -{oldStat - newStat}
        </React.Fragment>
      )}
    </Trending>
  );
};

const Totals = ({
  stars,
  watchers,
  forks,
  subscribers,
  issues,
  views,
  stats,
}) => (
  <Panel>
    <Wrapper>
      <Total>
        <Label>
          Stars
          {showTrending(stars, stats.stars)}
        </Label>
        <Count>{stars}</Count>
      </Total>
      <Total>
        <Label>
          Watchers
          {showTrending(watchers, stats.watchers)}
        </Label>
        <Count>
          {watchers}
        </Count>
      </Total>
      <Total>
        <Label>
          Subscribers
          {showTrending(subscribers, stats.subscribers)}
        </Label>
        <Count>
          {subscribers}
        </Count>
      </Total>
      <Total>
        <Label>
          Forks
          {showTrending(forks, stats.forks)}
        </Label>
        <Count>
          {forks}
        </Count>
      </Total>
      <Total>
        <Label>
          Open Issues
          {showTrending(issues, stats.issues)}
        </Label>
        <Count>
          {issues}
        </Count>
      </Total>
      <Total>
        Explorer Views
        <Count>
          {views}
        </Count>
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
  stats: PropTypes.shape({
    stars: PropTypes.number,
    watchers: PropTypes.number,
    forks: PropTypes.number,
    subscribers: PropTypes.number,
    issues: PropTypes.number,
    views: PropTypes.number,
  }),
};

Totals.defaultProps = {
  stars: 0,
  watchers: 0,
  forks: 0,
  subscribers: 0,
  issues: 0,
  views: 0,
  stats: {},
};

export default Totals;
