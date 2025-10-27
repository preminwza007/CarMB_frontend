import React from 'react';
import { Card, CardBody, CustomInput } from 'reactstrap';

const EmergencyCard = () => {
  return (
    <Card
      className="card-stats"
      style={{
        backgroundColor: '#2C2F33',
        borderRadius: '25px',
        border: 'none',
        minHeight: '100px',      // CHANGE: ลดความสูงขั้นต่ำลงจาก 120px เป็น 100px
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <CardBody style={{ padding: '1rem', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* Left Icon */}
          <div style={{ 
            backgroundColor: 'rgba(245, 54, 92, 0.2)',
            borderRadius: '12px', 
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}>
            <i className="fa fa-exclamation-triangle" style={{ color: '#F5365C', fontSize: '1.2rem' }} />
          </div>

          {/* Middle Text */}
          <div style={{ flexGrow: 1 }}>
            <h5 style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
              Emergency
            </h5>
            <p style={{ color: '#adb5bd', fontSize: '0.75rem', margin: 0, whiteSpace: 'nowrap' }}>
              Switch On only in Emergency case
            </p>
          </div>

          {/* Right Switch */}
          <div>
            <CustomInput
              type="switch"
              id="emergencySwitchNew"
              name="emergencySwitchNew"
              style={{ transform: 'scale(1.2)' }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmergencyCard;