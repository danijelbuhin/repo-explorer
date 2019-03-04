import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import repoColors from '../../../utils/repoColors.json';

import history from '../../../history';
import Bookmark, { BookmarkIcon } from './Bookmark';
import placeholder from '../header/user/assets/user.png';

export const Wrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 18%;
  margin: 10px 1%;
  padding: 15px;

  background: #FFFFFF;

  border: 1px solid rgba(212, 221, 237, 0.25);
  border-radius: 3px;

  transition: all .2s ease-in-out;
  cursor: pointer;

  ${BookmarkIcon} {
    position: absolute;
    top: 5px;
    right: 5px;

    z-index: 5;

    @media (min-width: 768px) {
      opacity: 0;
      transform: translate3d(0, 10px, 0);
    }
  }

  &:hover {
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    transform: translate3d(0, -5px, 0);

    ${BookmarkIcon} {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
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
  max-width: 150px; 
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

const Language = styled(Link)`
  padding: 2px 4px;

  color: #fff;
  text-shadow: 0px 2px 1px rgba(0,0,0,0.2);

  background: ${({ color }) => color ? color : '#f7f7f7'};
  border-radius: 3px;
  text-decoration: none;

  transition: all .2s ease-in-out;

  &:hover {
    box-shadow: 0px 2px 7px rgba(0,0,0,0.1);
  }
`;

export const Tag = styled(Link)`
  display: inline-block;
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
`;

const Card = ({
  name,
  avatar,
  count,
  countIcon,
  language,
  topic,
  text,
  id,
  ...rest
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <Wrapper
      onClick={() => history.push(`/${name}`)}
      {...rest}
    >
      <Bookmark
        id={id}
        name={name}
        avatar={avatar}
        count={count}
        language={language}
        topic={topic}
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
        }}
      />
      {isImageLoading ? (
        <Image src={placeholder} alt="Loading profile image..." />
      ) : null}
      <Image
        src={avatar}
        alt={name}
        style={isImageLoading ? { visibility: 'hidden', display: 'none' } : {}}
        onLoad={() => setIsImageLoading(false)}
      />
      <Name title={name}>{name}</Name>
      <Count>{countIcon} <Number>{count}</Number></Count>
      {language && (
        <Language
          to={`/search?q=language:${encodeURIComponent(language.toLowerCase())}`}
          color={repoColors[language] ? repoColors[language].color : '#000'}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {language.toLowerCase()}
        </Language>
      )}
      {!language && topic && (
        <Tag
          to={`/search?q=topic:${encodeURIComponent(topic.toLowerCase())}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          #{topic.toLowerCase()}
        </Tag>
      )}
      {text && <Text>{text}</Text>}
    </Wrapper>
  );
};

Card.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  language: PropTypes.string,
  topic: PropTypes.string,
  id: PropTypes.number,
  count: PropTypes.number,
  countIcon: PropTypes.node,
  text: PropTypes.node,
};

Card.defaultProps = {
  name: '',
  avatar: '',
  language: '',
  topic: '',
  id: 0,
  count: 0,
  countIcon: null,
  text: null,
};

export default Card;
