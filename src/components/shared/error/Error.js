import React from 'react';
import styled from 'styled-components';

import { ReactComponent as ErrorSVG } from './assets/Error.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  text-align: center;

  padding: 40px 10px;
  color: #3A4044;
`;

const ErrorIcon = styled(ErrorSVG)`
  margin-bottom: 20px;
  path {
    fill: #FF3E3E;
  }
`;

const Error = ({ message, source }) => (
  <Wrapper>
    <ErrorIcon />
    There was a problem with fetching {source} data, {source} returned this message: <br />
    {message}
  </Wrapper>
);

export default Error;
