import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

// --- Sub-component: ปุ่มควบคุมวงกลมที่ทำงานได้ ---
const ControlDial = ({ initialPercentage, topIcon, bottomIcon, leftIcon, rightIcon, controlType }) => {
  // 1. สร้าง state เพื่อเก็บค่า percentage ของแต่ละวงกลม
  const [percentage, setPercentage] = useState(initialPercentage);

  // 2. สร้างฟังก์ชันสำหรับเพิ่มและลดค่า
  const handleIncrease = () => {
    setPercentage(prev => Math.min(prev + 1, 100)); // เพิ่มค่าทีละ 1, สูงสุด 100
  };

  const handleDecrease = () => {
    setPercentage(prev => Math.max(prev - 1, 0)); // ลดค่าทีละ 1, ต่ำสุด 0
  };

  // 3. กำหนดฟังก์ชันที่จะเรียกใช้สำหรับแต่ละไอคอน
  const getClickHandler = (icon) => {
    if (controlType === 'volume') {
      if (icon === 'right') return handleIncrease;
      if (icon === 'left') return handleDecrease;
    }
    if (controlType === 'brightness') {
      if (icon === 'top' || icon === 'right') return handleIncrease;
      if (icon === 'bottom' || icon === 'left') return handleDecrease;
    }
    return () => {}; // ถ้าไม่ใช่ปุ่มควบคุม, ไม่ต้องทำอะไร
  };

  return (
    <div style={{
      width: '230px', height: '230px',
      position: 'relative',
    }}>
      {/* วงกลมใหญ่ */}
      <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: '#1C1E21', borderRadius: '50%',
      }}></div>

      {/* วงกลมเล็ก */}
      <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90px', height: '90px',
          backgroundColor: '#2C2F33', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
          <span style={{ fontSize: '2.0rem', fontWeight: '500', color: 'white' }}>{percentage}%</span>
      </div>

      {/* 4. เพิ่ม onClick ให้กับไอคอนต่างๆ */}
      <i className={`fa ${topIcon}`} onClick={getClickHandler('top')} style={{ cursor: 'pointer', position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.4rem', color: '#adb5bd' }} />
      <i className={`fa ${bottomIcon}`} onClick={getClickHandler('bottom')} style={{ cursor: 'pointer', position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.4rem', color: '#adb5bd' }} />
      <i className={`fa ${leftIcon}`} onClick={getClickHandler('left')} style={{ cursor: 'pointer', position: 'absolute', left: '35px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem', color: '#adb5bd' }} />
      <i className={`fa ${rightIcon}`} onClick={getClickHandler('right')} style={{ cursor: 'pointer', position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem', color: '#adb5bd' }} />
    </div>
  );
};


// --- Sub-component: การ์ดสถานะตรงกลาง (ไม่มีการเปลี่ยนแปลง) ---
const StatusCard = () => (
  <div style={{
    backgroundColor: '#2C2F33', borderRadius: '20px', padding: '1rem',
    color: 'white', textAlign: 'center', width: '250px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>172 <span style={{fontSize: '0.9rem', color: '#adb5bd'}}>Km left</span></span>
      <i className="fa fa-bolt" style={{ color: '#2dce89', fontSize: '1.2rem' }} />
    </div>
    <div style={{ backgroundColor: '#1C1E21', borderRadius: '10px', height: '8px', marginTop: '0.8rem', display: 'flex' }}>
      <div style={{ width: '40%', backgroundColor: '#2dce89', borderRadius: '10px' }}></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
      <i className="fa fa-sun-o" style={{ fontSize: '1.2rem', color: '#adb5bd' }} />
      <i className="fa fa-user" style={{ fontSize: '1.2rem', color: '#adb5bd' }} />
      <i className="fa fa-lock" style={{ fontSize: '1.2rem', color: '#adb5bd' }} />
    </div>
  </div>
);


// --- Component หลัก ---
const BottomControls = () => {
  return (
    <Row className="align-items-center justify-content-center w-100" style={{ gap: '40px' }}>
      <Col xs="auto">
        {/* 5. ส่งค่าเริ่มต้นและประเภทการควบคุมเข้าไป */}
        <ControlDial 
          initialPercentage={45} 
          controlType="volume"
          topIcon="fa-caret-up"
          bottomIcon="fa-caret-down"
          leftIcon="fa-volume-down"
          rightIcon="fa-volume-up"
        />
      </Col>
      
      <Col xs="auto">
        <StatusCard />
      </Col>

      <Col xs="auto">
        {/* 5. ส่งค่าเริ่มต้นและประเภทการควบคุมเข้าไป */}
        <ControlDial 
          initialPercentage={18} 
          controlType="brightness"
          topIcon="fa-sun-o"
          bottomIcon="fa-moon-o"
          leftIcon="fa-caret-left"
          rightIcon="fa-caret-right"
        />
      </Col>
    </Row>
  );
};

export default BottomControls;