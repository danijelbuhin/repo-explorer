import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as ArrowSVG } from './assets/Arrow.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
`;

const ArrowRight = styled(ArrowSVG)`
  width: 55px;
  height: 55px;

  border-radius: 100%;
  border: 1px solid rgba(212, 221, 237, 0.25);

  
  cursor: pointer;
  user-select: none;

  &:hover {
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
  }

  transition: all .2s ease-in-out;

  path {
    stroke: ${({ disabled }) => disabled ? '#AEB6CB' : '#3E97FF'};

    transition: all .2s ease-in-out;
  }
`;

const ArrowLeft = styled(ArrowSVG)`
  width: 55px;
  height: 55px;

  margin-right: 10px;

  border-radius: 100%;
  border: 1px solid rgba(212, 221, 237, 0.25);

  transform: rotateZ(180deg);
  cursor: pointer;
  user-select: none;

  &:hover {
    box-shadow: 0px -2px 4px rgba(212, 221, 237, 0.25);
  }

  transition: all .2s ease-in-out;

  path {
    stroke: ${({ disabled }) => disabled ? '#AEB6CB' : '#3E97FF'};

    transition: all .2s ease-in-out;
  }
`;

class Pagination extends Component {
  onPageNext = () => {
    const {
      page,
      total,
      onPageNext,
    } = this.props;
    if (page === Math.ceil(total / 15)) {
      return;
    }
    onPageNext();
  }

  onPagePrevious = () => {
    const {
      page,
      onPagePrevious,
    } = this.props;
    if (page === 1) {
      return;
    }
    onPagePrevious();
  }

  render() {
    const {
      page,
      total,
    } = this.props;
    return (
      <Wrapper>
        <ArrowLeft onClick={this.onPagePrevious} disabled={page === 1} />
        <ArrowRight onClick={this.onPageNext} disabled={page === Math.ceil(total / 15)} />
      </Wrapper>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageNext: PropTypes.func.isRequired,
  onPagePrevious: PropTypes.func.isRequired,
};

export default Pagination;
