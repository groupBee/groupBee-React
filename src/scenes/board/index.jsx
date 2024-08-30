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
        axios.get('/api/board/list')
            .then(res => {
                // 중요 게시글과 일반 게시글 분리
                const importantPosts = res.data.filter(post => post.mustMustRead);
                const regularPosts = res.data.filter(post => !post.mustMustRead);

                // 모든 게시글을 작성일 기준으로 정렬 (최신순)
                const allPosts = [...importantPosts, ...regularPosts].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                // 페이징 적용
                const displayedPosts = allPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 중요 게시글은 상단에, 일반 게시글은 그 아래에 표시
                const finalPosts = [
                    ...importantPosts,
                    ...displayedPosts
                ].map((post, index) => ({
                    ...post,
                    displayNumber: index + 1 + (currentPage - 1) * itemsPerPage,
                }));

                setBoardList(finalPosts);
                setTotalPages(Math.ceil(allPosts.length / itemsPerPage));
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
    const handleTitleClick = (id) => {
        navigate(`/board/list/${id}`); // 클릭한 게시글의 상세 페이지로 이동
    };

    return (
        <Box m="20px">
            <Header title="사원 게시판" />
            <Box height="75vh">
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
                            ? { backgroundColor: '#b3b3b3', fontWeight: 'bold', color: 'blue' } // 상단 고정 게시글 스타일
                            : { backgroundColor: 'transparent' } // 일반 게시글 스타일
                        }>
                            <td>{row.id}{row.mustMustRead && <span style={{ color: 'red'}}><b>[중요]</b></span>}</td>
                            <td
                                style={{ cursor: 'pointer', color: 'black' }}
                                onClick={() => handleTitleClick(row.id)} // 제목 클릭 이벤트 설정
                            >
                                {row.mustRead && <span><b>[공지]</b></span>}
                                {row.title}
                                {row.file && <i className="bi bi-paperclip" style={{ marginLeft: '10px', color: 'gray' }}></i>}
                            </td>
                            <td>{row.memberId}</td>
                            <td>    {new Date(row.createDate).getFullYear()}-{String(new Date(row.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(row.createDate).getDate()).padStart(2, '0')} &nbsp;
                                {new Date(row.createDate).toLocaleTimeString('ko-KR', {
                                    timeZone: 'Asia/Seoul',
                                    hour12: false,  // 24시간 형식으로 설정
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}</td>
                            <td>{row.readCount}</td>
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
