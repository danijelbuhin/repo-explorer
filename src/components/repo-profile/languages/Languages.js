import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

import repoColors from '../../../utils/repoColors.json';
import Panel from '../panel/Panel';
import Error from '../../shared/error/Error';

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

  border: 1px solid #e6eaef;
  border-radius: 50px;

  cursor: pointer;
  transition: all .2s ease-in-out;

  &:hover {
    background: #f9f9f9;
  }
`;

const Warning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  padding: 40px;
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

const totalBytes = data => Object.values(data).reduce((acc, curr) => acc + curr, 0);

const Languages = ({ languages, hasError, isLoading, errorMessage }) => (
  <Panel
    title="Languages list"
    isClosed={Object.keys(languages).length === 0}
    isClosable={Object.keys(languages).length === 0}
  >
    {!hasError && Object.keys(languages).length === 0 && (
      <Warning>
        This repo does not contain any programming language.
      </Warning>
    )}
    {!hasError && (
      <Scrollbars autoHeight>
        <Wrapper>
          {!isLoading && Object.keys(languages).map(language => (
            <Language key={language} to={`/search?q=language:${encodeURIComponent(language.toLowerCase())}`}>
              <Dot background={repoColors[language] && repoColors[language].color} />
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
        </Wrapper>
      </Scrollbars>
    )}
    {hasError && (
      <Error source="GitHub" message={errorMessage} />
    )}
  </Panel>
);

Languages.propTypes = {
  errorMessage: PropTypes.string,
  languages: PropTypes.object,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Languages.defaultProps = {
  errorMessage: '',
  languages: {},
  isLoading: false,
  hasError: false,
};

export default Languages;
