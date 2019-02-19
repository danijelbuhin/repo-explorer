import React, { Fragment } from 'react';

import FiltersFormWrapper from '../../shared/filters/FormWrapper';
import Select from '../../shared/select/Select';
import { Label, FormGroup } from '../../shared/filters/styled';

const order = [
  { value: '', label: 'Higher starred first' },
  { value: 'asc', label: 'Lower starred first' },
];

const minStars = [
  { value: '', label: 'Default (30 000)' },
  { value: 15000, label: '15 000' },
  { value: 10000, label: '10 000' },
  { value: 5000, label: '5 000' },
  { value: 3000, label: '3 000' },
];

const FiltersForm = ({
  isClear,
  onClear,
  ...rest
}) => (
  <FiltersFormWrapper
    isClear={isClear}
    onClear={onClear}
    {...rest}
  >
    {({
      values,
      handleChange,
      setFieldValue,
    }) => (
      <Fragment>
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
        <FormGroup>
          <Label>Select order direction</Label>
          <Select
            placeholder="Min. Stars"
            value={values.minStars}
            options={minStars}
            onChange={(selected) => {
              setFieldValue('minStars', selected.value);
            }}
          />
        </FormGroup>
      </Fragment>
    )}
  </FiltersFormWrapper>
);

export default FiltersForm;
