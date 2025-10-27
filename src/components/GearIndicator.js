import React from 'react';

// 1. กำหนดลำดับของเกียร์ทั้งหมด
const gearSequence = ['R', 'N', '1', '2', '3'];

const GearIndicator = ({ currentGear }) => {
  // 2. หาตำแหน่ง (index) ของเกียร์ปัจจุบัน
  const currentIndex = gearSequence.indexOf(currentGear);

  // 3. หาเกียร์ก่อนหน้าและเกียร์ถัดไป
  // ถ้าหาไม่เจอ (เช่น เกียร์ R ไม่มีเกียร์ก่อนหน้า) ค่าจะเป็น null
  const prevGear = currentIndex > 0 ? gearSequence[currentIndex - 1] : null;
  const nextGear = currentIndex < gearSequence.length - 1 ? gearSequence[currentIndex + 1] : null;

  // 4. สไตล์ของตัวอักษรแต่ละตำแหน่ง
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      width: '120px', // กำหนดความกว้างเพื่อให้ดูดี
      height: '120px', // กำหนดความสูง
    },
    nextGear: {
      fontSize: '24px',
      opacity: 0.5, // ทำให้จางลง
      height: '30px', // กำหนดความสูงของพื้นที่
    },
    currentGear: {
      fontSize: '60px',
      color: '#00BFFF', // สีฟ้าสดใส
      height: '60px',
      lineHeight: '60px',
    },
    prevGear: {
      fontSize: '24px',
      opacity: 0.5, // ทำให้จางลง
      height: '30px', // กำหนดความสูงของพื้นที่
    },
  };

  return (
    <div style={styles.container}>
      {/* แสดงเกียร์ถัดไป (ถ้ามี) */}
      <div style={styles.nextGear}>
        {nextGear}
      </div>
      
      {/* แสดงเกียร์ปัจจุบัน */}
      <div style={styles.currentGear}>
        {currentGear}
      </div>

      {/* แสดงเกียร์ก่อนหน้า (ถ้ามี) */}
      <div style={styles.prevGear}>
        {prevGear}
      </div>
    </div>
  );
};

export default GearIndicator;
