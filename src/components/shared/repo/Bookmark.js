import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import { toast } from 'react-toastify';

import { ReactComponent as BookmarkSVG } from './assets/Bookmark.svg';

import withAppContext from '../app/withAppContext';

export const BookmarkIcon = styled(BookmarkSVG)`
  cursor: pointer;
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

const Bookmark = ({
  id,
  name,
  avatar,
  count,
  language,
  topic,
  appContext,
  ...rest
}) => {
  const bookmarkRepo = (repo) => {
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
  };

  const isBookmarked = appContext.user && Boolean(appContext.user.favorites.filter(_repo => _repo.id === id)[0]);

  return (
    <Tooltip
      title={isBookmarked ? 'Remove from your bookmarks' : 'Add to your bookmarks'}
      theme="light"
      position="top-end"
      {...rest}
    >
      <BookmarkIcon
        className={isBookmarked ? 'is-bookmarked' : ''}
        onClick={(e) => {
          e.stopPropagation();
          bookmarkRepo({
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
  );
};

Bookmark.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  language: PropTypes.string,
  topic: PropTypes.string,
  id: PropTypes.number,
  count: PropTypes.number,
  appContext: PropTypes.object.isRequired,
};

Bookmark.defaultProps = {
  name: '',
  avatar: '',
  language: '',
  topic: '',
  id: 0,
  count: 0,
};

export default withAppContext(Bookmark);
