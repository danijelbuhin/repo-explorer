import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import repoColors from '../../../utils/repoColors.json';
import withAppContext from '../app/withAppContext';

import { ReactComponent as BookmarkSVG } from './assets/Bookmark.svg';

const Bookmark = styled(BookmarkSVG)`
  position: absolute;
  top: 5px;
  right: 5px;

  z-index: 5;

  opacity: 0;
  transform: translate3d(0, 10px, 0);

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

const Wrapper = styled.div`
  position: relative;

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

class Repo extends Component {
  state = {
    isBookmarked: false,
  }

  componentDidMount() {
    const { appContext: { user } } = this.props;
    const bookmarked = user.favorites.filter(repo => repo.id === this.props.id)[0];
    if (bookmarked) {
      this.setState({ isBookmarked: true, }) // eslint-disable-line
    }
  }

  componentDidUpdate({ appContext }) {
    const { appContext: { user } } = this.props;
    if (appContext.user.favorites.length !== user.favorites.length) {
      const bookmarked = user.favorites.filter(repo => repo.id === this.props.id)[0];
      if (bookmarked) {
        this.setState({ isBookmarked: true, }) // eslint-disable-line
        return;
      }
      this.setState({ isBookmarked: false, }) // eslint-disable-line
    }
  }

  bookmarkRepo = (repo) => {
    const { appContext } = this.props;
    if (!appContext.isAuthenticated) {
      alert('You have to be signed in to bookmark the repository.');
      return;
    }
    const { favorites } = appContext.user;
    const bookmarked = favorites.filter(_repo => _repo.id === repo.id)[0];
    if (bookmarked && bookmarked.id === repo.id) {
      appContext.updateUser('favorites', favorites.filter(_r => _r.id !== repo.id));
      return;
    }
    appContext.updateUser('favorites', [...favorites, repo]);
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
      ...rest
    } = this.props;
    const { isBookmarked } = this.state;
    return (
      <Wrapper
        {...rest}
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
  }
}

Repo.propTypes = {
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

Repo.defaultProps = {
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

export default withAppContext(Repo);
