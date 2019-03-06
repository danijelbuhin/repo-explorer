import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Motion, spring } from 'react-motion';
import { scaleLinear } from 'd3-scale';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';

import Button from '../../../shared/button/Button';

import geoMap from '../world-110m.json';

const Map = ({
  maxViews,
  setZoom,
  setCenter,
  setFocusedCountry,
  zoomToCountry,
  zoom,
  countries,
  center,
}) => {
  const generateColor = scaleLinear()
    .domain([0, maxViews / 3, maxViews / 2, maxViews])
    .range(['#bdd9f9', '#91bef2', '#63abff', '#3E97FF']);

  return (
    <React.Fragment>
      <Button
        style={{ marginBottom: 20 }}
        onClick={() => {
          setZoom(1);
          setCenter([10, 20]);
          setFocusedCountry('');
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
          zoom: spring(zoom, { stiffness: 100, damping: 20 }),
          x: spring(center[0], { stiffness: 100, damping: 20 }),
          y: spring(center[1], { stiffness: 100, damping: 20 }),
        }}
      >
        {({ zoom: _zoom, x, y }) => (
          <ComposableMap
            projectionConfig={{ scale: 220 }}
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
              zoom={_zoom}
            >
              <Geographies geography={geoMap}>
                {(geographies, projection) => geographies.map((geography, i) => {
                  if (geography.properties.ISO_A2 === 'AQ') return null;
                  const country = countries[geography.properties.ISO_A2];
                  return (
                    <Geography
                      key={`views-country-${i.toString()}`}
                      className={`views-country views-country-${geography.properties.ISO_A2}`}
                      geography={geography}
                      projection={projection}
                      data-tip={`${geography.properties.NAME_LONG} - ${(country && country.views) || 0}`}
                      style={{
                        default: {
                          fill: generateColor(country && country.views) || '#ECEFF1',
                          stroke: country && country.views > 0 ? '#ECEFF1' : '#95a5ad',
                          strokeWidth: 0.25,
                          outline: 'none',
                        },
                        hover: {
                          fill: '#2b8cff',
                          stroke: '#ECEFF1',
                          strokeWidth: 0.25,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#1e83fc',
                          stroke: '#1e83fc',
                          strokeWidth: 0.25,
                          outline: 'none',
                        },
                      }}
                      onClick={({ properties }) => {
                        zoomToCountry(properties.ISO_A2);
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
    </React.Fragment>
  );
};

Map.propTypes = {
  maxViews: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  setZoom: PropTypes.func.isRequired,
  setCenter: PropTypes.func.isRequired,
  setFocusedCountry: PropTypes.func.isRequired,
  zoomToCountry: PropTypes.func.isRequired,
  countries: PropTypes.object.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Map;
