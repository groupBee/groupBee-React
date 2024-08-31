import React, { useState } from 'react';
import { Box } from "@mui/material";
import { Header } from "../../components/index.jsx";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import AdminInfo from "./adminInfo.jsx";
import AdminBook from "./adminBook.jsx";
import AdminWrite from "./adminWrite.jsx";
import AdminBoard from "./adminBoard.jsx";
import AdminEmail from "./adminEmail.jsx";
import AdminResources from "./adminResources.jsx";
import "./tabBar.css"; // Import your CSS file

const AdminRoute = () => {
    const [activeTab, setActiveTab] = useState('adminInfo');

    const handleNavClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <Box marginLeft='15px'>
                <Header title="관리자 페이지"/>
                <nav style={{marginTop: '-20px', marginLeft: '15px'}}>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        gap: '20px',
                        margin: 0,
                        position: 'relative',
                    }}>
                        {['adminInfo', 'adminResources', 'adminBook', 'adminWrite', 'adminBoard', 'adminEmail'].map((tab) => (
                            <li
                                key={tab}
                                style={{margin: 0, position: 'relative'}}
                                onClick={() => handleNavClick(tab)}
                            >
                                <NavLink
                                    to={tab}
                                    style={({isActive}) => ({
                                        textDecoration: 'none',
                                        fontSize: '20px',
                                        color: isActive ? 'black' : '#a1a1a1', // 선택된 경우 색 변경
                                    })}
                                >
                                    {tab.replace('admin', '').replace(/([A-Z])/g, ' $1').trim()} {/* Tab name formatting */}
                                </NavLink>
                                {activeTab === tab && (
                                    <div className="active-indicator"></div>
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
        </div>
    );
};

export default AdminRoute;
