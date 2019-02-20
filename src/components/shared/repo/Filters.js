import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withClickOutside from 'react-click-outside';
import qs from 'qs';
import { withRouter } from 'react-router-dom';

import Dropdown from '../dropdown/Dropdown';
import { ReactComponent as FilterSVG } from './assets/Filter.svg';
import { ReactComponent as DeleteSVG } from './assets/Delete.svg';
import FiltersForm from './filters-form/FiltersForm';
import history from '../../../history';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 0 0 auto;
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

const Tags = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 30px;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  &:not(:last-child) {
    margin-right: 5px;
  }

  background: #3E97FF;
  border-radius: 50px;
  font-size: 12px;
`;

const Text = styled.div`
  color: #ffffff;
  padding: 0 5px;
`;

const Delete = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;

  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;

    stroke: #FFF;
  }
`;

class Filters extends Component {
  state = {
    isDropdownActive: false,
    tags: [],
  }

  componentDidMount() {
    this.generateTagsFromParams(this.getQueryParams());
    this.props.fetchRepos(this.getQueryParams());
  }

  getQueryParams = () => {
    const { location: { search } } = this.props;
    const params = qs.parse(search, { ignoreQueryPrefix: true });
    return params;
  }

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownActive: !prevState.isDropdownActive }));
  }

  handleClickOutside = () => {
    if (this.state.isDropdownActive) {
      this.setState(() => ({ isDropdownActive: false }));
    }
  }

  handleClear = ({ setValues, setSubmitting }) => {
    setSubmitting(true);
    setValues({ min_stars: '', order: '' });
    history.push({
      pathname: this.props.location.pathname,
      search: '',
    });
    this.generateTagsFromParams({});
    this.props.fetchRepos({})
      .then(() => setSubmitting(false));
  }

  handleSubmit = (values, { setSubmitting }) => {
    const params = {
      min_stars: values.min_stars || undefined,
      order: values.order || undefined,
    };
    history.push({
      pathname: this.props.location.pathname,
      search: qs.stringify(params),
    });
    this.generateTagsFromParams(params);
    this.props.fetchRepos(params, setSubmitting);
  }

  generateTagsFromParams = (params) => {
    const tags = [];
    if (params.order) {
      tags.push({ id: 'order', text: `Order: ${params.order}` });
    }
    if (params.min_stars) {
      tags.push({ id: 'min_stars', text: `Min. Stars: ${params.min_stars}` });
    }
    this.setState({ tags });
  }

  onTagDelete = (id) => {
    const newParams = { ...this.getQueryParams(), [id]: undefined };
    history.push({
      pathname: this.props.location.pathname,
      search: qs.stringify(newParams),
    });
    this.generateTagsFromParams(newParams);
    this.props.fetchRepos(newParams);
  }

  render() {
    const { isDropdownActive, tags } = this.state;
    return (
      <Wrapper>
        {tags.length > 0 && (
          <Tags>
            {tags.map(tag => (
              <Tag key={tag.id}>
                <Text>{tag.text}</Text>
                <Delete onClick={() => this.onTagDelete(tag.id)}>
                  <DeleteSVG />
                </Delete>
              </Tag>
            ))}
          </Tags>
        )}
        <FilterIcon onClick={this.toggleDropdown}>
          <FilterSVG />
        </FilterIcon>
        <Dropdown isActive={isDropdownActive} style={{ width: '250px', bottom: '-5px' }}>
          <FiltersForm
            onSubmit={this.handleSubmit}
            onClear={this.handleClear}
            isClear={(
              !this.getQueryParams().order
              && !this.getQueryParams().min_stars
            )}
            initialValues={{
              order: this.getQueryParams().order || '',
              min_stars: this.getQueryParams().min_stars || '',
            }}
            enableReinitialize
          />
        </Dropdown>
      </Wrapper>
    );
  }
}

Filters.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  fetchRepos: PropTypes.func.isRequired,
};

export default withRouter(withClickOutside(Filters));
