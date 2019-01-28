import React, { Component } from 'react';
import styled from 'styled-components';

import { ReactComponent as SearchSVG } from './assets/Search.svg';
import history from '../../../history';

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  max-width: 630px;
  width: 100%;
  position: relative;

  padding: 10px;
  margin: 70px auto;
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
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { search } = this.state;
    const trimmed = search.trim();
    const regex = /([a-z]+\/[a-z])\w+/g;
    if (trimmed) {
      const test = regex.exec(trimmed);
      if (test) {
        console.log(test[0]);
      }
      // console.log(regex.exec(trimmed));
      history.push(`/search?q=${search}`);
    }
  }

  render() {
    const { search } = this.state;
    return (
      <Wrapper onSubmit={this.handleSearch}>
        <Input
          placeholder="Search repositories"
          value={search}
          onChange={e => this.setState({ search: e.target.value })}
        />
        <Icon />
      </Wrapper>
    );
  }
}

export default Search;
