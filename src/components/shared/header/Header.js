import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import withAppContext from '../app/withAppContext';
import percentToColor from '../../../utils/percentToColor';
import generatePercentage from '../../../utils/generatePercentage';

import { ReactComponent as LogoSVG } from './assets/Logo.svg';

import DefaultUser from './assets/user.png';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: #fff;
  border-bottom: 1px solid rgba(212, 221, 237, 0.25);
  box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);

  margin-bottom: 40px;
  padding: 10px;

  z-index: 100;

  svg {
    width: 175px;
  }
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.5);
  z-index: 5;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;

  border-top: 1px solid #335abb;
  border-bottom: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 100%;
  background: transparent;

  animation: spin 0.6s infinite linear;
  transform: rotateZ(0deg);

  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    } to {
      transform: rotateZ(360deg);
    }
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 52px;
  height: 52px;

  border-radius: 5px;

  cursor: pointer;
`;

const RateLimit = styled.div`
  margin-left: 5px;
`;

const Limit = styled.div`
  position: relative;
  background: #ddd;
  height: 20px;
  width: 200px;
  margin: 3px 0;

  border-radius:  0 15px 15px 0;
`;

const Text = styled.span`
  position: absolute;
  top: 50%;
  left: 3px;

  transform: translateY(-50%);
  z-index: 3;
`;

const Indicator = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: ${({ percentage }) => `${percentage}%`};
  height: 100%;

  background: ${({ color }) => color};
  transform: translateY(-50%);
  border-radius:  0 15px 15px 0;
`;

const DropDown = styled.div`
  position: absolute;
  bottom: -15px;
  left: 0;

  display: ${({ isActive }) => isActive ? 'block' : 'none'};

  padding: 15px;
  border-radius: 5px;

  background: #fff;
  border: 1px solid rgba(212, 221, 237, 0.25);
  box-shadow: 0px 1px 3px rgba(212, 221, 237, 0.25);

  transform: translateY(100%);
`;

class Header extends Component {
  state = {
    isDropdownActive: false,
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownActive: !prevState.isDropdownActive }));
  }

  render() {
    const {
      appContext: {
        user,
        isAuthenticated,
        isAuthenticating,
        rateLimit: {
          search,
          core,
          isLoading,
        },
        logOut,
        authenticate,
      },
    } = this.props;
    const { isDropdownActive } = this.state;
    return (
      <Wrapper>
        <LogoSVG />
        <UserInfo>
          {(isLoading || isAuthenticating) && (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          )}
          <Avatar
            src={isAuthenticated ? user.avatar : DefaultUser}
            alt="User"
            onClick={this.toggleDropdown}
          />
          <RateLimit>
            <Limit>
              <Text>Search limit - {generatePercentage(search.remaining, search.limit)}%</Text>
              <Indicator
                color={percentToColor((search.remaining / search.limit) * 100)}
                percentage={generatePercentage(search.remaining, search.limit)}
              />
            </Limit>
            <Limit>
              <Text>Core limit  - {generatePercentage(core.remaining, core.limit)}%</Text>
              <Indicator
                color={percentToColor((core.remaining / core.limit) * 100)}
                percentage={generatePercentage(core.remaining, core.limit)}
              />
            </Limit>
          </RateLimit>
          <DropDown isActive={isDropdownActive}>
            {!isAuthenticating && (
              <p>Hello {isAuthenticated ? user && user.name : 'Guest'}, you{'\''}re using {isAuthenticated ? 'your own' : 'shared'} rate limit</p>
            )}
            {isAuthenticated && (
              <button onClick={logOut} type="button">Log out</button>
            )}
            {!isAuthenticated && (
              <button
                onClick={authenticate}
                type="button"
              >
                {isAuthenticating ? 'Authenticating...' : 'Authenticate with github'}
              </button>
            )}
          </DropDown>
        </UserInfo>
      </Wrapper>
    );
  }
}

Header.propTypes = {
  appContext: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isAuthenticating: PropTypes.bool,
    user: PropTypes.object,
    rateLimit: PropTypes.object,
    authenticate: PropTypes.func,
    logout: PropTypes.func,
  }).isRequired,
};

export default withAppContext(Header);
