import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withClickOutside from 'react-click-outside';

import withAppContext from '../../shared/app/withAppContext';

import { ReactComponent as SearchSVG } from './assets/Search.svg';
import history from '../../../history';

import Dropdown, { Wrapper as DropdownWrapper } from '../../shared/dropdown/Dropdown';

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  max-width: 630px;
  width: 100%;
  position: relative;

  margin: 70px auto;

  ${DropdownWrapper} {
    width: 100%;
    bottom: -3px;
  }
`;

const Input = styled.input`
  width: 100%;

  padding: 18px 45px 18px 18px;

  background: #FFFFFF;
  color: #AEB6CB;
  font-size: 16px;
  border: 1px solid rgba(212, 221, 237, 0.25);
  box-sizing: border-box;
  box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
  border-radius: 3px;

  transition: all .3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3E97FF;
  }
`;

const Icon = styled(SearchSVG)`
  position: absolute;
  top: 50%;
  right: 25px;

  transform: translateY(-50%);
`;

class Search extends Component {
  state = {
    search: '',
    isDropdownActive: false,
    renderRepo: false,
    repo: null,
  }

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
      const regex = /([a-z]+\/[a-z])\w+/g; // fix
      if (trimmed.length > 2) {
        const test = regex.exec(trimmed);
        if (test) {
          this.props.appContext
            .fetchRepo(trimmed)
            .then((data) => {
              this.setState(prevState => ({
                ...prevState,
                renderRepo: true,
                repo: {
                  full_name: data.full_name,
                  id: data.id,
                  avatar_url: data.owner && data.owner.avatar_url,
                },
              }));
            })
            .catch(() => {
              this.setState(prevProps => ({
                ...prevProps,
                renderRepo: false,
                repo: null,
              }));
            });
        } else {
          this.setState(prevProps => ({
            ...prevProps,
            renderRepo: false,
            repo: null,
          }));
        }
        this.setState(() => ({ isDropdownActive: true }));
      } else {
        this.setState(() => ({ isDropdownActive: false }));
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    history.push(`/search?q=${this.state.search}`);
  }

  render() {
    const { search, renderRepo, repo, isDropdownActive } = this.state;
    return (
      <Wrapper onSubmit={this.handleSearch}>
        <Input
          placeholder="Search repositories"
          value={search}
          onClick={this.toggleDropdown}
          onChange={this.handleChange}
        />
        <Icon />
        <Dropdown isActive={isDropdownActive} className={isDropdownActive && 'is-active'}>
          Search query: {search}
          <hr />
          {renderRepo && repo.id && (
            <div>
              <img src={repo.avatar_url} alt={repo.full_name} style={{ width: 36, height: 36 }} />
              {repo.full_name}
            </div>
          )}
          {renderRepo && !repo.id && (
            <div>Repo "{search}" was not found.</div>
          )}
        </Dropdown>
      </Wrapper>
    );
  }
}


Search.propTypes = {
  appContext: PropTypes.shape({
    fetchRepo: PropTypes.func,
  }).isRequired,
};

export default withAppContext(withClickOutside(Search));
