/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '../../components/CircularProgress';

const Profile = () => {
  const navigate = useNavigate();

  // Logic ส่วนอื่นๆ ยังคงเหมือนเดิมทั้งหมด
  const [vehicleData, setVehicleData] = useState({
    battery: 0,
    isCharging: false,
  });

  useEffect(() => {
    const ws = new WebSocket("ws://89.213.177.84:1669/ws/browser");
    ws.onopen = () => console.log("✅ Connected to data server.");
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setVehicleData(prevData => ({ ...prevData, ...message }));
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    };
    ws.onclose = () => console.log("🛑 Disconnected from data server.");
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    return () => ws.close();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        const userConfirmed = window.confirm("ต้องการออกไปหน้า Dashboard หรือไม่?");
        if (userConfirmed) {
          navigate('/admin/dashboard');
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* *** จุดที่แก้ไข: เพิ่ม div ครอบและใช้ transform: scale() *** */}
      {/* คุณสามารถปรับแก้ตัวเลข 2.5 เพื่อเพิ่ม/ลดขนาดได้ตามต้องการ */}
      <div style={{ transform: 'scale(5)' }}>
        <CircularProgress
          percentage={vehicleData.battery}
          label={`${Math.round(vehicleData.battery)}`}
          unit="Battery"
          color={vehicleData.isCharging ? "#90EE90" : "#FFFFFF"}
          iconType="battery"
          isCharging={vehicleData.isCharging}
        />
      </div>
    </div>
  );
};

export default Profile;