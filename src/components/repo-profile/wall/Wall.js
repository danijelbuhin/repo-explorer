import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { ResponsiveCalendar } from '@nivo/calendar';

import { Panel } from '../RepoProfile';

import repoColors from '../../../utils/repoColors.json';

const Wrapper = styled.div`

`;

const totalBytes = data => Object.values(data).reduce((acc, curr) => acc + curr, 0);

const Wall = ({
  repo,
  commits,
  languages,
  fetchCommits,
  children,
}) => (
  <Wrapper>
    <Panel>
      Languages <br />
      {!languages.loading && Object.keys(languages.data).length > 0 && Object.keys(languages.data).map(language => (
        <div key={language}>
          {language} <br />
          {languages.data[language] / totalBytes(languages.data) * 100} % <br />
          <div
            style={{
              height: 40,
              background: repoColors[language].color,
              marginBottom: 10,
              width: `${languages.data[language] / totalBytes(languages.data) * 100}%`,
            }}
          />
        </div>
      ))}
    </Panel>
    <Panel>
      {commits.hasError && (
        <p>
          An error occured while trying to fetch commit count.
          <button type="button" onClick={() => fetchCommits(repo.full_name)}>Try again</button>
        </p>
      )}
      {!commits.isLoading && !commits.hasError && (
        <div style={{ width: '100%', height: 470 }}>
          <h3>Commit count</h3>
          {!commits.hasError && commits.data.length > 0 && (
            <ResponsiveCalendar
              data={commits.data}
              from={commits.data[0].day}
              to={commits.data[commits.data.length - 1].day}
              emptyColor="#eeeeee"
              colors={[
                '#a3ccff',
                '#77b5ff',
                '#5ea8ff',
                '#3E97FF',
              ]}
              margin={{
                top: 100,
                right: 30,
                bottom: 60,
                left: 30,
              }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              monthLegendOffset={10}
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
              tooltip={({ day, value }) => <div>{moment(day).format('dddd, MMMM Do, YYYY')} - {value} commits</div>}
            />
          )}
        </div>
      )}
    </Panel>

    {children}
  </Wrapper>
);

Wall.propTypes = {
  repo: PropTypes.object,
  commits: PropTypes.object,
  languages: PropTypes.object,
  fetchCommits: PropTypes.func,
  children: PropTypes.node,
};

Wall.defaultProps = {
  repo: {},
  commits: {},
  languages: {},
  fetchCommits: () => {},
  children: null,
};

export default Wall;
