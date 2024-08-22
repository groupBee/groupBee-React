// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from './store';

const ProtectedRoute = ({ element }) => {
    const { isLogined } = useStore(state => state);

    // 인증된 상태면 페이지를 렌더링하고, 아니면 로그인 페이지로 리디렉션
    return isLogined ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
