import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Panel from '../panel/Panel';
import { ReactComponent as TrendingUpSVG } from './assets/TrendingUp.svg';
import { ReactComponent as TrendingDownSVG } from './assets/TrendingDown.svg';
import Button from '../../shared/button/Button';

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

const Totals = ({
  stars,
  watchers,
  forks,
  subscribers,
  issues,
  views,
  stats,
  toggleViews,
}) => (
  <Panel>
    <Wrapper>
      <Total>
        <Label>
          Stars
          <Trending trend={stars > stats.stars ? 'rising' : 'falling'}>
            {stars > stats.stars && (
              <React.Fragment>
                <TrendingUpSVG />
                +{stars - stats.stars}
              </React.Fragment>
            )}
            {stars < stats.stars && (
              <React.Fragment>
                <TrendingDownSVG />
                -{stats.stars - stars}
              </React.Fragment>
            )}
          </Trending>
        </Label>
        <Count>{stars}</Count>
      </Total>
      <Total>
        <Label>
          Watchers
          <Trending trend={watchers > stats.watchers ? 'rising' : 'falling'}>
            {watchers > stats.watchers && (
              <React.Fragment>
                <TrendingUpSVG />
                +{watchers - stats.watchers}
              </React.Fragment>
            )}
            {watchers < stats.watchers && (
              <React.Fragment>
                <TrendingDownSVG />
                -{stats.watchers - watchers}
              </React.Fragment>
            )}
          </Trending>
        </Label>
        <Count>
          {watchers}
        </Count>
      </Total>
      <Total>
        <Label>
          Subscribers
          <Trending trend={subscribers > stats.subscribers ? 'rising' : 'falling'}>
            {subscribers > stats.subscribers && (
              <React.Fragment>
                <TrendingUpSVG />
                +{subscribers - stats.subscribers}
              </React.Fragment>
            )}
            {subscribers < stats.subscribers && (
              <React.Fragment>
                <TrendingDownSVG />
                -{stats.subscribers - subscribers}
              </React.Fragment>
            )}
          </Trending>
        </Label>
        <Count>
          {subscribers}
        </Count>
      </Total>
      <Total>
        <Label>
          Forks
          <Trending trend={forks > stats.forks ? 'rising' : 'falling'}>
            {forks > stats.forks && (
              <React.Fragment>
                <TrendingUpSVG />
                +{forks - stats.forks}
              </React.Fragment>
            )}
            {forks < stats.forks && (
              <React.Fragment>
                <TrendingDownSVG />
                -{stats.forks - forks}
              </React.Fragment>
            )}
          </Trending>
        </Label>
        <Count>
          {forks}
        </Count>
      </Total>
      <Total>
        <Label>
          Open Issues
          <Trending trend={issues > stats.issues ? 'rising' : 'falling'}>
            {issues > stats.issues && (
              <React.Fragment>
                <TrendingUpSVG />
                +{issues - stats.issues}
              </React.Fragment>
            )}
            {issues < stats.issues && (
              <React.Fragment>
                <TrendingDownSVG />
                -{stats.issues - issues}
              </React.Fragment>
            )}
          </Trending>
        </Label>
        <Count>
          {issues}
        </Count>
      </Total>
      <Total>
        Explorer Views
        <Count>
          {views}
          <Button onClick={toggleViews}>Toggle</Button>
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
