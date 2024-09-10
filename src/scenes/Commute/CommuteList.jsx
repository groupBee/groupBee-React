import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography, Pagination } from '@mui/material';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { useNavigate } from 'react-router-dom';

const CommuteList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [itemsPerPage] = useState(14); // 페이지당 항목 수
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/'); // 홈으로 이동
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const normalProcessingCount = list.filter(item => -9 + item.workHours >= 0).length;
    const unprocessedCount = list.filter(item => -9 + item.workHours < 0).length;

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
        if (!timeString) return ''; // null이나 undefined인 경우 빈 문자열 반환
        let [hours, minutes, seconds] = timeString.split(":").map(Number);
        let date = new Date();
        date.setHours(hours, minutes, seconds);
        date.setHours(date.getHours() + 9);
        let newHours = date.getHours().toString().padStart(2, '0');
        let newMinutes = date.getMinutes().toString().padStart(2, '0');
        let newSeconds = date.getSeconds().toString().padStart(2, '0');
        return `${newHours}:${newMinutes}:${newSeconds}`;
    }

    // 현재 페이지에 맞는 항목들만 추출
    const paginatedList = list.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box m="20px">
            <Box
                height="100%"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: '30px'
                }}
            >
                <Typography
                    color="black"
                    variant="h5"
                    fontWeight="600"
                    fontSize="30px"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    출퇴근목록
                </Typography>

                <Box
                    display="flex"
                    justifyContent="center" // Center horizontally
                    alignItems="center" // Center vertically (if needed)
                    width="100%" // Full width to center align the inner box
                    marginTop="30px"
                >
                    <Box
                        display="flex"
                        justifyContent="center" // Center horizontally
                        alignItems="center"
                        gap={2} // Adjust gap between boxes as needed
                        width="94%" // Adjust width as needed
                    >
                        <Box
                            flex={1}
                            textAlign="center"
                            padding="10px"
                            borderRadius="4px"
                            height="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            style={{ fontSize: '20px', fontWeight: 'bold', color: '#686868', border: '2px solid #ff8929' }}
                        >
                            <InventoryRoundedIcon
                                style={{ color: '#ff8929', fontSize: 50, marginRight: '10px', marginBottom: '7px'}}/>
                            전체
                            <Typography
                                variant="h2" // Adjust the size as needed
                                style={{ color: '#ff8929', fontWeight: 'bold', padding: '4px' }}
                            >
                                {list.length}
                            </Typography>
                            건
                        </Box>
                        <Box
                            flex={1}
                            textAlign="center"
                            padding="10px"
                            borderRadius="4px"
                            height="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            style={{ fontSize: '20px', fontWeight: 'bold', color: '#686868', border: '2px solid #17da6a'  }}
                        >
                            <CheckCircleOutlineRoundedIcon
                                style={{ color: '#17da6a', fontSize: 50, marginRight: '10px', marginBottom: '7px'}}/>
                            정상처리
                            <Typography
                                variant="h2"
                                style={{ color: '#17da6a', fontWeight: 'bold', padding: '4px' }}
                            >
                                {normalProcessingCount}
                            </Typography>
                            건
                        </Box>
                        <Box
                            flex={1}
                            textAlign="center"
                            padding="10px"
                            borderRadius="4px"
                            height="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            style={{ fontSize: '20px', fontWeight: 'bold', color: '#686868', border: '2px solid #c8c8c8'   }}
                        >
                            <HighlightOffRoundedIcon
                                style={{ color: '#c8c8c8', fontSize: 50, marginRight: '10px', marginBottom: '7px'}}/>
                            미처리
                            <Typography
                                variant="h2"
                                style={{ color: '#c8c8c8', fontWeight: 'bold', padding: '4px' }}
                            >
                                {unprocessedCount}
                            </Typography>
                            건
                        </Box>
                        <Box
                            flex={1}
                            textAlign="center"
                            padding="10px"
                            borderRadius="4px"
                            height="100px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                fontSize: '22px',
                                fontWeight: 'bold',
                                color: '#FFB300', // 기본 글씨색
                                border: '2px solid #FFB300', // 기본 테두리색
                                cursor: 'pointer',
                                backgroundColor: 'white', // 기본 배경색
                                '&:hover': {
                                    color: 'white', // 호버 시 글씨색
                                    backgroundColor: '#FFB300', // 호버 시 배경색
                                },
                            }}
                            onClick={handleClick}
                        >
                            출/퇴근 등록하기
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" style={{ padding: '40px' }}>
                    <table style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        fontFamily: 'Arial, sans-serif',
                        border: '1px solid #ddd'
                    }}>
                        <thead>
                        <tr style={{
                            color: '#333',
                            textAlign: 'center',
                            borderBottom: '2px solid #ffb121',
                        }}>
                            <th style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>일자</th>
                            <th style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>출근시각</th>
                            <th style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>퇴근시각</th>
                            <th style={{ padding: '12px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>카운트</th>
                            <th style={{ padding: '5px', fontWeight: 'bold', borderRight: '1px solid #ddd' }}>근무시간(9시간)</th>
                            <th style={{ padding: '12px', fontWeight: 'bold' }}>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedList.map((item, idx) => (
                            <tr key={idx} style={{
                                borderBottom: '1px solid #ddd',
                                textAlign: 'center'
                            }}>
                                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                                    {item.checkIn ? item.checkIn.substring(0, 10) : ''}
                                </td>
                                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                                    {item.checkIn ? convertTimeToPlusNine(item.checkIn.substring(11, 19)) : '-'}
                                </td>
                                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                                    {item.checkOut ? convertTimeToPlusNine(item.checkOut.substring(11, 19)) : '-'}
                                </td>
                                <td style={{ padding: '10px', borderRight: '1px solid #ddd' }}>
                                    {item.workHours != null ? item.workHours.toFixed(1) : ''}
                                </td>
                                <td style={{
                                    padding: '10px',
                                    borderRight: '1px solid #ddd',
                                    color: item.workHours != null && -9 + item.workHours < 0 ? '#FE2525' : '#027DF7'
                                }}>
                                    {item.workHours != null ? (-9 + item.workHours).toFixed(1) : ''}
                                </td>
                                <td style={{ padding: '8px' }}>
                                <span style={{
                                    backgroundColor: item.workHours != null && -9 + item.workHours < 0 ? '#c8c8c8' : '#17da6a',
                                    color: 'white',
                                    padding: '5px',
                                    borderRadius: '8px'
                                }}>
                                            {item.workHours != null && -9 + item.workHours < 0 ? '미처리' : '정상처리'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                <Pagination
                    count={Math.ceil(list.length / itemsPerPage)} // 총 페이지 수
                    page={page}
                    onChange={handlePageChange}
                    siblingCount={1} // 중간 페이지를 기준으로 좌우에 표시할 페이지 수 (여기서 기본적으로 좌우 각각 1개씩 표시)
                    boundaryCount={1} // 시작과 끝에 표시할 페이지 수 (1로 설정하여 양쪽 끝에 1개의 페이지만 표시)
                    showFirstButton // 처음 페이지로 이동하는 버튼을 표시
                    showLastButton // 마지막 페이지로 이동하는 버튼을 표시
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#000', // 페이지 숫자 기본 색상
                            fontSize: '14px', // 페이지 숫자 크기
                            '&:hover': {
                                backgroundColor: '#FFB300', // 호버 시 배경색
                                color: 'white', // 호버 시 글씨 색상
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#FFB300', // 선택된 페이지 배경색
                                color: 'white', // 선택된 페이지 글씨 색상
                            },
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: '#FFB300', // 생략부(...) 색상
                        },
                        '& .MuiPaginationItem-icon': {
                            color: '#000', // 첫/마지막 페이지로 가는 아이콘 색상
                        },
                    }}
                />
                </Box>
            </Box>
        </Box>
    );
};

export default CommuteList;
