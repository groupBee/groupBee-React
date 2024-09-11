import React, { useEffect, useState } from 'react';
import {
    Box, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Pagination,
    useMediaQuery
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminBoard = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // current page starts from 1
    const [itemsPerPage] = useState(9); // items per page
    const navigate = useNavigate();

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // Add sorting logic here
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/board/list');
            const data = await response.json();
            console.log(data)
            setBoardList(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '정말로 삭제하시겠습니까?',
            text: '이 작업은 취소할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/board/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    Swal.fire('삭제 완료!', '항목이 성공적으로 삭제되었습니다.', 'success');
                    fetchData();
                } else {
                    Swal.fire('삭제 실패', '항목 삭제에 실패했습니다. 나중에 다시 시도해 주세요.', 'error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('삭제 실패', '항목 삭제 중 오류가 발생했습니다.', 'error');
            }
        }
    };

    const formatDateTimeString = (dateString) => {
        return dateString.substring(0, 19).replace('T', ' ');
    };

    const moveDetail = (id) => {
        navigate(`/board/list/${id}/1`);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = boardList.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(boardList.length / itemsPerPage);

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
                overflow: "hidden",
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
                    게시판
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>번호</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>제목</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성자</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성일</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>조회</TableCell>
                            <TableCell align="center" sx={{ width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems
                            .sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate))
                            .map((list, index) => (
                                <TableRow key={index} sx={{ '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        '& *': {
                                            color: '#ffb121',
                                        },
                                    },}}>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{index + 1}</TableCell>
                                    <TableCell align="center" sx={{
                                        fontSize: '0.9rem',
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                               onClick={() => moveDetail(list.board.id)}
                                    >
                                        {list.board.title}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{list.board.writer}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                        {formatDateTimeString(list.board.createDate)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>{list.board.readCount}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                        <IconButton onClick={() => handleDelete(list.board.id)}>
                                            <DeleteIcon/>
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
                        color="primary"
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

export default AdminBoard;
