import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as ChevronSVG } from './assets/Chevron.svg';

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;

  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(212, 221, 237, 0.25);
  background: #fff;
`;

const ChevronIcon = styled(ChevronSVG)`
  stroke: #b4c3dd;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;

  font-size: 16px;

  cursor: ${({ isClosable }) => isClosable ? 'pointer' : 'static'};
  border-bottom: 1px solid #F4F6F9;
  user-select: none;

  ${ChevronIcon} {
    transform: rotateZ(${({ isClosed }) => !isClosed ? 180 : 0}deg);
  }
`;

const Body = styled.div`
  padding: 10px;
`;

const Panel = ({ title, isClosable, isClosed: isClosedInitial, children }) => {
  const [isClosed, setIsClosed] = useState(isClosedInitial);
  useEffect(() => {
    setIsClosed(isClosedInitial);
  }, [isClosedInitial]);
  return (
    <Wrapper>
      {title && (
        isClosable ? (
          <Header
            isClosable={isClosable}
            isClosed={isClosed}
            onClick={() => setIsClosed(!isClosed)}
          >
            {title}
            <ChevronIcon />
          </Header>
        ) : (
          <Header isClosable={isClosable}>
            {title}
          </Header>
        )
      )}
      {!isClosed && (
        <Body>
          {children}
        </Body>
      )}
    </Wrapper>
  );
};

Panel.propTypes = {
  title: PropTypes.string,
  isClosable: PropTypes.bool,
  isClosed: PropTypes.bool,
  children: PropTypes.node,
};

Panel.defaultProps = {
  title: '',
  isClosable: true,
  isClosed: false,
  children: null,
};

export default Panel;
