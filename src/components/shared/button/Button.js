import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.button`
  display: ${({ block }) => block ? 'block' : 'inline-block'};
  width: ${({ block }) => block ? '100%' : 'auto'};
  padding: 15px 25px;
  border: none;
  border-radius: 7px;

  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  background: ${({ color }) => (color === 'dark' && '#000')
  || (color === 'primary' && '#3E97FF')
};
  color: ${({ color }) => (color === 'dark' && '#FFF')
    || (color === 'primary' && '#FFF')
};
`;

const Button = ({
  children,
  ...rest
}) => (
  <Wrapper {...rest}>
    {children}
  </Wrapper>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
