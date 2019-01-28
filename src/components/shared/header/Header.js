import React from 'react';
import styled from 'styled-components';

import { ReactComponent as LogoSVG } from './assets/Logo.svg';

import UserInfo from './user/User';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border-bottom: 1px solid rgba(212, 221, 237, 0.25);
  box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);

  margin-bottom: 40px;
  padding: 10px;

  z-index: 100;

  svg {
    width: 140px;
    @media (min-width: 550px) {
      width: 175px;
    }
  }
`;

const Header = () => (
  <Wrapper>
    <LogoSVG />
    <UserInfo />
  </Wrapper>
);

export default Header;
