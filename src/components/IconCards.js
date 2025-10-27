import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faLockOpen, 
  faHeadphones, 
  faPhone, 
  faCloud, 
  faMap, 
  faSnowflake,
  faLightbulb as fasLightbulb,
  faCar,
  faVrCardboard,
  faChair,
  faMoon // <-- เพิ่มไอคอน Moon สำหรับ Night Mode
} from '@fortawesome/free-solid-svg-icons';
import { faBluetooth } from '@fortawesome/free-brands-svg-icons';
import { 
  faLightbulb as farLightbulb
} from '@fortawesome/free-regular-svg-icons';
import { MdChair } from "react-icons/md"; 

// Component สำหรับ Lock/Unlock
const LockCard = () => {
  const [isLocked, setIsLocked] = useState(false);

  const handleToggle = () => {
    setIsLocked(!isLocked);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px", 
    borderRadius: "15px",
    backgroundColor: isLocked ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isLocked ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isLocked ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {isLocked ? (
          <FontAwesomeIcon icon={faLockOpen} style={iconStyle} />
        ) : (
          <FontAwesomeIcon icon={faLock} style={iconStyle} />
        )}
        <p style={textStyle}>
          {isLocked ? "Unlock" : "Lock"}
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Bluetooth
const BluetoothCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faBluetooth} style={iconStyle} />
        <p style={textStyle}>
          Bluetooth
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Music
const MusicCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faHeadphones} style={iconStyle} />
        <p style={textStyle}>
          Music
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Phone
const PhoneCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faPhone} style={iconStyle} />
        <p style={textStyle}>
          Phone
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Climate
const ClimateCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faCloud} style={iconStyle} />
        <p style={textStyle}>
          Climate
        </p>
      </CardBody>
    </Card>
  );
};


// Component สำหรับ Map
const MapCard = () => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
      setIsToggled(!isToggled);
    };

    const cardStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
      padding: "10px",
      borderRadius: "15px",
      backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
      aspectRatio: '1/1',
      transition: "background-color 0.3s ease",
      width: "100%",
      height: "100%",
    };

    const iconStyle = {
      color: isToggled ? "#fff" : "#808080",
      fontSize: "2rem",
      marginBottom: "5px",
    };

    const textStyle = {
      color: isToggled ? "#fff" : "#808080",
      fontSize: "0.8rem",
      fontWeight: "bold",
      margin: 0,
      whiteSpace: "nowrap",
    };

    return (
      <Card style={cardStyle} onClick={handleToggle}>
        <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <FontAwesomeIcon icon={faMap} style={iconStyle} />
          <p style={textStyle}>
            Maps
          </p>
        </CardBody>
      </Card>
    );
};

// Component สำหรับ Air
const AirCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faSnowflake} style={iconStyle} />
        <p style={textStyle}>
          Air
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Light
const LightCard = () => {
    const [isToggled, setIsToggled] = useState(false);
  
    const handleToggle = () => {
      setIsToggled(!isToggled);
    };
  
    const cardStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "default",
      padding: "10px",
      borderRadius: "15px",
      backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
      aspectRatio: '1/1',
      transition: "background-color 0.3s ease",
      width: "100%",
      height: "100%",
    };
  
    const iconStyle = {
      color: isToggled ? "#fff" : "#808080",
      fontSize: "2rem",
      marginBottom: "5px",
    };
  
    const textStyle = {
      color: isToggled ? "#fff" : "#808080",
      fontSize: "0.8rem",
      fontWeight: "bold",
      margin: 0,
      whiteSpace: "nowrap",
    };
  
    return (
      <Card style={cardStyle} onClick={handleToggle}>
        <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isToggled ? (
            <FontAwesomeIcon icon={fasLightbulb} style={iconStyle} />
          ) : (
            <FontAwesomeIcon icon={farLightbulb} style={iconStyle} />
          )}
          <p style={textStyle}>
            Light
          </p>
        </CardBody>
      </Card>
    );
};

// Component สำหรับ Self Drive
const SelfDriveCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faCar} style={iconStyle} />
        <p style={textStyle}>
          Self Drive
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ VR
const VRCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faVrCardboard} style={iconStyle} />
        <p style={textStyle}>
          VR Mode
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Chair
const ChairCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <MdChair style={iconStyle} />
        <p style={textStyle}>
          Chair
        </p>
      </CardBody>
    </Card>
  );
};

// Component สำหรับ Night Mode
const NightModeCard = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "default",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: isToggled ? "#4b77a0" : "#1C1E21",
    aspectRatio: '1/1',
    transition: "background-color 0.3s ease",
    width: "100%",
    height: "100%",
  };

  const iconStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "2rem",
    marginBottom: "5px",
  };

  const textStyle = {
    color: isToggled ? "#fff" : "#808080",
    fontSize: "0.8rem",
    fontWeight: "bold",
    margin: 0,
    whiteSpace: "nowrap",
  };

  return (
    <Card style={cardStyle} onClick={handleToggle}>
      <CardBody className="p-0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faMoon} style={iconStyle} />
        <p style={textStyle}>
          Night Mode
        </p>
      </CardBody>
    </Card>
  );
};
  
export { LockCard, BluetoothCard, MusicCard, PhoneCard, ClimateCard, MapCard, AirCard, LightCard, SelfDriveCard, VRCard, ChairCard, NightModeCard };