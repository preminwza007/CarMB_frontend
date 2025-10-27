import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      }
      return null;
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  // *** จุดที่แก้ไข: เปลี่ยน "/admin/profile" เป็น "/admin/user-profile" ***
  const isFullScreenPage =
    location.pathname === "/admin/tables" ||
    location.pathname === "/admin/icons" ||
    location.pathname === "/admin/user-profile";

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {!isFullScreenPage && (
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("../assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
      )}

      <div className="main-content" ref={mainContent} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>

        {!isFullScreenPage && (
          <AdminNavbar
            {...props}
            brandText={getBrandText(props?.location?.pathname)}
          />
        )}

        <div style={{ flex: 1 }}>
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default Admin;