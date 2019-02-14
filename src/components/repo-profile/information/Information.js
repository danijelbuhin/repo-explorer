import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { Tag } from '../../shared/repo/Card';
import Panel from '../panel/Panel';

const Avatar = styled.img`
  width: 64px;
  height: 64px;

  margin-bottom: 10px;
`;

const Name = styled.h2`
  margin: 0 0 10px 0;
`;

const Description = styled.p`
  font-size: 12px;
`;

const Information = ({
  avatarUrl,
  fullName,
  description,
  createdAt,
  updatedAt,
  topics,
}) => (
  <Panel>
    <Avatar src={avatarUrl} />
    <Name>{fullName}</Name>
    <Description>{description}</Description>
    Created: {moment(createdAt).format('Do MMM YYYY, HH:mm:ss')}h <br />
    Last update: {moment(updatedAt).format('Do MMM YYYY, HH:mm:ss')}h <br />
    {topics && topics.length > 0 && topics.map(topic => (
      <Tag
        key={topic}
        to={`/search?q=${encodeURIComponent(topic.toLowerCase())}`}
        style={{ marginRight: 5 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        #{topic.toLowerCase()}
      </Tag>
    ))}
  </Panel>
);

Information.propTypes = {
  avatarUrl: PropTypes.string,
  fullName: PropTypes.string,
  description: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
};

Information.defaultProps = {
  avatarUrl: '',
  fullName: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  topics: [],
};

export default Information;
