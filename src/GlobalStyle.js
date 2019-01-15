import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html {
    height: 100%;
    font-size: 14px;
  }
  
  body {
    height: 100%;

    margin: 0;

    font-family: 'Consolas', sans-serif;
    font-size: 14px;
    line-height: 1.5;

    overflow-y: auto;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  a {
    cursor: pointer;
  }

  #root {
    height: 100%;
  }

  input,
  select,
  textarea,
  button {
    font-family: 'Consolas', sans-serif;
  }
`;
