import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
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

  &.is-active {
    transform: translateY(100%);
    opacity: 1;

    pointer-events: initial;
  }
`;

class Dropdown extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = (e) => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.props.handleClickOutside();
  }

  render() {
    const { isActive, children, ...rest } = this.props;
    return (
      <Wrapper
        isActive={isActive}
        onClick={this.handleClick}
        ref={node => this.node = node} // eslint-disable-line
        {...rest}
      >
        {children}
      </Wrapper>
    );
  }
}

Dropdown.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  handleClickOutside: PropTypes.func,
};

Dropdown.defaultProps = {
  handleClickOutside: () => {},
};

export default Dropdown;
