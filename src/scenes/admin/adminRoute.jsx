import React from 'react';
import {Box} from "@mui/material";
import {Header} from "../../components/index.jsx";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import AdminInfo from "./adminInfo.jsx";
import AdminBook from "./adminBook.jsx";


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
                            <Link to="adminInfo" style={{
                                textDecoration: 'none',
                                fontSize: '20px',
                                color: '#000'
                            }}>
                                직원 조회
                            </Link>
                        </li>
                        <li style={{margin: 0}}>
                            <Link to="adminBook" style={{
                                textDecoration: 'none',
                                fontSize: '20px',
                                color: '#000'
                            }}>
                                예약 관리
                            </Link>
                        </li>
                    </ul>
                </nav>
            </Box>

            <Routes>
                <Route path="/" element={<Navigate to="adminInfo"/>}/>
                <Route path="adminInfo" element={<AdminInfo/>}/>
                <Route path="adminBook" element={<AdminBook/>}/>
            </Routes>
        </div>
    );
};

export default AdminRoute;