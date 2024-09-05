import React, { useState } from 'react';
import { Box } from "@mui/material";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import AttachEmailRoundedIcon from '@mui/icons-material/AttachEmailRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import AdminInfo from "./adminInfo.jsx";
import AdminBook from "./adminBook.jsx";
import AdminWrite from "./adminWrite.jsx";
import AdminBoard from "./adminBoard.jsx";
import AdminEmail from "./adminEmail.jsx";
import AdminResources from "./adminResources.jsx";
import "./tabBar.css";

const iconMap = {
    adminInfo: <AccountCircleRoundedIcon />,
    adminResources: <DirectionsCarFilledRoundedIcon />,
    adminBook: <LibraryBooksRoundedIcon />,
    adminWrite: <DescriptionRoundedIcon />,
    adminBoard: <RateReviewRoundedIcon/>,
    adminEmail: <AttachEmailRoundedIcon />,
};

const AdminRoute = () => {
    const [activeTab, setActiveTab] = useState('adminInfo');

    const handleNavClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <Box>
                <nav className="nav">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
                        {['adminInfo', 'adminResources', 'adminBook', 'adminWrite', 'adminBoard', 'adminEmail'].map((tab) => (
                            <li
                                key={tab}
                                className="nav__item"
                                onClick={() => handleNavClick(tab)}
                            >
                                <NavLink
                                    to={tab}
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                >
                                    {iconMap[tab]} {/* 아이콘 추가 */}
                                    <span style={{ marginLeft: '8px' }}>
                                        {tab.replace('admin', '').replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </NavLink>
                                {activeTab === tab && (
                                    <div className="nav__active-indicator"></div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </Box>

            <Routes>
                <Route path="/" element={<Navigate to="adminInfo"/>}/>
                <Route path="adminInfo" element={<AdminInfo/>}/>
                <Route path="adminResources" element={<AdminResources/>}/>
                <Route path="adminBook" element={<AdminBook/>}/>
                <Route path="adminWrite" element={<AdminWrite/>}/>
                <Route path="adminBoard" element={<AdminBoard/>}/>
                <Route path="adminEmail" element={<AdminEmail/>}/>
            </Routes>
        </>
    );
};

export default AdminRoute;
