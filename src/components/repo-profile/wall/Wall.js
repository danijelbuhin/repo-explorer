import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { ResponsiveCalendar } from '@nivo/calendar';

import withAppContext from '../../shared/app/withAppContext';
import generateTopic from '../../../utils/generateTopic';
import repoColors from '../../../utils/repoColors.json';
import Panel from '../panel/Panel';
import SimilarRepos from '../similar-repos/SimilarRepos';

const Wrapper = styled.div`

`;

const LanguagesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Language = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 10px;
`;

const LanguageDot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 100%;

  margin-right: 5px;

  background: ${({ background }) => background ? background : '#f7f7f7'};
`;

const LanguageName = styled.div`
  span {
    display: block;
    font-size: 10px;
  }
`;

const totalBytes = data => Object.values(data).reduce((acc, curr) => acc + curr, 0);

const Wall = ({
  appContext,
  repo,
  commits,
  languages,
  fetchCommits,
}) => {
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (Object.keys(repo).length > 0) {
      setTopic(generateTopic({ topics: repo.topics, language: repo.language }));
    }
    return () => {
      setTopic(null);
    };
  }, [repo]);

  return (
    <Wrapper>
      <Panel title="Languages list">
        <LanguagesWrapper>
          {!languages.loading && Object.keys(languages.data).length > 0 && Object.keys(languages.data).map(language => (
            <Language key={language}>
              <LanguageDot background={repoColors[language].color} />
              <LanguageName>
                {language}
                <span>{(languages.data[language] / totalBytes(languages.data) * 100).toFixed(2)} %</span>
              </LanguageName>
            </Language>
          ))}
        </LanguagesWrapper>
      </Panel>
      <Panel title="Commits count">
        {commits.hasError && (
          <p>
            An error occured while trying to fetch commit count.
            <button type="button" onClick={() => fetchCommits(repo.full_name)}>Try again</button>
          </p>
        )}
        {!commits.isLoading && !commits.hasError && (
          <div style={{ width: '100%', height: 470 }}>
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
                tooltip={({ day, value }) => <div>{value} commits on {moment(day).format('MMMM Do, YYYY')}</div>}
              />
            )}
          </div>
        )}
      </Panel>
      <Panel title="Repos with similar topic" isClosable={false}>
        <SimilarRepos
          topic={topic}
          searchRepo={appContext.searchRepo}
        />
      </Panel>
    </Wrapper>
  );
};

Wall.propTypes = {
  appContext: PropTypes.shape({
    searchRepo: PropTypes.func,
  }).isRequired,
  repo: PropTypes.object,
  commits: PropTypes.object,
  languages: PropTypes.object,
  fetchCommits: PropTypes.func,
};

Wall.defaultProps = {
  repo: {},
  commits: {},
  languages: {},
  fetchCommits: () => {},
};

export default withAppContext(Wall);
