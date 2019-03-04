import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';
import Error from '../../shared/error/Error';

import placeholder from '../../shared/header/user/assets/user.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const Contributor = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px 10px;
  padding: 10px;

  border: 1px solid #e6eaef;
  border-radius: 50px;
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

const Contributors = ({ contributors, isLoading, hasError, errorMessage }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <Panel title="Contributors">
      {hasError && (
        <Error message={errorMessage} source="GitHub" />
      )}
      {!hasError && (
        <Scrollbars autoHeight>
          <Wrapper>
            {!isLoading && contributors.map(contributor => (
              <Contributor key={contributor.id}>
                {isImageLoading ? (
                  <Avatar src={placeholder} alt="Loading profile image..." />
                ) : null}
                <Avatar
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  style={isImageLoading ? { visibility: 'hidden', display: 'none' } : {}}
                  onLoad={() => setIsImageLoading(false)}
                />
                <Name>
                  {contributor.login}
                  <span>{contributor.contributions} contributions</span>
                </Name>
              </Contributor>
            ))}
          </Wrapper>
        </Scrollbars>
      )}
    </Panel>
  );
};

Contributors.propTypes = {
  errorMessage: PropTypes.string,
  contributors: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Contributors.defaultProps = {
  errorMessage: '',
  contributors: [],
  isLoading: false,
  hasError: false,
};

export default Contributors;
