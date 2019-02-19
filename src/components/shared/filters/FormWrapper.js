import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik } from 'formik';

import Button from '../button/Button';
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

const FiltersFormWrapper = ({
  isClear,
  onClear,
  children,
  ...rest
}) => (
  <Formik {...rest}>
    {props => (
      <form onSubmit={props.handleSubmit}>
        <Header>
          <span>Apply filters</span>
          <Clear onClick={onClear}>
            <span>Clear</span>
            <TrashSVG />
          </Clear>
        </Header>
        {children(props)}
        <Footer>
          <Button
            block
            color="primary"
            type="submit"
            disabled={props.isSubmitting}
          >
            {props.isSubmitting ? 'Applying filters...' : 'Apply'}
          </Button>
        </Footer>
      </form>
    )}
  </Formik>
);

FiltersFormWrapper.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  isClear: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default FiltersFormWrapper;
