import React, {useEffect, useState} from 'react';
import {
    Box, Button,
    IconButton,
    InputBase,
    MenuItem, Paper,
    Select, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow, Typography,
    useMediaQuery
} from "@mui/material";
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";
import {Table} from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete.js";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

const AdminBoard = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [boardList, setBoardList] = useState([]);
    const navigate = useNavigate();

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const fetchData = async () => {
        try {
            const Response = await fetch('/api/board/list');
            const data = await Response.json();
            console.log(data)
            setBoardList(data);

        } catch (error) {

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        // 사용자에게 삭제 확인을 요청합니다.
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
                // DELETE 요청을 서버로 보냅니다.
                const response = await fetch(`/api/board/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    // 삭제 성공 시 알림을 표시하고 상태를 업데이트합니다.
                    Swal.fire('삭제 완료!', '항목이 성공적으로 삭제되었습니다.', 'success');
                    // 삭제 후 상태 업데이트
                    fetchData();
                    setBoardList(boardList.filter(item => item.id !== id));
                } else {
                    // 실패 시 오류 메시지 표시
                    Swal.fire('삭제 실패', '항목 삭제에 실패했습니다. 나중에 다시 시도해 주세요.', 'error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('삭제 실패', '항목 삭제 중 오류가 발생했습니다.', 'error');
            }
        }
    };
    // 날짜와 시간을 원하는 형식으로 추출하는 함수
    const formatDateTimeString = (dateString) => {
        // 날짜 문자열에서 필요한 부분만 추출
        // 예: '2024-08-31T16:43:41.290512' -> '2024-08-31 16:43:41'
        return dateString.substring(0, 19).replace('T', ' ');
    };

    const moveDetail = (id) => {
        navigate(`/board/list/${id}/1`);
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
                    게시판
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>제목</TableCell>
                            <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>작성자</TableCell>
                            <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>작성일</TableCell>
                            <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>조회</TableCell>
                            <TableCell align="center" sx={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boardList
                            .sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate)) // 최신순 정렬
                            .map((list, index) => (
                                <TableRow key={index} sx={{   '&:hover': {
                                        backgroundColor: '#f5f5f5', // 호버 시 배경 색상
                                        '& *': {
                                            color: '#ffb121', // 호버 시 모든 자식 요소의 텍스트 색상
                                        },
                                    },}}>
                                    <TableCell align="center" sx={{
                                        fontSize: '0.9rem',
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                    onClick={()=> moveDetail(list.board.id)}
                                    >
                                        {list.board.title}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{list.board.writer}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                        {formatDateTimeString(list.board.createDate)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{list.board.readCount}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>
                                        <IconButton onClick={() => handleDelete(list.board.id)}>
                                            <DeleteIcon sx={{ fontSize: '1.5rem'}}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
    </TableContainer>
        </Box>


    );
};

export default AdminBoard;