import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import withClickOutside from 'react-click-outside';

import withAppContext from '../../app/withAppContext';
import generatePercentage from '../../../../utils/generatePercentage';

import Dropdown from '../../dropdown/Dropdown';

import DefaultUser from './assets/user.png';

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

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Avatar = styled.img`
  width: 52px;
  height: 52px;

  border-radius: 5px;
  cursor: pointer;
`;

const RateLimit = styled.div`
  width: 100%;
  margin-left: 5px;
`;

const Limit = styled.div`
  position: relative;
  background: ${({ hasError }) => (!hasError && '#F4F4F4')
  || (hasError && '#FF3E3E')
};
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

class UserInfo extends Component {
  state = {
    isDropdownActive: false,
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownActive: !prevState.isDropdownActive }));
  }

  handleClickOutside = () => {
    if (this.state.isDropdownActive) {
      this.setState(() => ({ isDropdownActive: false }));
    }
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
          hasError,
        },
        logOut,
        authenticate,
      },
    } = this.props;
    const { isDropdownActive } = this.state;
    return (
      <Wrapper>
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
          <Limit hasError={hasError}>
            <Text>Search limit - {search.remaining || 0} / {search.limit || 0}</Text>
            <Indicator
              percentage={generatePercentage(search.remaining, search.limit)}
            />
          </Limit>
          <Limit hasError={hasError}>
            <Text>Core limit - {core.remaining || 0} / {core.limit || 0}</Text>
            <Indicator
              percentage={generatePercentage(core.remaining, core.limit)}
            />
          </Limit>
        </RateLimit>
        <Dropdown isActive={isDropdownActive}>
          {!isAuthenticating && !hasError && (
            <p>Hello {isAuthenticated ? user && user.name : 'Guest'}, you{'\''}re using {isAuthenticated ? 'your own' : 'shared'} rate limit.</p>
          )}
          {!hasError && (
            <div>
              <p><strong>Search limit reset:</strong> <br /> {moment(search.reset * 1000).format('HH:mm:ss')}h</p>
              <p><strong>Core limit reset:</strong> <br /> {moment(core.reset * 1000).format('HH:mm:ss')}h</p>
            </div>
          )}
          {hasError && (
            <div>We could not fetch GitHub rate limit.</div>
          )}
          {isAuthenticated && (
            <button onClick={logOut} type="button">Log out</button>
          )}
          {!isAuthenticated && (
            <button
              onClick={authenticate}
              type="button"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? 'Authenticating...' : 'Authenticate with github'}
            </button>
          )}
        </Dropdown>
      </Wrapper>
    );
  }
}

UserInfo.propTypes = {
  appContext: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isAuthenticating: PropTypes.bool,
    user: PropTypes.object,
    rateLimit: PropTypes.object,
    authenticate: PropTypes.func,
    logout: PropTypes.func,
  }).isRequired,
};

export default withAppContext(withClickOutside(UserInfo));
