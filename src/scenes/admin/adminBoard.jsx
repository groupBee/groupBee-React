import React, {useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    InputBase,
    MenuItem,
    Select, TableBody,
    TableCell,
    TableHead,
    TableRow,
    useMediaQuery
} from "@mui/material";
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";
import {Table} from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete.js";
import Swal from "sweetalert2";

const AdminBoard = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [boardList, setBoardList] = useState([]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const fetchData = async () => {
        try {
            const Response = await fetch('/api/board/list');
            const data = await Response.json();
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


    return (
        <Box style={{padding:'20px'}}>
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton
                            sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
                            onClick={() => setToggled(!toggled)}
                        >
                            <MenuOutlined />
                        </IconButton>
                        <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="white"
                            borderRadius="3px"
                            sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
                        >
                            <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
                            <IconButton type="button" sx={{ p: 1 }}>
                                <SearchOutlined />
                            </IconButton>
                        </Box>
                    </Box>
                    <Select
                        value={sortOrder}
                        onChange={handleSortChange}

                        size="small" // Select 컴포넌트의 크기 조절
                        sx={{
                            minWidth: 120, // 셀렉트의 최소 너비 설정
                        }}
                    >
                        <MenuItem value="default">기본 순서</MenuItem>
                        <MenuItem value="ascending">오름차순</MenuItem>
                        <MenuItem value="descending">내림차순</MenuItem>
                        <MenuItem value="date">날짜순</MenuItem>
                    </Select>
                </Box>
                <Box borderBottom="1px solid #e0e0e0" />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem'}}>번호</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>제목</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>작성자</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>작성일</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>조회</TableCell>
                            <TableCell align="center" sx={{ backgroundColor: '#ffb121', color: 'white',fontSize: '0.9rem' }}>삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boardList
                            .sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate)) // 최신순 정렬
                            .map((list, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>
                                        {boardList.length - index} {/* 최신 게시물부터 번호 부여 */}
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        fontSize: '0.9rem',
                                        maxWidth: '100px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {list.board.title}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{list.board.writer}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem' }}>
                                        {formatDateTimeString(list.board.createDate)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>{list.board.readCount}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.9rem'}}>
                                        <IconButton onClick={() => handleDelete(list.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>


                </Table>
            </Box>
            </Box>
    );
};

export default AdminBoard;