import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import ReactTooltip from 'react-tooltip';

import Panel from '../panel/Panel';

import geoMap from './world-50m.json';
import firebase from '../../../services/firebase';
import useApiState from '../../../hooks/useApiState';

const Wrapper = styled.div`
  padding: 10px;
`;

const Countries = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  border-bottom: 1px solid #f7f7f7;
  margin-bottom: 20px;
  padding-bottom: 20px;
`;

const Country = styled.div`
  width: 15%;
  padding: 10px;

  span {
    display: inline-block;
    margin-right: 5px;
  }
`;

const UnknownFlag = styled.div`
  display: inline-block;
  width: 18px;
  height: 14px;
  margin-right: 5px;

  background: #333;
`;

const Readme = ({ id }) => {
  const [countriesState, setCountriesState] = useApiState({ isLoading: true, hasError: false });
  const [countries, setCountries] = useState({});

  useEffect(() => {
    firebase.viewsBreakdown.doc(String(id)).get().then((doc) => {
      setCountriesState({ isLoading: false, hasError: false });
      setCountries(doc.data().countries);
    });
  }, []);

  return (
    <Panel title="Views breakdown (In progress)" isClosable={false}>
      {countriesState.isLoading && (
        <div>Loading countries...</div>
      )}
      {!countriesState.hasError
      && !countriesState.isLoading
      && Object.keys(countries).length > 0 && (
        <Wrapper>
          <Countries>
            {Object.keys(countries).map(c => (
              <Country key={countries[c].country_code}>
                {countries[c].country_code === 'UNKNOWN' ? (
                  <UnknownFlag />
                ) : (
                  <span
                    className={`flag-icon flag-icon-${countries[c].country_code.toLowerCase()}`}
                  />
                )}
                {countries[c].country_name} <br />
                {countries[c].views}
              </Country>
            ))}
          </Countries>
          <ComposableMap
            projectionConfig={{
              scale: 195,
            }}
            width={980}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <ZoomableGroup>
              <Geographies geography={geoMap}>
                {(geographies, projection) => geographies.map((geography, i) => {
                  if (geography.properties.ISO_A2 === 'AQ') return null;
                  const country = countries[geography.properties.ISO_A2];
                  return (
                    <Geography
                      key={`views-country-${i.toString()}`}
                      geography={geography}
                      projection={projection}
                      data-tip={`${geography.properties.NAME_LONG} - ${(country && country.views) || 0}`}
                      style={{
                        default: {
                          fill: country && country.views > 0 ? '#3E97FF' : '#ECEFF1',
                          stroke: country && country.views > 0 ? '#3E97FF' : '#607D8B',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        hover: {
                          fill: '#2b8cff',
                          stroke: '#2b8cff',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#1e83fc',
                          stroke: '#1e83fc',
                          strokeWidth: 0.75,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <ReactTooltip />
        </Wrapper>
      )}
    </Panel>
  );
};

Readme.propTypes = {
  id: PropTypes.number,
};

Readme.defaultProps = {
  id: 0,
};

export default Readme;
