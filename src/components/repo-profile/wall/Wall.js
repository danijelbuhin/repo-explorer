import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Calendar } from '@nivo/calendar';
import { Scrollbars } from 'react-custom-scrollbars';

import withAppContext from '../../shared/app/withAppContext';
import generateTopic from '../../../utils/generateTopic';
import repoColors from '../../../utils/repoColors.json';
import Panel from '../panel/Panel';
import SimilarRepos from '../similar-repos/SimilarRepos';

const Wrapper = styled.div`

`;

const LanguagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const Language = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 80px;
  margin: 15px 15px 15px 0;
  padding: 10px;

  color: #000;
  text-decoration: none;

  border: 1px solid #F4F6F9;
  border-radius: 50px;

  cursor: pointer;
  transition: all .2s ease-in-out;

  &:hover {
    background: #f7f7f7;
  }
`;

const LanguageDot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 100%;

  margin-right: 5px;

  background: ${({ background }) => background ? background : '#c1c1c1'};
`;

const LanguageName = styled.div`
  span {
    display: block;
    font-size: 10px;
  }
`;

const ContributorsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const Contributor = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px 10px;
  padding: 10px;

  border: 1px solid #F4F6F9;
  border-radius: 50px;
`;

const ContributorAvatar = styled.img`
  width: 32px;
  height: 32px;

  border-radius: 100%;
  margin-right: 10px;
`;

const ContributorName = styled.strong`
  font-size: 16px;
  span {
    display: block;
    font-size: 10px;
    font-weight: 400;
  }
`;

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;

  color: #ec4343;
`;

const totalBytes = data => Object.values(data).reduce((acc, curr) => acc + curr, 0);

const Wall = ({
  appContext,
  repo,
  commits,
  languages,
  contributors,
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
      {Object.keys(languages.data).length > 0 && (
        <Panel title="Languages list">
          <Scrollbars autoHeight>
            <LanguagesWrapper>
              {!languages.hasError && Object.keys(languages.data).map(language => (
                <Language key={language} to={`/search?q=${encodeURIComponent(language.toLowerCase())}`}>
                  <LanguageDot background={repoColors[language].color} />
                  <LanguageName>
                    {language}
                    {(languages.data[language] / totalBytes(languages.data) * 100).toFixed(2) === '0.00' ? (
                      <span>{'>'}0.01%</span>
                    ) : (
                      <span>{(languages.data[language] / totalBytes(languages.data) * 100).toFixed(2)} %</span>
                    )}
                  </LanguageName>
                </Language>
              ))}
              {languages.hasError && (
                <Error>An error has occured while trying to fetch languages for this repo</Error>
              )}
            </LanguagesWrapper>
          </Scrollbars>
        </Panel>
      )}
      <Panel title="Contributors">
        <Scrollbars autoHeight>
          <ContributorsWrapper>
            {!contributors.isLoading && !contributors.hasError && contributors.data.map(contributor => (
              <Contributor key={contributor.id}>
                <ContributorAvatar src={contributor.avatar_url} />
                <ContributorName>
                  {contributor.login}
                  <span>{contributor.contributions} contributions</span>
                </ContributorName>
              </Contributor>
            ))}
          </ContributorsWrapper>
        </Scrollbars>
      </Panel>
      <Panel title="Commits count">
        {commits.hasError && (
          <Error>
            An error occurred while trying to fetch commits for this repo.
            <button type="button" onClick={fetchCommits}>Try again?</button>
          </Error>
        )}
        {!commits.isLoading && !commits.hasError && (
          <Scrollbars style={{ width: '100%', height: 410 }}>
            {!commits.hasError && commits.data.length > 0 && (
              <Calendar
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
                  top: 50,
                  right: 0,
                  left: 30,
                  bottom: 0,
                }}
                width={1000}
                height={400}
                yearSpacing={40}
                monthBorderColor="#ffffff"
                monthLegendOffset={10}
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
                tooltip={({ day, value }) => <div>{value} commits on {moment(day).format('MMMM Do, YYYY')}</div>}
              />
            )}
          </Scrollbars>
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
  contributors: PropTypes.object,
  fetchCommits: PropTypes.func,
};

Wall.defaultProps = {
  repo: {},
  commits: {},
  languages: {},
  contributors: {},
  fetchCommits: () => {},
};

export default withAppContext(Wall);
