import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import withAppContext from '../app/withAppContext';
import generatePercentage from '../../../utils/generatePercentage';

import { ReactComponent as LogoSVG } from './assets/Logo.svg';

import Dropdown from '../dropdown/Dropdown';

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
    width: 140px;
    @media (min-width: 550px) {
      width: 175px;
    }
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

  width: 80%;
  cursor: pointer;
  @media (min-width: 550px) {
    width: auto;
  }
`;

const Avatar = styled.img`
  width: 52px;
  height: 52px;

  border-radius: 5px;
`;

const RateLimit = styled.div`
  width: 100%;
  margin-left: 5px;
`;

const Limit = styled.div`
  position: relative;
  background: #F4F4F4;
  height: 20px;
  width: 100%;
  margin: 3px 0;

  font-size: 12px;
  border-radius:  0 15px 15px 0;

  @media (min-width: 550px) {
    width: 200px;
    font-size: 14px;
  }
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

  background: ${({ percentage: p }) => (p > 75 && '#A7FF88')
    || (p > 50 && p < 75 && '#F9FD43')
    || (p > 20 && p <= 50 && '#FFD159')
    || (p <= 20 && '#FF3E3E')
};
  transform: translateY(-50%);
  border-radius:  0 15px 15px 0;
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
        <UserInfo onClick={this.toggleDropdown}>
          {(isLoading || isAuthenticating) && (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          )}
          <Avatar
            src={isAuthenticated ? user.avatar : DefaultUser}
            alt="User"
          />
          <RateLimit>
            <Limit>
              <Text>Search limit - {search.remaining || 0} / {search.limit || 0}</Text>
              <Indicator
                percentage={generatePercentage(search.remaining, search.limit)}
              />
            </Limit>
            <Limit>
              <Text>Core limit - {core.remaining || 0} / {core.limit || 0}</Text>
              <Indicator
                percentage={generatePercentage(core.remaining, core.limit)}
              />
            </Limit>
          </RateLimit>
          <Dropdown
            isActive={isDropdownActive}
            className={isDropdownActive && 'is-active'}
            handleClickOutside={() => this.setState({ isDropdownActive: false })}
          >
            {!isAuthenticating && (
              <p>Hello {isAuthenticated ? user && user.name : 'Guest'}, you{'\''}re using {isAuthenticated ? 'your own' : 'shared'} rate limit</p>
            )}
            <div>
              <p><strong>Search limit reset:</strong> <br /> {moment(search.reset * 1000).format('HH:mm:ss')}h</p>
              <p><strong>Core limit reset:</strong> <br /> {moment(core.reset * 1000).format('HH:mm:ss')}h</p>
            </div>
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
          </Dropdown>
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
