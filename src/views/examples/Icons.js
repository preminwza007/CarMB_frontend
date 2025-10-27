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
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraStream from "../../components/CameraStream.js";

const Icons = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Logic for handling the 'Escape' key press to navigate
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        const userConfirmed = window.confirm("ต้องการออกไปหน้า Dashboard หรือไม่?");
        if (userConfirmed) {
          navigate('/admin/dashboard');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      position: 'relative'
    }}>
      <CameraStream />

      {/* Speedometer and Battery components have been removed */}

    </div>
  );
};

export default Icons;