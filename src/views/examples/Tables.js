import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraStream from "../../components/CameraStream.js";
import CircularProgress from "../../components/CircularProgress";
import Speedometer from "../../components/Headers/Speedometer.js";
import GearIndicator from "../../components/GearIndicator.js";

const Tables = () => {
  const navigate = useNavigate();

  // State สำหรับเก็บข้อมูลจากทุกแหล่ง
  const [vehicleData, setVehicleData] = useState({
    battery: 0,
    speed: 0,
    isCharging: false,
    gear: "N",
  });

  // useEffect สำหรับจัดการการเชื่อมต่อ WebSocket ทั้งหมด
  useEffect(() => {
    // --- 🔌 การเชื่อมต่อที่ 1: Battery Server (Port 1669) ---
    const wsBattery = new WebSocket("ws://89.213.177.84:1669/ws/browser");

    wsBattery.onopen = () => console.log("✅ [Tables Page] Connected to Battery Server (1669)");
    wsBattery.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setVehicleData(prevData => ({ ...prevData, ...message }));
      } catch (error) {
        console.error("[Tables Page] Error parsing data from 1669:", error);
      }
    };
    wsBattery.onclose = () => console.log("🛑 [Tables Page] Disconnected from Battery Server (1669)");
    wsBattery.onerror = (error) => console.error("[Tables Page] WebSocket Error (1669):", error);

    // --- 🔌 การเชื่อมต่อที่ 2: Speed & Gear Server (Port 2222) ---
    const wsSpeedGear = new WebSocket("ws://89.213.177.84:2222/ws/browser");

    wsSpeedGear.onopen = () => console.log("✅ [Tables Page] Connected to Speed/Gear Server (2222)");
    wsSpeedGear.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setVehicleData(prevData => ({ ...prevData, ...message }));
      } catch (error) {
        console.error("[Tables Page] Error parsing data from 2222:", error);
      }
    };
    wsSpeedGear.onclose = () => console.log("🛑 [Tables Page] Disconnected from Speed/Gear Server (2222)");
    wsSpeedGear.onerror = (error) => console.error("[Tables Page] WebSocket Error (2222):", error);


    // Cleanup: ปิดการเชื่อมต่อทั้งสองเมื่อ component ถูกปิด
    return () => {
      wsBattery.close();
      wsSpeedGear.close();
    };
  }, []);

  // Logic ปุ่ม Escape ยังคงเหมือนเดิม
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
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '-10vh'
    }}>
      {/* กรอบของกล้อง */}
      <div style={{
        width: '75vw',
        aspectRatio: '16 / 9'
      }}>
        <CameraStream />
      </div>

      {/* ส่วนแสดงผลแบตเตอรี่ (มุมล่างซ้าย) */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        zIndex: 10
      }}>
        <CircularProgress
          percentage={vehicleData.battery}
          label={`${Math.round(vehicleData.battery)}`}
          unit="Battery"
          color={vehicleData.isCharging ? "#90EE90" : "#FFFFFF"}
          iconType="battery"
          isCharging={vehicleData.isCharging}
        />
      </div>

      {/* ส่วนแสดงผล GearIndicator ที่มุมขวา (เหนือ Speedometer) */}
      <div style={{
        position: 'absolute',
        bottom: '220px',
        right: '85px',
        zIndex: 10
      }}>
          <GearIndicator currentGear={vehicleData.gear} />
      </div>

      {/*
        ย้าย Speedometer มาไว้ตรงกลางด้านล่าง
      */}
      <div style={{
        position: 'absolute',
        bottom: '-60px', // *** จุดที่แก้ไข ***
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        <Speedometer
          value={vehicleData.speed}
          size={200}
          valueFontColor="white"
          unitFontColor="white"
        />
      </div>

    </div>
  );
};

export default Tables;
