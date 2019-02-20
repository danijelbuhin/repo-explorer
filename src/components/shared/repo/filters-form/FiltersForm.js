import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik } from 'formik';

import Select from '../../select/Select';

import { Label, FormGroup } from './styled';
import Button from '../../button/Button';
import { ReactComponent as TrashSVG } from './assets/Trash.svg';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 20px;
`;

const Clear = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;

    stroke: #E24B26;
  }
`;

const order = [
  { value: '', label: 'Select order' },
  { value: 'desc', label: 'Descending (Default)' },
  { value: 'asc', label: 'Ascending' },
];

const min_stars = [
  { value: '', label: 'Select min stars' },
  { value: '50000', label: '50 000' },
  { value: '30000', label: '30 000 (Default)' },
  { value: '15000', label: '15 000' },
  { value: '10000', label: '10 000' },
  { value: '5000', label: '5 000' },
  { value: '3000', label: '3 000' },
];

const FiltersForm = ({
  isClear,
  onClear,
  ...rest
}) => (
  <Formik {...rest}>
    {({
      values,
      handleSubmit,
      setFieldValue,
      isSubmitting,
      setValues,
      setSubmitting,
    }) => (
      <form onSubmit={handleSubmit}>
        <Header>
          <span>Apply filters</span>
          {!isClear && (
            <Clear onClick={() => onClear({ setSubmitting, setValues })}>
              <span>Clear</span>
              <TrashSVG />
            </Clear>
          )}
        </Header>
        <FormGroup>
          <Label>Minimal stars count</Label>
          <Select
            placeholder="Min. Stars"
            value={values.min_stars}
            options={min_stars}
            onChange={(selected) => {
              setFieldValue('min_stars', selected.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Select order direction</Label>
          <Select
            placeholder="Order direction"
            value={values.order}
            options={order}
            onChange={(selected) => {
              setFieldValue('order', selected.value);
            }}
          />
        </FormGroup>
        <Footer>
          <Button
            block
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Applying filters...' : 'Apply'}
          </Button>
        </Footer>
      </form>
    )}
  </Formik>
);

FiltersForm.propTypes = {
  isClear: PropTypes.bool.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default FiltersForm;
