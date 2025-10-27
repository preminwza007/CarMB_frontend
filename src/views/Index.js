import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";

// Components
import Header from "components/Headers/Header.js";
import CameraStream from "components/CameraStream.js";
import MapComponent from "components/MapComponent";

const Index = (props) => {
  return (
    <>
      {/* ส่วน Header (แถบข้อมูลด้านล่าง) จะยังคงอยู่เหมือนเดิม */}
      <Header />

      {/* Container หลักสำหรับเนื้อหา */}
      <Container className="mt--7" fluid>
        {/* Row สำหรับจัดวางกล้องและแผนที่ */}
        <Row
          className="mt--10"
          style={{
            position: "absolute",
            // --- การเปลี่ยนแปลงอยู่ตรงนี้ ---
            top: "70px", // ขยับขึ้นไปด้านบนสุด (เว้นระยะเล็กน้อย)
            // --------------------------------
            left: "2%",
            width: "calc(100% - 4%)", // ปรับความกว้างให้พอดี
            height: "calc(100vh - 250px)", // ปรับความสูงให้พอดีกับพื้นที่ว่าง
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Col สำหรับแสดงกล้อง */}
          <Col
            xl="9"
            style={{
              paddingRight: "10px",
              display: "flex",
              height: "100%",
            }}
          >
            <CameraStream />
          </Col>

          {/* Col สำหรับแสดงแผนที่ */}
          <Col
            xl="3"
            style={{
              display: "flex",
              height: "100%",
            }}
          >
            <Card
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <MapComponent />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;