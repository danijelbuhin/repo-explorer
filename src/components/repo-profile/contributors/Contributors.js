import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import Panel from '../panel/Panel';

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

  border: 1px solid #F4F6F9;
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

const Contributors = ({ contributors, isLoading, hasError }) => (
  <Panel title="Contributors">
    <Scrollbars autoHeight>
      <Wrapper>
        {!isLoading && !hasError && contributors.map(contributor => (
          <Contributor key={contributor.id}>
            <Avatar src={contributor.avatar_url} />
            <Name>
              {contributor.login}
              <span>{contributor.contributions} contributions</span>
            </Name>
          </Contributor>
        ))}
      </Wrapper>
    </Scrollbars>
  </Panel>
);

Contributors.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

Contributors.defaultProps = {
  contributors: [],
  isLoading: false,
  hasError: false,
};

export default Contributors;
