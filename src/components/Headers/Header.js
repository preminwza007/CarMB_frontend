import React, { useState, useEffect } from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
// Import components
import Speedometer from "./Speedometer";
import CircularProgress from "../CircularProgress";
import GearIndicator from "../GearIndicator";

const Header = () => {
  // State สำหรับเก็บข้อมูลทั้งหมดจากทุกแหล่ง
  const [vehicleData, setVehicleData] = useState({
    battery: 0,
    speed: 0,
    degree: 0,
    performance: 100,
    isCharging: false,
    gear: "N",
  });

  useEffect(() => {
    // --- 🔌 การเชื่อมต่อที่ 1: Battery Server (Port 1669) ---
    const wsBattery = new WebSocket("ws://89.213.177.84:1669/ws/browser");

    wsBattery.onopen = () => {
      console.log("✅ Connected to Battery Server (1669)");
    };
    wsBattery.onmessage = (event) => {
      try {
        // คาดหวังข้อมูลเป็น JSON Object เช่น { "battery": 78.5, "isCharging": true }
        const message = JSON.parse(event.data);
        setVehicleData(prevData => ({ ...prevData, ...message }));
      } catch (error) {
        console.error("Error parsing data from port 1669:", error, "Raw Data:", event.data);
      }
    };
    wsBattery.onclose = () => {
      console.log("🛑 Disconnected from Battery Server (1669)");
    };
    wsBattery.onerror = (error) => {
      console.error("WebSocket Error (1669):", error);
    };

    // --- 🔌 การเชื่อมต่อที่ 2: Speed & Gear Server (Port 2222) ---
    // *** สำคัญ: ต้องปรับ Python (ROS2 Bridge) ให้ส่งเป็น JSON Object เช่น { "speed": 9.42, "gear": "D" } ***
    const wsSpeedGear = new WebSocket("ws://89.213.177.84:2222/ws/browser");

    wsSpeedGear.onopen = () => {
      console.log("✅ Connected to Speed/Gear Server (2222)");
    };
    wsSpeedGear.onmessage = (event) => {
      try {
        // คาดหวังข้อมูลเป็น JSON Object เช่น { "speed": 9.42, "gear": "D" }
        const message = JSON.parse(event.data);
        console.log("Data from 2222:", message); // เพิ่ม Log เพื่อยืนยันว่าได้รับ JSON Object
        setVehicleData(prevData => ({ ...prevData, ...message }));
      } catch (error) {
        // จะเกิด Error หากข้อมูลที่ได้รับเป็นแค่ string ธรรมดา (เช่น "9.05") 
        console.error("Error parsing data from port 2222: Data is not a JSON object.", error, "Raw Data:", event.data);
      }
    };
    wsSpeedGear.onclose = () => {
      console.log("🛑 Disconnected from Speed/Gear Server (2222)");
    };
    wsSpeedGear.onerror = (error) => {
      console.error("WebSocket Error (2222):", error);
    };

    // Cleanup: ปิดการเชื่อมต่อทั้งสองเมื่อ component ถูกปิด
    return () => {
      wsBattery.close();
      wsSpeedGear.close();
    };
  }, []);

  // ฟังก์ชันคำนวณสี
  const getPerformanceColor = () => {
    if (vehicleData.performance > 75) return "#2dce89";
    if (vehicleData.performance > 50) return "#11cdef";
    if (vehicleData.performance > 25) return "#fb6340";
    return "#f5365c";
  };

  return (
    <>
      <div className="header bg-gradient-info pt-5 pt-md-8" style={{ position: "relative", minHeight: "100vh" }}>
        <Container fluid>
          <div className="header-body">
            {/* --- การเปลี่ยนแปลงอยู่ตรงนี้ --- */}
            <div
              className="position-absolute"
              style={{
                bottom: "18px",        // << ลดค่า bottom ลงอีก (ลอง 10px)
                left: "2%",
                width: "calc(100% - 4%)",
                zIndex: 2
              }}
            >
              <Card
                className="card-stats"
                style={{
                  width: "100%",
                  height: "150px",
                  backgroundColor: '#1C1E21',
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                }}
              >
                <CardBody style={{ width: '100%', height: '100%', padding: '0 15px' }}>
                  {/* --- การเปลี่ยนแปลงอยู่ตรงนี้ --- */}
                  {/* 1. คง align-items-center ไว้ที่ Row */}
                  <Row className="justify-content-around align-items-center h-100 no-gutters">
                    {/* 2. เพิ่ม alignSelf: 'flex-start' ให้ Col ที่ต้องการขยับขึ้น */}
                    <Col md="2" className="d-flex justify-content-center" style={{ alignSelf: 'flex-start', paddingTop: '10px' }}> {/* เพิ่ม paddingTop เล็กน้อย */}
                      <CircularProgress percentage={vehicleData.battery} label={`${Math.round(vehicleData.battery)}`} unit="Battery" color={vehicleData.isCharging ? "#90EE90" : "#FFFFFF"} iconType="battery" isCharging={vehicleData.isCharging} />
                    </Col>
                    {/* 2. เพิ่ม marginTop ให้ Col ของ Speedometer */}
                    <Col md="2" className="d-flex justify-content-center align-items-center" style={{ marginTop: '15px' }}>
                      <Speedometer value={Number(vehicleData.speed) || 0} minValue={0} maxValue={200} size={200} valueFontColor="white" unitFontColor="white" />
                    </Col>
                    <Col md="2" className="d-flex justify-content-center" style={{ alignSelf: 'flex-start', paddingTop: '15px' }}>
                      <GearIndicator currentGear={vehicleData.gear} />
                    </Col>
                    <Col md="2" className="d-flex justify-content-center" style={{ alignSelf: 'flex-start', paddingTop: '10px' }}>
                      <CircularProgress percentage={vehicleData.degree} label={`${vehicleData.degree}°`} unit="Degree" color="#11cdef" iconType="degree" />
                    </Col>
                    <Col md="2" className="d-flex justify-content-center" style={{ alignSelf: 'flex-start', paddingTop: '10px' }}>
                      <CircularProgress percentage={Math.round(vehicleData.performance)} label={Math.round(vehicleData.performance)} unit="Performance" color={getPerformanceColor()} iconType="performance" />
                    </Col>
                  </Row>
                  {/* ----------------------------- */}
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;