import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  bottom: -15px;
  left: 0;

  padding: 15px;
  border-radius: 5px;

  background: #fff;
  border: 1px solid rgba(212, 221, 237, 0.25);
  box-shadow: 0px 1px 3px rgba(212, 221, 237, 0.25);

  transform: translateY(110%);
  opacity: 0;
  pointer-events: none;
  
  transition: all .4s cubic-bezier(.65,.05,.13,.73);

  cursor: initial;

  ${({ isActive }) => isActive && `
    transform: translateY(100%);
    opacity: 1;

    pointer-events: initial;
  `}
`;

const Dropdown = ({
  isActive,
  children,
  ...rest
}) => (
  <Wrapper
    isActive={isActive}
    {...rest}
  >
    {children}
  </Wrapper>
);

Dropdown.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dropdown;
