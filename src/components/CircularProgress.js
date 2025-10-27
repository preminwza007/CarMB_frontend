import React from 'react';
import './CircularProgress.css';



import { FaCar } from "react-icons/fa";
import { PiSteeringWheel } from "react-icons/pi"; // 1. นำเข้า PiSteeringWheel
import {

    MdBatteryFull,
    MdBattery60,
    MdBattery30,
    MdBatteryAlert,
    MdBatteryChargingFull,
    MdBatteryCharging60,
    MdBatteryCharging30,
    MdBatteryCharging20

} from "react-icons/md";

const CircularProgress = ({ percentage, label, unit, color, iconType, isCharging = false }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;


    const getBatteryIconComponent = () => {
        if (isCharging) {
            if (percentage > 85) return <MdBatteryChargingFull color={color} size={24} />;
            if (percentage > 50) return <MdBatteryCharging60 color={color} size={24} />;
            if (percentage > 25) return <MdBatteryCharging30 color={color} size={24} />;
            return <MdBatteryCharging20 color={color} size={24} />;
        } else {
            if (percentage > 85) return <MdBatteryFull color={color} size={24} />;
            if (percentage > 50) return <MdBattery60 color={color} size={24} />;
            if (percentage > 20) return <MdBattery30 color={color} size={24} />;
            return <MdBatteryAlert color={color} size={24} />;
        }
    };


    // 2. คำนวณองศาการหมุนสำหรับไอคอนพวงมาลัย
    const rotationDegree = iconType === 'degree' ? percentage : 0;


    return (
        <div className="circular-progress-container">
            <svg className="circular-progress-svg" width="120" height="120" viewBox="0 0 120 120">
                <circle
                    className="circular-progress-background"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeWidth="5"
                />
                <circle
                    className="circular-progress-bar"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke={color}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                />


                {iconType === 'battery' && (
                    <g transform="translate(48, 15)">
                        {getBatteryIconComponent()}
                    </g>
                )}


                {/* 3. เปลี่ยนเป็น PiSteeringWheel และเพิ่ม style สำหรับการหมุน */}
                {iconType === 'degree' && (
                    <g transform={`translate(48, 15) rotate(${rotationDegree} 12 12)`}>
                        <PiSteeringWheel color={color} size={24} />
                    </g>
                )}


                {iconType === 'performance' && (
                    <g transform="translate(48, 15)">
                        <FaCar color={color} size={24} />
                    </g>
                )}
            </svg>
            <div className="circular-progress-content">
                <span className="circular-progress-percentage" style={{ color: color }}>
                    {label}{iconType === 'performance' ? '%' : ''}
                </span>
                <span className="circular-progress-label">{unit}</span>
            </div>
        </div>
    );
};


export default CircularProgress;