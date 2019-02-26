import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tippy';

import repoColors from '../../../utils/repoColors.json';
import withAppContext from '../app/withAppContext';

import history from '../../../history';

import { ReactComponent as BookmarkSVG } from './assets/Bookmark.svg';

const Bookmark = styled(BookmarkSVG)`
  position: absolute;
  top: 5px;
  right: 5px;

  z-index: 5;

  @media (min-width: 768px) {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);

  path {
    transition: all .3s ease-in-out;
  }

  &:hover, &.is-bookmarked {
    path {
      fill: #FF2A9D;
    }
  }
`;

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

  &:hover {
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    transform: translate3d(0, -5px, 0);

    ${Bookmark} {
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

class Card extends Component {
  bookmarkRepo = (repo) => {
    const { appContext } = this.props;
    if (!appContext.isAuthenticated) {
      toast('⚠️ You have to be signed in to bookmark the repository!', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const { favorites } = appContext.user;
    const bookmarked = favorites.filter(_repo => _repo.id === repo.id)[0];
    if (bookmarked && bookmarked.id === repo.id) {
      appContext.updateUser('favorites', favorites.filter(_r => _r.id !== repo.id)).then(() => {
        toast('👍 Repo removed from bookmarks!', {
          position: 'bottom-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
      return;
    }
    appContext.updateUser('favorites', [...favorites, repo]).then(() => {
      toast('👍 Repo added to bookmarks!', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }

  render() {
    const {
      name,
      avatar,
      count,
      countIcon,
      language,
      topic,
      text,
      id,
      appContext: {
        user,
      },
      ...rest
    } = this.props;
    const isBookmarked = user && Boolean(user.favorites.filter(_repo => _repo.id === id)[0]);
    return (
      <Wrapper
        onClick={() => history.push(`/repo/${encodeURIComponent(name)}`)}
        {...rest}
      >
        <Tooltip
          title={isBookmarked ? 'Remove from your bookmarks' : 'Add to your bookmarks'}
          theme="light"
          style={{ position: 'absolute', top: '5px', right: '5px' }}
          position="top-end"
        >
          <Bookmark
            className={isBookmarked ? 'is-bookmarked' : ''}
            onClick={(e) => {
              e.stopPropagation();
              this.bookmarkRepo({
                name,
                avatar,
                count,
                language,
                topic,
                id,
              });
            }}
          />
        </Tooltip>
        <Image
          src={avatar}
          alt={name}
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
  }
}

Card.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  language: PropTypes.string,
  topic: PropTypes.string,
  id: PropTypes.number,
  count: PropTypes.number,
  countIcon: PropTypes.node,
  text: PropTypes.node,
  bookmarkRepo: PropTypes.func,
  appContext: PropTypes.object.isRequired,
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
  bookmarkRepo: () => {},
};

export default withAppContext(Card);
