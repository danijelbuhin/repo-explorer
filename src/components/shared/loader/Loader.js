import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as PulseSVG } from './assets/Pulse.svg';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;

  background: #fff;
`;

const Logo = styled(PulseSVG)`
  width: 90px;
  height: 90px;

  .pulse-logo {
    stroke-dasharray: 105.3;
    stroke-dashoffset: 105.3;
    animation: dash 1.2s alternate infinite cubic-bezier(.44,.52,.33,.86);
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 105.3;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`;

const Text = styled.span`
  margin-top: 20px;
  font-size: 24px;
`;

const Loader = ({ text }) => (
  <Wrapper>
    <Logo />
    <Text>{text}</Text>
  </Wrapper>
);

Loader.propTypes = {
  text: PropTypes.string,
};

Loader.defaultProps = {
  text: '',
};

export default Loader;
