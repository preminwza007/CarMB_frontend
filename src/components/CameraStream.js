// src/components/CameraStream.js

import React, { useEffect, useState, useRef } from "react";
import { Card, CardBody } from "reactstrap";
import ArcSpinner from "./ArcSpinner"; // 1. Import คอมโพเนนต์เข้ามา

const CameraStream = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimer = useRef(null);

    const websocketUrl = "ws://89.213.177.84:8765/react_stream";

    useEffect(() => {
        const connect = () => {
            console.log("Attempting to connect...");
            const socket = new WebSocket(websocketUrl);

            socket.onopen = () => {
                console.log("📡 WebSocket connected to server");
                setIsConnected(true);
                if (reconnectTimer.current) {
                    clearTimeout(reconnectTimer.current);
                }
            };

            socket.onmessage = (event) => {
                const base64Image = event.data;
                setImageSrc(`data:image/jpeg;base64,${base64Image}`);
            };

            socket.onerror = (error) => {
                console.error("❌ WebSocket error:", error);
                socket.close();
            };

            socket.onclose = () => {
                console.log("🔌 WebSocket connection closed. Attempting to reconnect in 3 seconds...");
                setIsConnected(false);
                setImageSrc(null); // ล้างรูปภาพเมื่อการเชื่อมต่อหลุด
                reconnectTimer.current = setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
        };
    }, [websocketUrl]);

    return (
        <Card
            className="camera-stream-card"
            style={{
                width: "100%",
                height: "100%",
                zIndex: 100,
                backgroundColor: "#1c1e21",
                borderRadius: "15px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
        >
            <CardBody
                className="text-center"
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0",
                }}
            >
                {/* 2. ใช้เงื่อนไขเพื่อแสดง Spinner หรือ รูปภาพ */}
                {!isConnected ? (
                    <ArcSpinner /> // <-- แสดง Spinner เมื่อยังไม่เชื่อมต่อ
                ) : imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Live Stream"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    // ข้อความนี้จะแสดงสั้นๆ หลังจากเชื่อมต่อ แต่ยังไม่ได้รับเฟรมแรก
                    <p style={{ color: "white", fontSize: "18px" }}>✅ Connected, waiting for stream...</p>
                )}
            </CardBody>
        </Card>
    );
};

export default CameraStream;