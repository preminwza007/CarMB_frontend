import React, { useState, useEffect } from "react"; // <-- 1. เพิ่ม useEffect
import { Card, CardHeader, Container, Row, Col } from "reactstrap";

// --- Components ---
import MapComponent from "components/MapComponent";
import { LockCard, BluetoothCard, MusicCard, PhoneCard, ClimateCard as ClimateIconCard, MapCard, AirCard, LightCard, SelfDriveCard, VRCard, ChairCard, NightModeCard } from "components/IconCards.js";
import HighBeamCard from "components/HighBeamCard.js";
import EmergencyCard from "components/EmergencyCard.js";
import ClimateCard from "components/ClimateCard.js";
import Speedometer from "components/Headers/Speedometer.js";
import BottomControls from "components/BottomControls.js";
import CameraStream from "components/CameraStream.js";

const Map = (props) => {
  const [switchStates, setSwitchStates] = useState(Array.from({ length: 12 }, () => false));
  const [speed, setSpeed] = useState(0); // <-- 2. เพิ่ม State สำหรับเก็บค่า speed (เริ่มต้นที่ 0)
  const switchSlots = Array.from({ length: 12 }, (_, i) => i);

  const handleToggle = (index) => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);
  };

  // <-- 3. เพิ่ม useEffect ทั้งหมดนี้เพื่อเชื่อมต่อ WebSocket -->
  useEffect(() => {
    // ❗️ **สำคัญ:** แก้ URL นี้ให้ตรงกับที่อยู่ FastAPI server ของคุณ
    const ws = new WebSocket("ws://89.213.177.84:2222/ws/browser");

    ws.onopen = () => {
      console.log("✅ WebSocket connected to server.");
    };

    ws.onmessage = (event) => {
      try {
        // เราสมมติว่าข้อมูลที่ Pi ส่งมาเป็น JSON string
        // เช่น: {"speed": 75, "battery": 90}
        const data = JSON.parse(event.data);

        // ตรวจสอบว่ามี key 'speed' อยู่ในข้อมูลหรือไม่
        if (data.speed !== undefined) {
          setSpeed(data.speed); // อัปเดต state ของ speed
        }

      } catch (error) {
        // ไว้สำหรับ debug กรณี Pi ส่งข้อมูลมาผิดรูปแบบ
        console.error("Error parsing WebSocket data:", error, event.data);
      }
    };

    ws.onclose = () => {
      console.log("🛑 WebSocket disconnected.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Cleanup: ปิดการเชื่อมต่อ WebSocket เมื่อ component ถูก unmount
    return () => {
      ws.close();
    };
  }, []); // [] หมายถึงให้ effect นี้ทำงานแค่ครั้งเดียวตอน component mount
  // ----------------------------------------------------

  return (
    <>
      <Container
        fluid
        style={{
          position: "absolute", top: "70px", left: "20px",
          width: "calc(100% - 40px)", height: "calc(100vh - 40px)",
          display: "flex", flexDirection: "column",
        }}
      >
        <Row style={{ flexGrow: 1, width: "100%", margin: "0" }}>

          {/* ========== Col 1: ซ้าย (ไม่เปลี่ยนแปลง) ========== */}
          <Col xl="3" style={{ padding: "0 10px", display: "flex", flexDirection: "column" }}>
            <Row className="row-grid" style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: '10px', width: "100%", margin: '0 -5px' }}>
              {switchSlots.map((index) => (
                <Col key={index} lg="4" md="4" sm="6" style={{ padding: '5px', flexBasis: 'calc(33.333% - 10px)', maxWidth: 'calc(33.333% - 10px)', marginBottom: '10px', height: 'auto' }}>
                  {index === 0 ? <LockCard /> : index === 1 ? <BluetoothCard /> : index === 2 ? <MusicCard /> : index === 3 ? <PhoneCard /> : index === 4 ? <ClimateIconCard /> : index === 5 ? <ChairCard /> : index === 6 ? <MapCard /> : index === 7 ? <AirCard /> : index === 8 ? <LightCard /> : index === 9 ? <SelfDriveCard /> : index === 10 ? <VRCard /> : index === 11 ? <NightModeCard /> : null}
                </Col>
              ))}
            </Row>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              <HighBeamCard />
              <EmergencyCard />
            </div>
          </Col>

          {/* ========== Col 2 & 3: กลางและขวา (รวมกัน) ========== */}
          <Col xl="9" style={{
            padding: "0 10px",
            display: 'flex',
            flexDirection: 'column',
            gap: '0px'
          }}>

            {/* --- แถวบน: Map และ Climate (ไม่เปลี่ยนแปลง) --- */}
            <Row>
              <Col xl="8">
                <Card style={{ height: "230px", borderRadius: "15px", overflow: "hidden", backgroundColor: "#1C2128", zIndex: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardHeader style={{ backgroundColor: "transparent", padding: "0", flex: 1 }}>
                    <MapComponent />
                  </CardHeader>
                </Card>
              </Col>
              <Col xl="4">
                <ClimateCard />
              </Col>
            </Row>

            {/* --- แถวกลาง: Camera และ Speedometer --- */}
            <Row>
              <Col xl="8" style={{ height: "240px" }}>
                <CameraStream />
              </Col>
              <Col xl="4">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100%', paddingTop: '20px' }}>

                  {/* --- นี่คือจุดที่แก้จาก 66 ครับ --- */}
                  <Speedometer value={speed} minValue={0} maxValue={200} size={280} />

                </div>
              </Col>
            </Row>

            {/* --- แถวล่างสุด: ส่วนควบคุม (ไม่เปลี่ยนแปลง) --- */}
            <Row style={{ marginTop: '20px' }}>
              <Col xl="10">
                <BottomControls />
              </Col>
              <Col xl="2">
              </Col>
            </Row>

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Map;