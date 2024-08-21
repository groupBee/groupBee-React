import { Box, Button, Pagination } from "@mui/material";
import { Header } from "../../components";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Board = () => {
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/notice-boards')
            .then(res => {
                const sortedData = res.data.sort((a, b) => b.id - a.id);
                setBoardList(sortedData);
                setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
            })
            .catch(error => {
                console.error('Error fetching board list:', error);
            });
    }, []);

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const currentItems = boardList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Box m="20px">
            <Header title="사원 게시판" />
            <Box height="75vh">
                <div style={{ display: 'flex' }}>
                    <p style={{ fontSize: '20px'}}>공지사항</p>
                    <p style={{ fontSize: '20px' }}>&nbsp;&nbsp;&nbsp;게시판</p>
                </div>
                <div style={{float:'right',marginBottom:'20px'}}>
                    <Button variant='contained' size="small" color="success" onClick={handleWriteClick}>글작성</Button>
                </div>
                <table className='table'>
                    <thead>
                    <tr className='table-danger'>
                        <th style={{ width: '50px' }}>번호</th>
                        <th style={{ width: '300px' }}>제목</th>
                        <th style={{ width: '100px' }}>작성자</th>
                        <th style={{ width: '100px' }}>작성일</th>
                        <th style={{ width: '50px' }}>조회</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.id}</td>
                            <td>{row.title}</td>
                            <td>{row.writer}</td>
                            <td>{new Date(row.create).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
                            <td>{row.readcount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Board;
