import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import withClickOutside from 'react-click-outside';

import withAppContext from '../../app/withAppContext';
import generatePercentage from '../../../../utils/generatePercentage';

import Dropdown from '../../dropdown/Dropdown';

import DefaultUser from './assets/user.png';
import Button from '../../button/Button';

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -18px;

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

  width: 300px;
`;

const RateLimit = styled.div`
  width: 100%;
  margin: 10px 0;
`;

const Reset = styled.div`
  margin-bottom: 10px;
  strong {
    display: inline-block;
    margin-right: 10px;
  }
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
  border-radius:  15px;

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
    || (p > 30 && p <= 50 && '#FFD159')
    || (p <= 30 && '#FF3E3E')
};
  transform: translateY(-50%);
  border-radius: 15px;
`;

const User = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 10px;
  padding: 10px;
  min-width: 190px;

  border: 1px solid #e6eaef;
  border-radius: 50px;
  cursor: pointer;
  user-select: none;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;

  border-radius: 100%;
  margin-right: 10px;
`;

const Name = styled.strong`
  font-size: 16px;
  span {
    display: block;
    font-size: 10px;
    font-weight: 400;
  }
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
        <User onClick={this.toggleDropdown}>
          <Avatar src={isAuthenticated ? user.avatar : DefaultUser} />
          <Name>
            {isAuthenticated ? user.name : 'Guest'}
            <span>{core.remaining || 0} / {core.limit || 0} - {search.remaining || 0} / {search.limit || 0}</span>
          </Name>
        </User>
        <Dropdown isActive={isDropdownActive}>
          {!isAuthenticating && !hasError && (
            <p>Hello {isAuthenticated ? user && user.name : 'Guest'}, you{'\''}re using {isAuthenticated ? 'your own' : 'shared'} rate limit.</p>
          )}
          {!hasError && (
            <RateLimit>
              <Limit hasError={hasError}>
                <Text>Search limit - {search.remaining || 0} / {search.limit || 0}</Text>
                <Indicator
                  percentage={generatePercentage(search.remaining, search.limit)}
                />
              </Limit>
              <Reset>
                <strong>Reset time:</strong>
                {moment(search.reset * 1000).format('HH:mm:ss')}h
              </Reset>
              <Limit hasError={hasError}>
                <Text>Core limit - {core.remaining || 0} / {core.limit || 0}</Text>
                <Indicator
                  percentage={generatePercentage(core.remaining, core.limit)}
                />
              </Limit>
              <Reset>
                <strong>Reset time:</strong>
                {moment(core.reset * 1000).format('HH:mm:ss')}h
              </Reset>
            </RateLimit>
          )}
          {hasError && (
            <div>We could not fetch GitHub rate limit.</div>
          )}
          {isAuthenticated && (
            <Button block onClick={logOut} type="button">Log out</Button>
          )}
          {!isAuthenticated && (
            <React.Fragment>
              If you want to use your own rate limit:
              <Button
                block
                color="dark"
                onClick={authenticate}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Authenticate with github'}
              </Button>
            </React.Fragment>
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
