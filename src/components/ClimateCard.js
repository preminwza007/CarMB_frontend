// src/components/ClimateCard.js

import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import './ClimateCard.css';

const ClimateCard = () => {
  const [temperature, setTemperature] = useState(22);

  const handleSliderChange = (event) => {
    const newTemp = event.target.value;
    setTemperature(newTemp);
    event.target.style.backgroundSize = `${((newTemp - 10) / 30) * 100}% 100%`;
  };

  // ไม่จำเป็นต้องคำนวณ iconPositionPercent อีกต่อไป

  return (
    <Card
      className="card-stats mb-4 mb-xl-0"
      style={{
        backgroundColor: '#1C1E21',
        border: 'none',
        borderRadius: '15px',
        color: 'white',
        height: '260px',
      }}
    >
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h5 className="card-title text-white mb-0" style={{fontSize: '1.1rem'}}>Climate</h5>
            <span style={{ color: '#adb5bd', fontSize: '0.8rem' }}>CLOUDLESS: 27° C</span>
          </div>
          <span className="text-muted" style={{cursor: 'pointer'}}>•••</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <span className="h1 font-weight-bold mb-0 text-white">{temperature}° C</span>
            <p className="mb-0" style={{ color: '#adb5bd', fontSize: '0.8rem' }}>WINDOW CLOSED</p>
          </div>
          <div style={{fontSize: '2rem', color: '#5E72E4'}}>
            <i className="fa fa-snowflake" />
          </div>
        </div>

        <div className="mt-4">
          <div className="slider-container">
            <input
              type="range"
              min="10"
              max="40"
              value={temperature}
              className="climate-slider"
              onChange={handleSliderChange}
            />
            {/* ลบ div ที่เป็นไอคอนพัดลมตรงนี้ออกไป */}
            {/*
            <div className="slider-handle-icon" style={{ left: `${iconPositionPercent}%` }}>
              <i className="fa fa-fan" style={{color: '#2C2F33'}}></i>
            </div>
            */}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#adb5bd', marginTop: '5px' }}>
            <span>10° C</span>
            <span>40° C</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClimateCard;