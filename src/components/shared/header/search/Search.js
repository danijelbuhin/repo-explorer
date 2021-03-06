import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withClickOutside from 'react-click-outside';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import withAppContext from '../../app/withAppContext';

import { ReactComponent as SearchSVG } from './assets/Search.svg';
import { ReactComponent as ClearSVG } from './assets/Clear.svg';
import history from '../../../../history';

import Dropdown, { Wrapper as DropdownWrapper } from '../../dropdown/Dropdown';

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  max-width: 630px;
  width: 100%;
  position: relative;

  ${DropdownWrapper} {
    width: 100%;
    bottom: -3px;

    z-index: 10;
  }
`;

const Input = styled.input`
  width: 100%;

  padding: 13px 40px 13px 13px;

  background: #F7F7F7;
  color: #AEB6CB;
  font-size: 16px;
  border: 1px solid rgba(212, 221, 237, 0.25);
  border-radius: 3px;

  transition: all .3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3E97FF;
  }
`;

const SearchIcon = styled(SearchSVG)`
  position: absolute;
  top: 50%;
  right: 20px;

  transform: translateY(-50%) scale(1);

  transition: all .3s ease-in-out;

  &.is-hidden {
    transform: translateY(-50%) scale(0);
  }
`;

const ClearIcon = styled(ClearSVG)`
  position: absolute;
  top: 50%;
  right: 20px;

  transform: translateY(-50%) scale(1);

  transition: all .3s ease-in-out;

  cursor: pointer;

  &.is-hidden {
    transform: translateY(-50%) scale(0);
  }
`;

const Repo = styled(Link)`
  display: block;

  padding: 10px;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(212,221,237,0.25);
  }

  color: #000;

  transition: all .2s ease-in-out;
  cursor: pointer;
  
  &:hover {
    background: rgba(212,221,237,0.25);
  }
`;

const Avatar = styled.img`
  display: inline-block;
  vertical-align: middle;

  width: 36px;
  height: 36px;
`;

const Name = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
`;

const SearchQuery = styled(Link)`
  display: block;

  padding-bottom: 10px;
  color: #3E97FF;

  text-align: center;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background: rgba(255, 255, 255, 0.5);
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;

  border-top: 1px solid #3E97FF;
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

class Search extends Component {
  state = {
    search: '',
    isDropdownActive: false,
    isSearching: false,
    shouldRenderRepo: false,
    repos: [],
  }

  debounceSearch = debounce(() => {
    const { search } = this.state;
    const trimmed = search.trim();
    this.setState({ isSearching: true });
    this.props.appContext.searchRepo({
      q: trimmed,
      per_page: 5,
    }).then((data) => {
      this.setState(prevState => ({
        ...prevState,
        shouldRenderRepo: true,
        repos: data.items,
        isSearching: false,
      }));
    }).catch(() => this.setState({ isSearching: false }));
  }, 300);

  handleClickOutside = () => {
    if (this.state.isDropdownActive) {
      this.setState(() => ({ isDropdownActive: false }));
    }
  }

  toggleDropdown = () => {
    if (this.state.search.trim().length > 2) {
      this.setState({ isDropdownActive: true });
    }
  }

  handleChange = (e) => {
    e.persist();
    this.setState(() => ({ search: e.target.value }), () => {
      const { search } = this.state;
      const trimmed = search.trim();
      if (trimmed.length > 2) {
        this.debounceSearch();
        this.setState(() => ({ isDropdownActive: true }));
      } else {
        this.setState(() => ({ isDropdownActive: false }));
      }
    });
  }

  handleClear = () => {
    this.setState(() => ({
      search: '',
      isDropdownActive: false,
      isSearching: false,
      shouldRenderRepo: false,
      repos: [],
    }));
  }

  handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search?q=${this.state.search}`);
  }

  render() {
    const { search, shouldRenderRepo, repos, isDropdownActive, isSearching } = this.state;
    return (
      <Wrapper onSubmit={this.handleSearch}>
        <Input
          placeholder="Search repositories"
          value={search}
          onClick={this.toggleDropdown}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <SearchIcon className={this.state.search.length > 0 ? 'is-hidden' : ''} />
        <ClearIcon
          className={this.state.search.length === 0 ? 'is-hidden' : ''}
          onClick={this.handleClear}
        />
        <Dropdown isActive={isDropdownActive} className={isDropdownActive && 'is-active'}>
          {isSearching && (
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
          )}
          <SearchQuery to={`/search?q=${encodeURIComponent(search)}`}>
            Hit enter or click here to display all results for {'"'}{search}{'"'}
          </SearchQuery>
          {shouldRenderRepo && repos.length > 0 && repos.map(repo => (
            <Repo
              key={repo.id}
              to={`/${repo.full_name}`}
              onClick={() => {
                this.setState({ search: repo.full_name });
                this.handleClickOutside();
              }}
            >
              <Avatar src={repo.owner.avatar_url} alt={repo.full_name} />
              <Name>{repo.full_name}</Name>
            </Repo>
          ))}
        </Dropdown>
      </Wrapper>
    );
  }
}


Search.propTypes = {
  appContext: PropTypes.shape({
    searchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(withClickOutside(Search));
