import { Box, Button, Pagination, Typography, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Board.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const Board = () => {
    const { Page } = useParams();
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const [myinfoList, setMyinfoList] = useState(null); // 사용자 정보 상태 추가
    const [showMyPosts, setShowMyPosts] = useState(false); // 내 글 보기 모드 상태
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('title'); // 'title' or 'writer'

    useEffect(() => {
        if (Page) {
            setCurrentPage(Number(Page));
        }
    }, [Page]);

    // 사용자 정보 가져오는 API 호출
    useEffect(() => {
        const getinfo = async () => {
            try {
                const response = await axios.get("/api/employee/info");
                setMyinfoList(response.data); // 사용자 정보 설정
            } catch (error) {
                console.error('Error fetching employee info:', error);
            }
        };

        getinfo();
    }, []);

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const response = await axios.get('/api/board/list');
                const boardListData = response.data;

                // 내 글 보기 모드일 경우 필터링
                let filteredPosts = boardListData;
                if (showMyPosts && myinfoList) {
                    filteredPosts = boardListData.filter(post => post.board.memberId === myinfoList.potalId);
                }

                // 검색 필터링
                filteredPosts = filteredPosts.filter(post => {
                    if (searchType === 'title') {
                        return post.board.title.toLowerCase().includes(searchQuery.toLowerCase());
                    } else if (searchType === 'writer') {
                        return post.board.writer.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return true;
                });

                // 중요 게시물과 일반 게시물 구분
                const importantPosts = filteredPosts.filter(post => post.board.mustMustRead);
                const regularPosts = filteredPosts.filter(post => !post.board.mustMustRead);

                // 중요 게시물 정렬
                const sortedImportantPosts = importantPosts.sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate));

                // 중요 게시물 중 상단 고정된 게시물과 상단 고정되지 않은 게시물 구분
                const maxImportantCount = 8;
                const displayedImportantPosts = sortedImportantPosts.slice(0, maxImportantCount);
                const excludedImportantPosts = sortedImportantPosts.slice(maxImportantCount);

                // 중요 게시물 중 상단 고정에서 탈락된 게시물은 일반 게시물에 추가
                const updatedRegularPosts = [
                    ...regularPosts,
                    ...excludedImportantPosts
                ].sort((a, b) => new Date(b.board.createDate) - new Date(a.board.createDate));

                // 페이지에 표시할 일반 게시물 범위 설정
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const displayedRegularPosts = updatedRegularPosts.slice(startIndex, endIndex);

                // 최종 게시물 리스트 구성
                const finalPosts = [
                    ...displayedImportantPosts.map(post => ({
                        ...post,
                        displayNumber: <b style={{ color: 'red', marginLeft: '-5px' }}>[중요]</b>,
                        titleDisplay: <b>{post.board.mustRead ? '[공지] ' : ''}{post.board.title}</b>
                    })),
                    ...displayedRegularPosts.map((post, index) => ({
                        ...post,
                        displayNumber: updatedRegularPosts.length - (startIndex + index),
                        titleDisplay: post.board.mustRead ? '[공지] ' + post.board.title : post.board.title
                    }))
                ];

                setBoardList(finalPosts);
                setTotalPages(Math.ceil(updatedRegularPosts.length / itemsPerPage));
            } catch (error) {
                console.error('Error fetching board list:', error);
            }
        };

        fetchBoardList();
    }, [currentPage, showMyPosts, myinfoList, searchQuery, searchType]);

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    const handleTogglePosts = () => {
        setShowMyPosts(!showMyPosts);
        setCurrentPage(1); // 페이지를 첫 페이지로 초기화
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleTitleClick = (id) => {
        navigate(`/board/list/${id}/${currentPage}`);
    };

    return (
        <Box m="20px">
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                        <div style={{ float: 'right', marginBottom: '20px' }}>
                            <Button variant='outlined'
                                    style={{
                                        backgroundColor: showMyPosts ? '#a1c4fd' : '#8ec6ff',
                                        backgroundImage: showMyPosts ? 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' : 'linear-gradient(135deg, #8ec6ff 0%, #e0f7ff 100%)',
                                        color: 'white',
                                        fontSize: '15px',
                                        marginLeft: '10px',
                                        marginTop: '40px',
                                        marginBottom:'-50px',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onClick={handleTogglePosts}>
                                {showMyPosts ? '전체 글' : '내 작성글'}
                            </Button>
                            <Button variant='outlined'
                                    style={{
                                        backgroundColor: '#f6d365',
                                        backgroundImage: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                                        color: 'white',
                                        fontSize: '15px',
                                        marginTop: '40px',
                                        marginBottom:'-50px',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'background-color 0.3s ease',
                                        marginLeft: '20px'
                                    }}
                                    onClick={handleWriteClick}>글작성</Button>
                        </div>
                    </Typography>
                    <Box mt={2} mb={2} sx={{ display: 'flex', alignItems: 'center',marginTop:'-10px',marginBottom:'-2px',marginLeft:'-15px'}}>
                        <TextField
                            label=" &nbsp;&nbsp;검색어"
                            variant="outlined"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                marginRight: '10px',
                                width: '200px',
                                padding: '8px 12px',
                                fontSize: '14px'
                            }}
                            InputLabelProps={{
                                style: { fontSize: '14px' }
                            }}
                            InputProps={{
                                style: { height: '40px' } // 높이 조정
                            }}
                        />
                        <FormControl variant="outlined" style={{ minWidth: 100 }}>
                            <InputLabel style={{ fontSize: '14px' }}>검색 기준</InputLabel>
                            <Select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                label="검색 기준"
                                style={{ fontSize: '14px', height: '40px' }} // 높이 조정
                            >
                                <MenuItem value="title">제목</MenuItem>
                                <MenuItem value="writer">작성자</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box p="15px">
                    {boardList.length > 0 ? (
                        <table className="table table-hover">
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
                                <tr key={row.board.id}>
                                    <td>&nbsp;&nbsp;{row.displayNumber}</td>
                                    <td
                                        className="title-cell"
                                        style={{
                                            cursor: 'pointer',
                                            color: 'black',
                                            maxWidth: "300px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            transition: "color 0.3s",
                                        }}
                                        onClick={() => handleTitleClick(row.board.id)}
                                        onMouseOver={(e) => (e.target.style.color = "#ffb121")}
                                        onMouseOut={(e) => (e.target.style.color = "inherit")}
                                    >
                                        {row.titleDisplay}
                                        {row.board.files && row.board.files.length > 0 && <AttachFileIcon style={{ width: '15px', height: '15px' }} />}
                                        {row.commentCount > 0 && <span style={{ marginLeft: '10px' }}>({row.commentCount})</span>}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{row.board.writer}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {new Date(row.board.createDate).getFullYear()}-{String(new Date(row.board.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(row.board.createDate).getDate()).padStart(2, '0')} &nbsp;
                                        {new Date(row.board.createDate).toLocaleTimeString('ko-KR', {
                                            timeZone: 'Asia/Seoul',
                                            hour12: false,
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </td>
                                    <td>&nbsp;{row.board.readCount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            게시글이 없습니다.
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages} // 전체 페이지 수
                    page={currentPage} // 현재 페이지
                    onChange={handlePageChange} // 페이지 변경 이벤트 핸들러
                    color="primary" // 페이지 색상
                    siblingCount={1} // 중간 페이지를 기준으로 좌우에 표시할 페이지 수 (여기서 기본적으로 좌우 각각 1개씩 표시)
                    boundaryCount={1} // 시작과 끝에 표시할 페이지 수 (1로 설정하여 양쪽 끝에 1개의 페이지만 표시)
                    showFirstButton // 처음 페이지로 이동하는 버튼을 표시
                    showLastButton // 마지막 페이지로 이동하는 버튼을 표시
                />
            </Box>
        </Box>
    );
};

export default Board;
