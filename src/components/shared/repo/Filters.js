import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withClickOutside from 'react-click-outside';

import Dropdown from '../dropdown/Dropdown';
import { ReactComponent as FilterSVG } from './assets/Filter.svg';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 0 0 auto;
  width: 200px;
`;

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;
  border-radius: 100px;
  background: #AEB6CB;

  cursor: pointer;

  svg {
    stroke: #ffffff;
    width: 20px;
    height: 20px;
  }
`;

class Filters extends Component {
  state = {
    isDropdownActive: false,
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownActive: !prevState.isDropdownActive }));
  }

  handleClickOutside = () => {
    if (this.state.isDropdownActive) {
      this.setState(() => ({ isDropdownActive: false }));
    }
  }

  render() {
    const { isDropdownActive } = this.state;
    const { filtersForm } = this.props;
    return (
      <Wrapper>
        <FilterIcon onClick={this.toggleDropdown}>
          <FilterSVG />
        </FilterIcon>
        <Dropdown isActive={isDropdownActive} style={{ width: '250px', bottom: '-5px' }}>
          {filtersForm}
        </Dropdown>
      </Wrapper>
    );
  }
}

Filters.propTypes = {
  filtersForm: PropTypes.node.isRequired,
};

export default withClickOutside(Filters);
