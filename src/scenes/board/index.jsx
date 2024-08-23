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
        axios.get('/api/board')
            .then(res => {
                // 중요 게시글과 일반 게시글 분리
                const importantPosts = res.data.filter(post => post.mustMustRead);
                const regularPosts = res.data.filter(post => !post.mustMustRead);

                // 일반 게시글을 최신순으로 정렬 (번호가 높은 순서대로)
                const sortedRegularPosts = regularPosts.sort((a, b) => b.id - a.id);

                // 페이징 적용
                const displayedRegularPosts = sortedRegularPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 중요 게시글은 상단에, 일반 게시글은 그 아래에 표시
                const finalPosts = [
                    ...importantPosts,
                    ...displayedRegularPosts
                ].map((post, index) => ({
                    ...post,
                    displayNumber: index + 1 + (currentPage - 1) * itemsPerPage,
                }));

                setBoardList(finalPosts);
                setTotalPages(Math.ceil(sortedRegularPosts.length / itemsPerPage));
            })
            .catch(error => {
                console.error('Error fetching board list:', error);
            });
    }, [currentPage]);

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

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
                    {boardList.map((row, idx) => (
                        <tr key={idx} style={row.mustMustRead
                            ? { backgroundColor: '#b3b3b3', fontWeight: 'bold' ,color:'grey'} // 상단 고정 게시글 스타일
                            : { backgroundColor: 'transparent' } // 일반 게시글 스타일
                        } >
                            <td>{row.id}{row.mustMustRead && <span style={{color:'red'}}><b>[중요]</b></span>}</td>
                            <td>{row.mustRead && <span><b>[공지]</b></span>}{row.title}</td>
                            <td>{row.writer}</td>
                            <td>{new Date(row.create).toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'})}</td>
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
