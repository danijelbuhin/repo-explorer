import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { Tag } from '../../shared/repo/Card';
import Panel from '../panel/Panel';


const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 5px;
  }
`;

const Left = styled.div`
  flex: 2;
`;

const Profile = styled.div`
  display: flex;
`;

const Date = styled.strong`
  display: block;
  span {
    font-weight: 400;
  }
`;

const Right = styled.div`
  flex: 1;
  padding: 0px 20px;
`;

const Links = styled.div`
  display: flex;

  a {
    margin: 5px 5px 5px 0;
    padding: 2px 4px;

    color: #0366d6; 
    background-color: #f1f8ff;

    border-radius: 3px;
    white-space: nowrap;
    text-decoration: none;

    transition: all .2s ease-in-out;

    &:hover {
      background-color: #dbecfc;
    }
  }
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;

  margin-right: 10px;
`;

const Name = styled.h2`
  margin: 0 0 10px 0;
`;

const Description = styled.p`
  font-size: 12px;
  margin: 0;
  font-weight: 400;

  max-width: 400px;
`;

const Information = ({ repo }) => (
  <Panel>
    <Content>
      <Left>
        <Profile>
          <Avatar src={repo.owner && repo.owner.avatar_url} />
          <Name>
            {repo.full_name}
            <Description>{repo.description}</Description>
          </Name>
        </Profile>
        <Date>
          Created:
          <span>{moment(repo.created_at).format('Do MMM YYYY, HH:mm:ss')}h</span>
        </Date>
        <Date>
          Last update:
          <span>{moment(repo.updated_at).format('Do MMM YYYY, HH:mm:ss')}h</span>
        </Date>
      </Left>
      <Right>
        <h3>Topics:</h3>
        {repo.topics && repo.topics.length > 0 ? repo.topics.map(topic => (
          <Tag
            key={topic}
            to={`/search?q=${encodeURIComponent(topic.toLowerCase())}`}
            style={{ margin: 3 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            #{topic.toLowerCase()}
          </Tag>
        )) : (
          <div>This repo is not related to any topic.</div>
        )}

        <h3>Links:</h3>
        <Links>
          {repo.homepage && <a href={repo.homepage} target="_blank" rel="noopener noreferrer">Website</a>}
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">GitHub repo</a>
          <a href={repo.owner && repo.owner.html_url} target="_blank" rel="noopener noreferrer">Owner profile</a>
        </Links>
      </Right>
    </Content>
  </Panel>
);

Information.propTypes = {
  repo: PropTypes.object,
};

Information.defaultProps = {
  repo: {},
};

export default Information;
