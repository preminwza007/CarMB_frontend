import React from 'react';
import { Card, CardBody } from 'reactstrap';

const SimpleSwitch = ({ isToggled, handleToggle, title }) => {
  return (
    <Card
      className="clickable-card"
      onClick={handleToggle}
      style={{
        width: '100%',
        position: 'relative',
        paddingTop: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isToggled ? '#007bff' : '#1C1E21',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <CardBody
          style={{
            padding: '0px',
            display: 'flex',
            flexGrow: 1,
            width: '100%',
          }}
        >
          {/* เนื้อหาอื่นๆ หากมี */}
        </CardBody>
      </div>
    </Card>
  );
};

export default SimpleSwitch;