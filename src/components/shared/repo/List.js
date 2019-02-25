import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Wrapper as CardWrapper } from './Card';
import Error from '../error/Error';
import Filters from './Filters';

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

const Header = styled.div`
  display: flex;
  align-content: center;
  margin: 30px 0 10px 0;
  padding-bottom: 10px;

  border-bottom: 1px solid #F4F6F9;
`;

const Title = styled.h2`
  margin: 0 auto 0 0;
  color: #3A4044;
  justify-self: start;
`;

const Warning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
`;

const List = ({
  title,
  isLoading,
  isEmpty,
  hasError,
  errorMessage,
  emptyMessage,
  loadingPlaceholdersCount,
  hasFilters,
  fetchRepos,
  children,
}) => (
  <Wrapper>
    {(title || hasFilters) && (
      <Header>
        {title && (
          <Title>{title}</Title>
        )}
        {hasFilters && (
          <Filters fetchRepos={fetchRepos} />
        )}
      </Header>
    )}
    {!hasError && (
      <Items>
        {isLoading && (
          Array.from(Array(loadingPlaceholdersCount).keys()).map(key => (
            <CardLoader key={key}>
              <Avatar />
              <Name />
            </CardLoader>
          ))
        )}
        {!isLoading && !hasError && !isEmpty && children}
      </Items>
    )}
    {isEmpty && !isLoading && !hasError && (
      <Warning>{emptyMessage}</Warning>
    )}
    {!isLoading && hasError && (
      <Error message={errorMessage} source="GitHub" />
    )}
  </Wrapper>
);

List.propTypes = {
  title: PropTypes.string,
  errorMessage: PropTypes.string,
  emptyMessage: PropTypes.string,
  loadingPlaceholdersCount: PropTypes.number,
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  hasError: PropTypes.bool,
  hasFilters: PropTypes.bool,
  fetchRepos: PropTypes.func,
  children: PropTypes.node.isRequired,
};

List.defaultProps = {
  title: '',
  errorMessage: '',
  emptyMessage: 'No data has been found.',
  loadingPlaceholdersCount: 5,
  isLoading: false,
  isEmpty: false,
  hasError: false,
  hasFilters: false,
  fetchRepos: () => {},
};

export default List;
