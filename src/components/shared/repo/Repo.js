import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import repoColors from '../../../utils/repoColors.json';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 18%;
  margin: 10px 1%;
  padding: 15px 33px;

  background: #FFFFFF;

  border: 1px solid rgba(212, 221, 237, 0.25);
  border-radius: 3px;

  transition: all .2s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    transform: translate3d(0, -5px, 0);
  }
`;

const Image = styled.img`
  width: 48px;
  height: 48px;

  margin-bottom: 10px;
  border-radius: 3px;
`;

const Name = styled.span`
  font-size: 14px;
  text-align: center;

  white-space: nowrap; 
  max-width: 200px; 
  overflow: hidden;
  text-overflow: ellipsis;

  margin-bottom: 20px;
`;

const Count = styled.strong`
  font-size: 18px;
  margin-bottom: 20px;

  svg {
    display: inline-block;
    vertical-align: middle;
  }
`;

const Number = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const Text = styled.span`
  font-size: 12px;
`;

const Language = styled.div`
  padding: 2px 4px;

  color: #fff;
  text-shadow: 0px 2px 1px rgba(0,0,0,0.2);

  background: ${({ color }) => color ? color : '#f7f7f7'};
  border-radius: 3px;
`;

const Tag = styled.div`
  display: inline-block;
  padding: 2px 4px;

  color: #0366d6; 
  background-color: #f1f8ff;

  border-radius: 3px;
  white-space: nowrap;
`;

const Repo = ({
  name,
  avatar,
  count,
  countIcon,
  language,
  topic,
  text,
  ...rest
}) => (
  <Wrapper
    {...rest}
  >
    <Image
      src={avatar}
      alt={name}
    />
    <Name>{name}</Name>
    <Count>{countIcon} <Number>{count}</Number></Count>
    {language && <Language color={repoColors[language].color}>{language.toLowerCase()}</Language>}
    {!language && topic && <Tag>#{topic.toLowerCase()}</Tag>}
    {text && <Text>{text}</Text>}
  </Wrapper>
);

Repo.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  language: PropTypes.string,
  topic: PropTypes.string,
  count: PropTypes.number,
  countIcon: PropTypes.node,
  text: PropTypes.node,
};

Repo.defaultProps = {
  name: '',
  avatar: '',
  language: '',
  topic: '',
  count: 0,
  countIcon: null,
  text: null,
};

export default Repo;
