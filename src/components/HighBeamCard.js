import React, { useState } from 'react'; // <-- เพิ่ม useState
import { Card, CardBody } from 'reactstrap';

const HighBeamCard = () => {
  // 1. เพิ่ม state เพื่อเก็บค่าของ slider
  const [highBeamValue, setHighBeamValue] = useState(70); // กำหนดค่าเริ่มต้น

  // 2. ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ slider
  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setHighBeamValue(newValue);
    // อัปเดต background-size ของ slider เพื่อให้แถบสีวิ่งตาม
    const percentage = ((newValue - 0) / (100 - 0)) * 100; // สมมติ min=0, max=100
    event.target.style.backgroundSize = `${percentage}% 100%`;
  };

  // CSS สำหรับปรับแต่ง slider โดยเฉพาะ
  const sliderStyles = `
    .high-beam-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: #4a4d52; /* สีพื้นหลังของแถบ slider */
      border-radius: 5px;
      outline: none;
      /* เพิ่ม background-image เพื่อให้มีแถบสีฟ้าวิ่งตามค่า */
      background-image: linear-gradient(to right, #5E72E4, #5E72E4);
      background-size: ${((highBeamValue - 0) / (100 - 0)) * 100}% 100%; /* ตั้งค่าเริ่มต้นจาก state */
      background-repeat: no-repeat;
    }

    .high-beam-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px; /* ขนาดของจุดเลื่อน */
      height: 25px;
      background: #fff; /* สีของจุดเลื่อน */
      border-radius: 50%;
      cursor: pointer;
      border: 4px solid #5E72E4; /* สีขอบของจุดเลื่อน */
      margin-top: -1px; /* ปรับตำแหน่งเล็กน้อยเพื่อให้ตรงกลาง */
    }

    .high-beam-slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      background: #fff;
      border-radius: 50%;
      cursor: pointer;
      border: 4px solid #5E72E4;
    }
  `;

  return (
    <>
      {/* ใส่ style tag เข้าไปใน component */}
      <style>{sliderStyles}</style>
      <Card
        className="card-stats"
        style={{
          backgroundColor: '#1C1E21',
          borderRadius: '25px',
          border: 'none',
        }}
      >
        <CardBody style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Title */}
            <h5 className="mb-2" style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>
              High beam
            </h5>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
            {/* Left Icon (เหมือนรูปตัวอย่าง) */}
            <div style={{fontSize: '1.5rem', color: '#adb5bd'}}>
              <i className="fa fa-lightbulb" />
            </div>
            
            {/* Slider */}
            <input
              type="range"
              min="0" // ค่าต่ำสุด
              max="100" // ค่าสูงสุด
              value={highBeamValue} // เชื่อมกับ state
              className="high-beam-slider"
              onChange={handleSliderChange} // เชื่อมกับ event handler
            />

            {/* Right Icon (เหมือนรูปตัวอย่าง) */}
            <div style={{fontSize: '1.5rem', color: '#5E72E4'}}>
              <i className="fa fa-lightbulb" />
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default HighBeamCard;