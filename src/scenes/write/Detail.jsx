import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Detail = () => {
    const location = useLocation();
    const { memberId, itemId } = location.state || {}; // state에서 memberId와 itemId 추출

    useEffect(() => {
        if (memberId && itemId) {
            // 이곳에서 memberId와 itemId를 사용해 필요한 데이터를 불러오거나 처리
            console.log("Member ID:", memberId);
            console.log("Item ID:", itemId);
        }
    }, [memberId, itemId]);

    return (
        <div>
            <h1>Detail</h1>
            <p>Member ID: {memberId}</p>
            <p>Item ID: {itemId}</p>
        </div>
    );
};

export default Detail;
