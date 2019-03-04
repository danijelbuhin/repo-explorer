import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { Motion, spring } from 'react-motion';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';

import Panel from '../panel/Panel';
import Button from '../../shared/button/Button';

import geoMap from './world-110m.json';
import firebase from '../../../services/firebase';
import useApiState from '../../../hooks/useApiState';

const Wrapper = styled.div`
  padding: 10px;

  .views-breakdown-map {
    border: 1px solid #f0f1f6;
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
  width: 15%;
  padding: 10px;

  cursor: pointer;

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

  const [_zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([10, 20]);

  const map = document.querySelector('.views-breakdown-map');

  const handleScroll = (e) => {
    if (_zoom === 1 && e.deltaY > 0) return;
    if (e.deltaY > 0) {
      setZoom(_zoom / 2);
    } else {
      setZoom(_zoom * 2);
    }
  };

  useEffect(() => {
    firebase.viewsBreakdown.doc(String(id)).get().then((doc) => {
      setCountriesState({ isLoading: false, hasError: false });
      setCountries(doc.data().countries);
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
  }, [map, _zoom]);

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
              <Country
                key={countries[c].country_code}
                onClick={() => {
                  if (countries[c].country_code === 'UNKNOWN') return;
                  setZoom(6);
                  setCenter(countries[c].coords || [0, 20]);
                }}
              >
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
          <Button
            style={{ marginBottom: 20 }}
            onClick={() => {
              setZoom(1);
              setCenter([10, 20]);
            }}
          >
            Reset map
          </Button>
          <Motion
            defaultStyle={{
              zoom: 1,
              x: 10,
              y: 20,
            }}
            style={{
              zoom: spring(_zoom, { stiffness: 150, damping: 20 }),
              x: spring(center[0], { stiffness: 250, damping: 20 }),
              y: spring(center[1], { stiffness: 250, damping: 20 }),
            }}
          >
            {({ zoom, x, y }) => (
              <ComposableMap
                projectionConfig={{
                  scale: 220,
                }}
                width={980}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
                className="views-breakdown-map"
              >
                <ZoomableGroup
                  center={[x, y]}
                  zoom={zoom}
                >
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
                              strokeWidth: zoom / 2.75,
                              outline: 'none',
                            },
                            hover: {
                              fill: '#2b8cff',
                              stroke: '#2b8cff',
                              strokeWidth: zoom / 2.75,
                              outline: 'none',
                            },
                            pressed: {
                              fill: '#1e83fc',
                              stroke: '#1e83fc',
                              strokeWidth: zoom / 2.75,
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    })}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>
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