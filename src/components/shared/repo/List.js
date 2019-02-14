import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Wrapper as CardWrapper } from './Card';

const CardLoader = styled.div`
  position: relative;
  width: 18%;
  height: 170px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin: 10px 1%;
  background: #f7f7f7;

  border: 1px solid rgba(212, 221, 237, 0.25);

  border-radius: 3px;

  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    transform: translateX(-100%);

    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,00) 81%);

    animation: load 1s infinite linear;
  }

  @keyframes load {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  margin-bottom: 10px;

  background: #f0f0f0;
`;

const Name = styled.div`
  width: 80px;
  height: 7px;

  background: #f0f0f0;
`;

const Wrapper = styled.div`
  padding: 10px;
`;

const Items = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;

  ${CardWrapper}, ${CardLoader} {
    width: 100%;
    @media (min-width: 420px) {
      width: 48%;
    }
    @media (min-width: 768px) {
      width: 31%;
    }
    @media (min-width: 900px) {
      width: 23%;
    }
    @media (min-width: 1200px) {
      width: 18%;
    }
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  padding-bottom: 10px;

  border-bottom: 1px solid #F4F6F9;
  color: #3A4044;
`;

const List = ({
  title,
  isLoading,
  hasError,
  children,
  loadingPlaceholdersCount,
}) => (
  <Wrapper>
    {title && (
      <Title>{title}</Title>
    )}
    <Items>
      {isLoading && !hasError && (
        Array.from(Array(loadingPlaceholdersCount).keys()).map(key => (
          <CardLoader key={key}>
            <Avatar />
            <Name />
          </CardLoader>
        ))
      )}
      {!isLoading && !hasError && children}
    </Items>
  </Wrapper>
);

List.propTypes = {
  title: PropTypes.string,
  loadingPlaceholdersCount: PropTypes.number,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

List.defaultProps = {
  title: '',
  loadingPlaceholdersCount: 5,
  isLoading: false,
  hasError: false,
};

export default List;
