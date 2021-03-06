import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactComponent as ArrowSVG } from './assets/Arrow.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 100%;

  margin-top: 10px;
  padding-top: 10px;

  border-top: 1px solid #F4F6F9;
`;

const ArrowRight = styled(ArrowSVG)`
  width: 48px;
  height: 48px;

  border-radius: 100%;
  border: 1px solid rgba(212, 221, 237, 0.25);

  
  cursor: pointer;
  user-select: none;

  ${({ disabled }) => !disabled && `
    &:hover {
      box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    }
  `};

  transition: all .2s ease-in-out;

  path {
    stroke: ${({ disabled }) => disabled ? '#AEB6CB' : '#3E97FF'};

    transition: all .2s ease-in-out;
  }
`;

const ArrowLeft = styled(ArrowSVG)`
  width: 48px;
  height: 48px;

  margin-right: 10px;

  border-radius: 100%;
  border: 1px solid rgba(212, 221, 237, 0.25);

  transform: rotateZ(180deg);
  cursor: pointer;
  user-select: none;

  ${({ disabled }) => !disabled && `
    &:hover {
      box-shadow: 0px -2px 4px rgba(212, 221, 237, 0.25);
    }
  `};

  transition: all .2s ease-in-out;

  path {
    stroke: ${({ disabled }) => disabled ? '#AEB6CB' : '#3E97FF'};

    transition: all .2s ease-in-out;
  }
`;

export const Details = styled.div`
  margin-right: 10px;
  padding: 10px 0;

  font-size: 14px;
  text-align: center;
`;

class Pagination extends Component {
  onPageNext = () => {
    const {
      page,
      total,
      limit,
      onPageNext,
    } = this.props;
    if (page === Math.ceil(total / limit)) {
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
      limit,
    } = this.props;
    return (
      <Wrapper>
        <ArrowLeft onClick={this.onPagePrevious} disabled={page === 1} />
        <Details>
          {page} / {Math.ceil(total / limit)}
        </Details>
        <ArrowRight onClick={this.onPageNext} disabled={page === Math.ceil(total / limit)} />
      </Wrapper>
    );
  }
}

Pagination.propTypes = {
  limit: PropTypes.number,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageNext: PropTypes.func.isRequired,
  onPagePrevious: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  limit: 15,
};

export default Pagination;
