import React from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 0;
  width: 100%;

  .custom-select {
    text-align: left;

    &__placeholder {
      color: #333;
    }

    &__control {
      height: 40px;
      padding: 8px 5px;
      min-height: 40px;
      
      background: #FFF;
      border-radius: 8px;
      box-shadow: 0px 2px 10px rgba(0,0,0,.1);
      border: none;

      cursor: pointer;
    }

    &__menu {
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 3px;

      &-list {
        max-height: 400px;
      }
    }

    &__indicator-separator {
      display: none;
    }
  }
`;

const Select = props => (
  <Wrapper>
    <ReactSelect
      className="custom-select-container"
      classNamePrefix="custom-select"
      placeholder={props.placeholder}
      value={props.value ? props.options.filter(o => o.value === props.value)[0] : props.options[0]}
      onChange={props.onChange}
      options={props.options}
      isClearable={false}
      isSearchable={false}
      isMulti={false}
      blurInputOnSelect
    // menuIsOpen
    />
  </Wrapper>
);

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Select;
