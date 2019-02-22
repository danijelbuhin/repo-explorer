import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import Panel from '../panel/Panel';
import Error from '../../shared/error/Error';

const Wrapper = styled.div`
  padding: 10px;
`;

const Readme = ({ readme, isLoading, hasError, errorMessage }) => (
  <Panel title="Readme" isClosable={false}>
    {hasError && (
      <Error message={errorMessage} source="GitHub" />
    )}
    {!hasError && !isLoading && (
      <Wrapper>
        <ReactMarkdown source={readme} escapeHtml={false} className="markdown-body" />
      </Wrapper>
    )}
  </Panel>
);

Readme.propTypes = {
  errorMessage: PropTypes.string,
  readme: PropTypes.string,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Readme.defaultProps = {
  errorMessage: '',
  readme: '',
  isLoading: false,
  hasError: false,
};

export default Readme;
