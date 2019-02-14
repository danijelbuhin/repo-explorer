import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

import repoColors from '../../../utils/repoColors.json';
import Panel from '../panel/Panel';

const Wrapper = styled.div`
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

const Dot = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 100%;

  margin-right: 5px;

  background: ${({ background }) => background ? background : '#c1c1c1'};
`;

const Name = styled.div`
  span {
    display: block;
    font-size: 10px;
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

const Languages = ({ languages, hasError, isLoading }) => (
  <Panel title="Languages list">
    <Scrollbars autoHeight>
      <Wrapper>
        {!hasError && !isLoading && Object.keys(languages).map(language => (
          <Language key={language} to={`/search?q=${encodeURIComponent(language.toLowerCase())}`}>
            <Dot background={repoColors[language].color} />
            <Name>
              {language}
              {(languages[language] / totalBytes(languages) * 100).toFixed(2) === '0.00' ? (
                <span>{'>'}0.01%</span>
              ) : (
                <span>{(languages[language] / totalBytes(languages) * 100).toFixed(2)} %</span>
              )}
            </Name>
          </Language>
        ))}
        {hasError && (
          <Error>An error has occured while trying to fetch languages for this repo</Error>
        )}
      </Wrapper>
    </Scrollbars>
  </Panel>
);

Languages.propTypes = {
  languages: PropTypes.object,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Languages.defaultProps = {
  languages: {},
  isLoading: false,
  hasError: false,
};

export default Languages;
