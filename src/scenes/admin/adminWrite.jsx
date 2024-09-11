import React, { useEffect, useState } from 'react';
import {
    Box, Button,
    FormControlLabel,
    IconButton,
    InputBase,
    MenuItem,
    Modal, Paper, Radio,
    RadioGroup,
    Select, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, useMediaQuery, Pagination
} from "@mui/material";
import { MenuOutlined, SearchOutlined } from "@mui/icons-material";
import { Table } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminWrite = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [apiData, setApiData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 페이지네이션은 1부터 시작
    const [itemsPerPage] = useState(8); // 페이지당 항목 수
    const [memberId, setMemberId] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/elecapp/list');
            const data = await response.json();  // 데이터를 JSON으로 변환
            console.log(data);
            setApiData(data);
            const res = await axios.get("/api/elecapp/getinfo");
            const fetchedMemberId = res.data.name;
            setMemberId(fetchedMemberId);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const moveDetail = (itemId) => {
        navigate("/detail", {
            state: {
                memberId: memberId,
                itemId: itemId
            }
        });
    };

    useEffect(() => {
        console.log('Detail page received memberId:', memberId); // 추가된 로그
    }, [memberId]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const handleDelete = async (id) => {
        try {
            // GET 요청을 보내고, 쿼리 파라미터로 id를 전달합니다.
            const response = await fetch(`/api/admin/elecapp/delete?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 응답이 정상적으로 오면 API에서 항목을 삭제하고 상태를 업데이트합니다.
            if (response.ok) {
                // 삭제 성공 시 데이터 갱신
                setApiData(prevData => prevData.filter(item => item.id !== id));
                console.log(`Successfully deleted item with id: ${id}`);
            } else {
                console.error('Failed to delete item:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredData = apiData.filter(item => item.approveStatus === 0);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate();
        const hours = date.getHours();

        return `${year}년 ${month}월 ${day}일 ${hours}시`;
    };

    // 페이지네이션 관련 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box
            gridRow="span 3"
            sx={{
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden", // 박스 넘침 방지
                maxWidth: '1400px',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto'
            }}
        >
            <Box borderBottom={`2px solid #ffb121`} p="16px">
                <Typography
                    variant="h4"
                    fontWeight="700"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    전자결재

                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold', height:'52px'}}>번호</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>종류</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>제목</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성자</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>부서</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성일</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>상태</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((elec, index) => (
                            <TableRow key={index} sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5', // 호버 시 배경 색상
                                    '& *': {
                                        color: '#ffb121', // 호버 시 모든 자식 요소의 텍스트 색상
                                    },
                                },
                            }}>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", fontSize: '0.9rem', height:'74px'}}>{index + 1}</TableCell>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", cursor: 'pointer', fontSize: '0.9rem' }}
                                           onClick={() => moveDetail(elec.id)}>{elec.appDocType === 0 ? '품 의 서' : elec.appDocType === 1 ? '휴 가 신 청 서' : '지 출 보 고 서'}</TableCell>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", cursor: 'pointer', fontSize: '0.9rem' }}
                                           onClick={() => moveDetail(elec.id)}>{elec.additionalFields.title === '' ? '제목없음' : elec.additionalFields.title}</TableCell>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", fontSize: '0.9rem' }}>{elec.writer}</TableCell>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", fontSize: '0.9rem' }}>{elec.department}</TableCell>
                                <TableCell style={{ textAlign: "center", paddingTop: "15px", fontSize: '0.9rem' }}>{formatDate(elec.writeday)}</TableCell>
                                <TableCell style={{
                                    textAlign: "center",
                                    paddingTop: "15px",
                                }}>
                                    <span style={{
                                        color: elec.approveType === 0 ? '#ff501c' : elec.approveType === 1 ? '#ff8800' : elec.approveType === 2 ? '#ff8800' : '#75d5b3',
                                        backgroundColor: elec.approveType === 0 ? '#ffece6' : elec.approveType === 1 ? '#ffefdf' : elec.approveType === 2 ? '#ffefdf' : '#e7f9f1',
                                        padding: '3px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        {elec.approveType === 0 ? '반려' : elec.approveType === 1 ? '결재중' : elec.approveType === 2 ? '결재중' : '결재완료'}
                                    </span>
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <IconButton onClick={() => handleDelete(elec.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        siblingCount={2}
                        boundaryCount={1}
                        showFirstButton // 처음 페이지로 이동하는 버튼을 표시
                        showLastButton // 마지막 페이지로 이동하는 버튼을 표시
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#000', // 페이지 숫자 기본 색상
                                fontSize: '14px', // 페이지 숫자 크기
                                '&:hover': {
                                    backgroundColor: '#ffb121', // 호버 시 배경색
                                    color: 'white', // 호버 시 글씨 색상
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#ffb121', // 선택된 페이지 배경색
                                    color: 'white', // 선택된 페이지 글씨 색상
                                },
                            },
                            '& .MuiPaginationItem-ellipsis': {
                                color: '#ffb121', // 생략부(...) 색상
                            },
                            '& .MuiPaginationItem-icon': {
                                color: '#000', // 첫/마지막 페이지로 가는 아이콘 색상
                            },
                        }}
                    />
                </Box>
            </TableContainer>
        </Box>
    );
};

export default AdminWrite;
