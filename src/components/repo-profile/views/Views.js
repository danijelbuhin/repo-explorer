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

const Toggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const Option = styled.div`
  margin: 0 10px;
  cursor: pointer;

  transition: all .3s ease-in-out;

  
  border-bottom: 2px solid ${({ isActive }) => isActive ? '#3E97FF' : '#fff'};

  &:hover {
    border-bottom-color: #3E97FF;
  }
`;

const Readme = ({ id }) => {
  const [countriesState, setCountriesState] = useApiState({ isLoading: true, hasError: false });
  const [countries, setCountries] = useState({});

  const [view, setView] = useState('list');

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
          <Toggle>
            <Option isActive={view === 'list'} onClick={() => setView('list')}>List View</Option>
            <Option isActive={view === 'map'} onClick={() => setView('map')}>Map View</Option>
          </Toggle>
          {view === 'list' && (
            <ul>
              {Object.keys(countries).map(c => (
                <li key={countries[c].country_code}>{countries[c].country_name} - {countries[c].views}</li>
              ))}
            </ul>
          )}
          {view === 'map' && (
            <React.Fragment>
              <ComposableMap
                projectionConfig={{
                  scale: 215,
                  rotation: [-7, 0, 0],
                }}
                width={980}
                height={750}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              >
                <ZoomableGroup>
                  <Geographies geography={geoMap}>
                    {(geographies, projection) => geographies.map((geography, i) => {
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
            </React.Fragment>
          )}
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
