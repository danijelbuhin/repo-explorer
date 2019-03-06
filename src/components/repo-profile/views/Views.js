import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Panel from '../panel/Panel';

import firebase from '../../../services/firebase';
import useApiState from '../../../hooks/useApiState';
import Map from './map/Map';

const Wrapper = styled.div`
  padding: 10px;

  .views-breakdown-map {
    border: 1px solid #f0f1f6;

    .views-country {
      cursor: pointer;
      transition: all .2s ease-in-out;
    }

    ${({ focusedCountry }) => focusedCountry && `
      .views-country-${focusedCountry} {
        fill: #89E051 !important;
      }
    `};
  }
`;

const Countries = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  border-bottom: 1px solid #f0f1f6;
  margin-bottom: 20px;
  padding-bottom: 20px;
`;

const Country = styled.div`
  width: 19%;
  padding: 10px;
  margin: 1% 0.5%;

  border: 1px solid #f0f1f6;

  cursor: pointer;

  background: transparent;

  transition: all .2s ease-in-out;

  span {
    display: inline-block;
    margin-right: 5px;
  }

  &:hover {
    background: #f0f1f6;
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    transform: translate3d(0, -5px, 0);
  }

  ${({ isFocused }) => isFocused && `
    background: #f0f1f6;
    box-shadow: 0px 2px 4px rgba(212, 221, 237, 0.25);
    transform: translate3d(0, -5px, 0);
  `};
`;

const UnknownFlag = styled.div`
  display: inline-block;
  width: 18px;
  height: 14px;
  margin-right: 5px;

  background: #333;
`;

const Name = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Count = styled.strong`
  font-size: 24px;
`;


const Views = ({ id }) => {
  const [countriesState, setCountriesState] = useApiState({ isLoading: true, hasError: false });
  const [countries, setCountries] = useState({});

  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([10, 20]);

  const [maxViews, setMaxViews] = useState(0);
  const [focusedCountry, setFocusedCountry] = useState('');

  const map = document.querySelector('.views-breakdown-map');

  const handleScroll = (e) => {
    e.preventDefault();
    if (zoom <= 1 && e.deltaY > 0) {
      setZoom(1);
      setCenter([10, 20]);
      return;
    }
    if (zoom >= 7 && e.deltaY < 0) {
      return;
    }
    if (e.deltaY > 0) {
      setZoom(zoom / 2);
    } else {
      setZoom(zoom * 2);
    }
  };

  const zoomToCountry = (country) => {
    if (!countries[country]) return;
    setZoom(6);
    setCenter(countries[country].coords);
    setFocusedCountry(country);
  };

  useEffect(() => {
    firebase.viewsBreakdown.doc(String(id)).get().then((doc) => {
      const _countries = doc.data().countries;
      const topCountry = Object.keys(_countries).reduce((prev, curr) => _countries[prev].views > _countries[curr].views ? prev : curr);
      setMaxViews(_countries[topCountry].views);
      setCountriesState({ isLoading: false, hasError: false });
      setCountries(_countries);
    });
  }, []);

  useEffect(() => {
    if (map) {
      map.addEventListener('wheel', handleScroll);
    }
    return () => {
      if (map) {
        map.removeEventListener('wheel', handleScroll);
      }
    };
  }, [map, zoom]);

  return (
    <Panel title="Views breakdown" isClosable={false}>
      {countriesState.isLoading && (
        <div>Loading countries...</div>
      )}
      {!countriesState.hasError
      && !countriesState.isLoading
      && Object.keys(countries).length > 0 && (
        <Wrapper focusedCountry={focusedCountry}>
          <Countries>
            {Object.keys(countries).map(c => (
              <Country
                key={countries[c].country_code}
                isFocused={c === focusedCountry}
                onClick={() => {
                  if (countries[c].country_code === 'UNKNOWN') return;
                  zoomToCountry(c);
                }}
              >
                <Name>
                  {countries[c].country_code === 'UNKNOWN' ? (
                    <UnknownFlag />
                  ) : (
                    <span
                      className={`flag-icon flag-icon-${countries[c].country_code.toLowerCase()}`}
                    />
                  )}
                  <span>{countries[c].country_name}</span>
                </Name>
                <Count>{countries[c].views}</Count>
              </Country>
            ))}
          </Countries>
          <Map
            maxViews={maxViews}
            setZoom={setZoom}
            setCenter={setCenter}
            setFocusedCountry={setFocusedCountry}
            zoomToCountry={zoomToCountry}
            zoom={zoom}
            center={center}
            countries={countries}
          />
        </Wrapper>
      )}
    </Panel>
  );
};

Views.propTypes = {
  id: PropTypes.number,
};

Views.defaultProps = {
  id: 0,
};

export default Views;
