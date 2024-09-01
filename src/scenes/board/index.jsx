import { Box, Button, Pagination, Typography, IconButton } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material"; // 아이콘 사용을 위해 import 추가
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Board.css';

const Board = () => {
    const { Page } = useParams();
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const [commentCounts, setCommentCounts] = useState({}); // 댓글 수 상태

    useEffect(() => {
        if (Page) {
            setCurrentPage(Number(Page));
        }
    }, [Page]);

    useEffect(() => {
        const fetchBoardListAndComments = async () => {
            try {
                const boardListResponse = await axios.get('/api/board/list');
                const boardListData = boardListResponse.data;

                const importantPosts = boardListData.filter(post => post.mustMustRead);
                const regularPosts = boardListData.filter(post => !post.mustMustRead);

                const sortedImportantPosts = importantPosts.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
                const sortedRegularPosts = regularPosts.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                const totalRegularPosts = sortedRegularPosts.length;

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const displayedRegularPosts = sortedRegularPosts.slice(startIndex, endIndex);

                const finalPosts = [
                    ...sortedImportantPosts,
                    ...displayedRegularPosts
                ].map((post, index) => ({
                    ...post,
                    displayNumber: post.mustMustRead
                        ? <b style={{ color: 'red', marginLeft: '-5px' }}>[중요]</b>
                        : totalRegularPosts - (startIndex + index) + 8
                }));

                setBoardList(finalPosts);
                setTotalPages(Math.ceil(totalRegularPosts / itemsPerPage));

                const commentRequests = finalPosts.map(post =>
                    axios.get(`/api/comment/list?boardId=${post.id}`).then(res => ({ id: post.id, count: res.data.length }))
                );
                const commentResponses = await Promise.all(commentRequests);

                const commentCountMap = commentResponses.reduce((acc, { id, count }) => {
                    acc[id] = count;
                    return acc;
                }, {});

                setCommentCounts(commentCountMap);

            } catch (error) {
                console.error('Error fetching board list and comments:', error);
            }
        };

        fetchBoardListAndComments();
    }, [currentPage]);

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleTitleClick = (id) => {
        navigate(`/board/list/${id}/${currentPage}`);
    };

    const handleBoard = () => {
        navigate('/board');
    };

    return (
        <Box m="20px">
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 효과 추가
                }}
            >
                <Box borderBottom={`2px solid #ffb121`} p="15px">
                    <Typography
                        color="black"
                        variant="h5"
                        fontWeight="600"
                        fontSize="30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        사내게시판
                        <div style={{float: 'right', marginBottom: '20px'}}>
                            <Button variant='outlined'
                                    style={{backgroundColor: '#22a1e6', color: 'white', fontSize: '15px',marginTop:'20px'}}
                                    onClick={handleWriteClick}>글작성</Button>
                        </div>
                    </Typography>

                </Box>
                <Box p="15px">

                    {boardList.length > 0 ? (
                        <table className="table table-hover"> {/* 테이블에 hover 효과 추가 */}
                            <thead>
                            <tr>
                                <th style={{ width: '50px'}}>번호</th>
                                <th style={{ textAlign: 'center', width: '300px', fontWeight: 'bold' }}>
                                    제목
                                </th>
                                <th style={{ textAlign: 'center', width: '100px', fontWeight: 'bold' }}>
                                    작성자
                                </th>
                                <th style={{ textAlign: 'center', width: '100px', fontWeight: 'bold' }}>
                                    작성일
                                </th>
                                <th style={{ width: '50px'}}>조회</th>
                            </tr>
                            </thead>
                            <tbody style={{ borderBottom: '1px solid #dbd9d9' }}>
                            {boardList.map((row) => (
                                <tr key={row.id} style={row.mustMustRead
                                    ? { backgroundColor: '#b3b3b3', fontWeight: 'bold', color: 'blue' } // 상단 고정 게시글 스타일
                                    : { backgroundColor: 'transparent' } // 일반 게시글 스타일
                                }>
                                    <td>&nbsp;&nbsp;{row.displayNumber}</td>
                                    <td
                                        className="title-cell"
                                        style={{
                                            cursor: 'pointer',
                                            color: 'black',
                                            fontWeight: row.mustMustRead ? "bold" : "normal",
                                            maxWidth: "300px", // 최대 너비 설정
                                            overflow: "hidden", // 넘치는 내용 숨기기
                                            textOverflow: "ellipsis", // 넘치는 내용에 '...' 추가
                                            whiteSpace: "nowrap",
                                            transition: "color 0.3s", // 마우스 오버 시 부드러운 색상 전환 효과
                                        }}
                                        onClick={() => handleTitleClick(row.id)} // 제목 클릭 이벤트 설정
                                        onMouseOver={(e) => (e.target.style.color = "#ffb121")} // 마우스 오버 시 색상 변경
                                        onMouseOut={(e) => (e.target.style.color = "inherit")} // 마우스 아웃 시 원래 색상으로 복구
                                    >
                                        {row.mustRead && <span><b>[공지]&nbsp;</b></span>}
                                        {row.title}
                                        {commentCounts[row.id] > 0 && <span style={{ marginLeft: '10px', color: 'gray' }}>({commentCounts[row.id]})</span>}
                                        {row.file && <i className="bi bi-paperclip" style={{ marginLeft: '10px', color: 'gray' }}></i>}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{row.memberId}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {new Date(row.createDate).getFullYear()}-{String(new Date(row.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(row.createDate).getDate()).padStart(2, '0')} &nbsp;
                                        {new Date(row.createDate).toLocaleTimeString('ko-KR', {
                                            timeZone: 'Asia/Seoul',
                                            hour12: false,  // 24시간 형식으로 설정
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </td>
                                    <td>{Math.floor(row.readCount / 2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            게시글이 없습니다.
                        </Typography>
                    )}
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
        </Box>
    );
};

export default Board;
