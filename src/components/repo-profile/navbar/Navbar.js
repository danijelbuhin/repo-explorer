import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';

import { Wrapper as PanelWrapper } from '../panel/Panel';

const CustomizedPanel = styled(PanelWrapper)`
  background: #6190e8;
  background: linear-gradient(to right, #6190e8, #a7bfe8);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px 10px;
`;

const Item = styled(NavLink)`
  position: relative;
  text-decoration: none;
  padding: 4px 8px;

  span {
    position: relative;
    color: #FFF;

    transition: all .2s ease-in-out;
    z-index: 2;
  }

  &:hover, &.is-active {
    span {
      color: #000000;
    }
    &:after {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:not(:last-child) {
    margin-right: 10px;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: #FFFFFF;
    border-radius: 50px;
    box-shadow: 0px 3px 10px rgba(0,0,0,0.2);

    opacity: 0;
    transform: scale(0);
    transition: all .2s ease-in-out;
    z-index: 1;
  }
`;

const Navbar = ({ match: { params } }) => (
  <CustomizedPanel>
    <Wrapper>
      <Item
        to={`/${params.user}/${params.repo}`}
        exact
        activeClassName="is-active"
      >
        <span>Overview</span>
      </Item>
      <Item
        to={`/${params.user}/${params.repo}/stats`}
        exact
        activeClassName="is-active"
      >
        <span>Stats</span>
      </Item>
      <Item
        to={`/${params.user}/${params.repo}/views`}
        exact
        activeClassName="is-active"
      >
        <span>Views</span>
      </Item>
      <Item
        to={`/${params.user}/${params.repo}/similar`}
        exact
        activeClassName="is-active"
      >
        <span>Similar repos</span>
      </Item>
    </Wrapper>
  </CustomizedPanel>
);

Navbar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default withRouter(Navbar);
