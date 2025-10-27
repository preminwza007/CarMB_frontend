import React from 'react';

// 1. เพิ่ม valueFontColor และ unitFontColor เข้าไปใน props
const Speedometer = ({ 
    value, 
    minValue, 
    maxValue, 
    size = 300, 
    centerCircleStrokeWidth = 1, 
    valueFontSize = "25", 
    unitFontSize = "13", 
    valueFontColor = "gray", // สีตัวเลขความเร็วเริ่มต้น
    unitFontColor = "gray"  // สี km/h เริ่มต้น
}) => {
    // ... โค้ดส่วนคำนวณเหมือนเดิมทั้งหมด ... 
    
    const angleRange = 190;
    const startAngle = 175;
    const endAngle = startAngle + angleRange;
    const valueRatio = (value - minValue) / (maxValue - minValue);

    const arcStrokeColor = 'transparent';
    const progressStrokeColor = 'transparent';
    const blueLineColor = '#00BFFF';
    const tickColor = '#FFFFFF';
    const defaultLabelColor = 'gray';
    const strokeWidth = 2;

    const radius = (size / 2) - (strokeWidth / 2);
    const cx = size / 2;
    const cy = size / 2;
    const arcTranslateY = -18;

    const numTicks = 50;
    const angleStep = angleRange / numTicks;

    const ticks = Array.from({ length: numTicks + 1 }).map((_, index) => {
        const angle = (index * angleStep) + startAngle;
        const radians = angle * Math.PI / 180;
        const tickValue = (index / numTicks) * (maxValue - minValue);
        const isPassed = value >= tickValue;
        const currentTickColor = isPassed ? blueLineColor : tickColor;

        const labelsDataValues = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
        // ตรวจสอบว่าเป็นขีดหลัก และต้องเป็นทุกๆ 5 ขีดย่อย (เพื่อความหนาแน่นที่เหมาะสม)
        const isMajorTick = labelsDataValues.includes(Math.round(tickValue / 10) * 10) && (index % 5 === 0);
        
        const tickLength = isMajorTick ? 10 : 5;
        const currentStrokeWidth = isMajorTick ? "2" : "1";

        const x1 = cx + (radius - 5) * Math.cos(radians);
        const y1 = cy + (radius - 5) * Math.sin(radians);
        const x2 = cx + (radius - 5 - tickLength) * Math.cos(radians);
        const y2 = cy + (radius - 5 - tickLength) * Math.sin(radians);

        return (
            <line 
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={currentTickColor}
                strokeWidth={currentStrokeWidth}
                strokeLinecap="round"
            />
        );
    });

    const labelsData = [
        { index: 0, label: 0, offsetX: -3, offsetY: 0 },
        { index: 5, label: 20, offsetX: 3, offsetY: 1 },
        { index: 10, label: 40, offsetX: 4, offsetY: -2 },
        { index: 15, label: 60, offsetX: 4, offsetY: -2 },
        { index: 20, label: 80, offsetX: 0, offsetY: -2 },
        { index: 25, label: 100, offsetX: 0, offsetY: -2 },
        { index: 30, label: 120, offsetX: 4, offsetY: -2 },
        { index: 35, label: 140, offsetX: -6, offsetY: -1 },
        { index: 40, label: 160, offsetX: -9, offsetY: 1 },
        { index: 45, label: 180, offsetX: -9, offsetY: 1 },
        { index: 50, label: 200, offsetX: -9, offsetY: 1 },
    ];

    const textOffset = 15;
    const majorTickMultiplier = 2; // เนื่องจากขีดหลักยาว 10 (เป็น 2 เท่าของขีดรอง 5)
    const tickLength = 5; 

    const tickLabels = labelsData.map(({ index, label, offsetX = 0, offsetY = 0 }) => {
        const angle = (index * angleStep) + startAngle;
        const radians = angle * Math.PI / 180;

        // รัศมีสำหรับตำแหน่งข้อความ: หักความยาวขีดหลัก (10) และระยะห่างเพิ่มเติม (textOffset)
        const textRadius = radius - 5 - (tickLength * majorTickMultiplier) - textOffset;
        
        const textX = cx + textRadius * Math.cos(radians) + offsetX;
        const textY = cy + textRadius * Math.sin(radians) + offsetY;

        const isPassed = value >= label;
        const currentLabelColor = isPassed ? blueLineColor : defaultLabelColor;

        let textAnchor = "middle";
        if (angle < 250) {
            textAnchor = "end"; // ตำแหน่งด้านซ้าย ลากข้อความให้ชิดขวา
        } else if (angle > 290) {
            textAnchor = "start"; // ตำแหน่งด้านขวา ลากข้อความให้ชิดซ้าย
        }

        return (
            <text
                key={`label-${index}`}
                x={textX}
                y={textY}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fill={currentLabelColor}
            >
                {label}
            </text>
        );
    });

    const blueCircleRadius = radius - 65;
    const blueCircleCy = cy - 20;

    return (
        <div style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                {/* Arc: Background */}
                <path
                    d={`M ${cx + radius * Math.cos(startAngle * Math.PI / 180)} ${cy + radius * Math.sin(startAngle * Math.PI / 180)}
                       A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos(endAngle * Math.PI / 180)} ${cy + radius * Math.sin(endAngle * Math.PI / 180)}`}
                    fill="none"
                    stroke={arcStrokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    transform={`translate(0, ${arcTranslateY})`}
                />
                
                {/* Arc: Progress (ไม่แสดง แต่ใช้ในการคำนวณ) */}
                <path
                    d={`M ${cx + radius * Math.cos(startAngle * Math.PI / 180)} ${cy + radius * Math.sin(startAngle * Math.PI / 180)}
                       A ${radius} ${radius} 0 0 1 ${cx + radius * Math.cos((startAngle + (valueRatio * angleRange)) * Math.PI / 180)} ${cy + radius * Math.sin((startAngle + (valueRatio * angleRange)) * Math.PI / 180)}`}
                    fill="none"
                    stroke={progressStrokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Center Circle */}
                <circle 
                    cx={cx} 
                    cy={blueCircleCy} 
                    r={blueCircleRadius} 
                    fill="none" 
                    stroke={blueLineColor} 
                    strokeWidth={centerCircleStrokeWidth} 
                />

                {/* Ticks and Labels */}
                {ticks}
                {tickLabels}

                {/* 2. ใช้ prop 'unitFontColor' สำหรับหน่วย 'km/h' */}
                <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    fontSize={unitFontSize}
                    fill={unitFontColor}
                >
                    km/h
                </text>

                {/* 3. ใช้ prop 'valueFontColor' สำหรับตัวเลขความเร็ว */}
                <text
                    x={cx}
                    y={cy - 20}
                    textAnchor="middle"
                    fontSize={valueFontSize}
                    fill={valueFontColor}
                >
                    {value}
                </text>
            </svg>
        </div>
    );
};

export default Speedometer;