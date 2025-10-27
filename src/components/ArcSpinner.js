// src/components/ArcSpinner.js

import React from 'react';

const ArcSpinner = () => {
    return (
        <>
            <style>
                {`
                .arc-spinner {
                    width: 60px;
                    height: 60px;
                    animation: spin 2s linear infinite;
                }
                .arc-spinner .path {
                    stroke: #0D6EFD; /* สามารถเปลี่ยนสีได้ตรงนี้ */
                    stroke-linecap: round;
                    animation: arc 1.5s ease-in-out infinite;
                }
                @keyframes spin {
                    100% {
                        transform: rotate(360deg);
                    }
                }
                @keyframes arc {
                    0% {
                        stroke-dasharray: 1, 150;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -35;
                    }
                    100% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -124;
                    }
                }
                `}
            </style>
            <svg className="arc-spinner" viewBox="0 0 50 50">
                <circle
                    className="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                ></circle>
            </svg>
        </>
    );
};

export default ArcSpinner;