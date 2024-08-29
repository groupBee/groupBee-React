import React from 'react';
import {Box} from "@mui/material";
import {Header} from "../../components/index.jsx";
import {Link, Navigate, NavLink, Route, Routes} from "react-router-dom";
import AdminInfo from "./adminInfo.jsx";
import AdminBook from "./adminBook.jsx";
import AdminWrite from "./adminWrite.jsx";


const AdminRoute = () => {
    return (
        <div>
            <Box marginLeft='15px'>
                <Header title="관리자 페이지"/>
                <nav style={{marginTop: '-20px'}}>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        display: 'flex',
                        gap: '20px',
                        margin: 0
                    }}>
                        <li style={{margin: 0}}>
                            <NavLink
                                to="adminInfo"
                                style={({isActive}) => ({
                                    textDecoration: 'none',
                                    fontSize: '20px',
                                    color: isActive ? 'black' : '#a1a1a1' // 선택된 경우 색 변경
                                })}
                            >
                                직원조회
                            </NavLink>
                        </li>
                        <li style={{margin: 0}}>
                            <NavLink
                                to="adminBook"
                                style={({isActive}) => ({
                                    textDecoration: 'none',
                                    fontSize: '20px',
                                    color: isActive ? 'black' : '#a1a1a1'
                                })}
                            >
                                예약관리
                            </NavLink>
                        </li>
                        <li style={{margin: 0}}>
                            <NavLink
                                to="adminWrite"
                                style={({isActive}) => ({
                                    textDecoration: 'none',
                                    fontSize: '20px',
                                    color: isActive ? 'black' : '#a1a1a1'
                                })}
                            >
                                전자결재
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </Box>

            <Routes>
                <Route path="/" element={<Navigate to="adminInfo"/>}/>
                <Route path="adminInfo" element={<AdminInfo/>}/>
                <Route path="adminBook" element={<AdminBook/>}/>
                <Route path="adminWrite" element={<AdminWrite/>}/>
            </Routes>
        </div>
    );
};

export default AdminRoute;