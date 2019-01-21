import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
`;

const Details = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transform: translate(-50%, -50%);
`;

const UpperNumber = styled.span`
  border-bottom: 1px solid #DFE3E9;
`;

const LowerNumber = styled.span`
  
`;

const Circle = styled.svg`
  width: 90px;
  height: 90px;

  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  position: relative;
`;

const CircleFill = styled.circle`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 3;
`;

const GaugeChart = ({
  percentage,
  color,
  upValue,
  downValue,
}) => (
  <Wrapper>
    <Details>
      {console.log(color)}
      <UpperNumber>
        {upValue}
      </UpperNumber>
      <LowerNumber>
        {downValue}
      </LowerNumber>
    </Details>
    <Circle
      height="90"
      width="90"
      viewBox="0 0 90 90"
    >
      <CircleBackground
        cx="45"
        cy="45"
        r="40"
        stroke="#DFE3E9"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <CircleFill
        cx="45"
        cy="45"
        r="40"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="250.9"
        strokeDashoffset={`${250.9 * (1 - (percentage / 100))}`}
        fill="none"
      />
    </Circle>
  </Wrapper>
);

GaugeChart.propTypes = {
  color: PropTypes.string.isRequired,
  percentage: PropTypes.string.isRequired,
  upValue: PropTypes.number.isRequired,
  downValue: PropTypes.number.isRequired,
};

export default GaugeChart;
