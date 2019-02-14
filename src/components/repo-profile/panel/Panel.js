import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as ChevronSVG } from './assets/Chevron.svg';

const Wrapper = styled.div`
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

  cursor: pointer;
  border-bottom: 1px solid #F4F6F9;
  user-select: none;

  ${ChevronIcon} {
    transform: rotateZ(${({ isCollapsed }) => isCollapsed ? 180 : 0}deg);
  }
`;

const Body = styled.div`
  padding: 10px;
`;

const Panel = ({ title, isClosable, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Wrapper>
      {title && (
        isClosable ? (
          <Header isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
            {title}
            <ChevronIcon />
          </Header>
        ) : (
          <Header>
            {title}
          </Header>
        )
      )}
      {isCollapsed && (
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
  children: PropTypes.node,
};

Panel.defaultProps = {
  title: '',
  isClosable: true,
  children: null,
};

export default Panel;
