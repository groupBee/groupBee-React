import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';

const CommuteList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const getList = () => {
        axios.get("/api/attendance/list")
            .then(res => {
                setList(res.data);
                setLoading(false); // 데이터가 불러와지면 로딩 상태 해제
            })
            .catch(err => {
                console.error(err);
                setLoading(false); // 에러가 발생해도 로딩 상태 해제
            });
    };

    useEffect(() => {
        getList();
    }, []);

    // 시간 변환 함수
    function convertTimeToPlusNine(timeString) {
        let [hours, minutes, seconds] = timeString.split(":").map(Number);
        let date = new Date();
        date.setHours(hours, minutes, seconds);
        date.setHours(date.getHours() + 9);
        let newHours = date.getHours().toString().padStart(2, '0');
        let newMinutes = date.getMinutes().toString().padStart(2, '0');
        let newSeconds = date.getSeconds().toString().padStart(2, '0');
        return `${newHours}:${newMinutes}:${newSeconds}`;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            {loading ? (
                <CircularProgress style={{ color: '#F6993F' }} />
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F6993F', color: '#fff', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid gray' }}>날짜</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid gray' }}>출근</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid gray' }}>퇴근</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid gray' }}>시간</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid gray' }}>기준시간 비</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                                <td style={{ padding: '10px' }}>{item.checkIn.substring(0, 10)}</td>
                                <td style={{ padding: '10px' }}>{convertTimeToPlusNine(item.checkIn.substring(11, 19))}</td>
                                <td style={{ padding: '10px' }}>{convertTimeToPlusNine(item.checkOut.substring(11, 19))}</td>
                                <td style={{ padding: '10px' }}>{item.workHours.toFixed(1)}</td>
                                <td style={{ padding: '10px' }}>{-(9 - (item.workHours)).toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Box>
    );
};

export default CommuteList;
