import { Box, Button, Pagination } from "@mui/material";
import { Header } from "../../components";
import axios from 'axios';
import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './Board.css';

const Board = () => {
    const {Page}=useParams();
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 15;
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(0);

    useEffect(()=>{
        if(Page){
        setCurrentPage(Page)}

    },[])

    // useEffect(() => {
    //     getCommentCount();  // 컴포넌트 마운트 시 댓글 수 가져오기
    // }, [commentCount]);

    useEffect(() => {
        axios.get('/api/board/list')
            .then(res => {
                // 중요 게시글과 일반 게시글 분리
                const importantPosts = res.data.filter(post => post.mustMustRead);
                const regularPosts = res.data.filter(post => !post.mustMustRead);

                // 중요 게시글을 작성일 기준으로 최신순 정렬
                const sortedImportantPosts = importantPosts.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                // 일반 게시글을 작성일 기준으로 최신순 정렬
                const sortedRegularPosts = regularPosts.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                // 총 게시글 수 계산
                const totalRegularPosts = sortedRegularPosts.length;


                // 페이지네이션 적용: 현재 페이지에 표시할 게시글 계산
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const displayedRegularPosts = sortedRegularPosts.slice(startIndex, endIndex);

                // 중요 게시글은 상단에, 일반 게시글은 그 아래에 표시
                const finalPosts = [
                    ...importantPosts,
                    ...displayedRegularPosts
                ].map((post, index) => ({
                    ...post,
                    // 전체 게시글에서 최신 게시글이 가장 높은 번호, 오래된 게시글이 1번이 되도록 번호 부여
                    displayNumber: post.mustMustRead
                        ? <b style={{ color: 'red',marginLeft:'-5px' }}>[중요]</b>
                        : totalRegularPosts - (startIndex + index)+8
                }));



                // 총 페이지 수 계산
                setBoardList(finalPosts);
                setTotalPages(Math.ceil(totalRegularPosts / itemsPerPage));
            })
            .catch(error => {
                console.error('Error fetching board list:', error);
            });
    }, [currentPage]);

    const getCommentCount = () => {
        axios.get(`/api/comment/list?boardId=${id}`)
            .then(res => {
                const commentCount = res.data.length;  // 댓글 수 계산
                setCommentCount(commentCount);  // 상태에 저장
            })
            .catch(error => {
                console.error('Error fetching comment count:', error);
            });
    };

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleTitleClick = (id) => {
        navigate(`/board/list/${id}/${currentPage}`); // 클릭한 게시글의 상세 페이지로 이동
    };

    return (
        <Box m="20px">
            <p className='title-board'>사내 게시판</p>
            <Box height="75vh">
                <div style={{ float: 'right', marginBottom: '20px' }}>
                    <Button variant='outlined' style={{backgroundColor:'#22a1e6',color:'white',fontSize:'15px'}} onClick={handleWriteClick}>글작성</Button>
                </div>
                <table className='table'>
                    <thead>
                    <tr style={{border:'1px solid black'}}>
                        <th style={{ width: '50px' ,backgroundColor: 'rgb(255, 177, 33)'}}>번호</th>
                        <th style={{ width: '300px' ,backgroundColor: 'rgb(255, 177, 33)'}}>제목</th>
                        <th style={{ width: '100px' ,backgroundColor: 'rgb(255, 177, 33)'}}>작성자</th>
                        <th style={{ width: '100px' ,backgroundColor: 'rgb(255, 177, 33)'}}>작성일</th>
                        <th style={{ width: '50px' ,backgroundColor: 'rgb(255, 177, 33)'}}>조회</th>
                    </tr>
                    </thead>
                    <tbody style={{border:'1px solid grey'}}>
                    {boardList.map((row, idx) => (
                        <tr key={row.id} style={row.mustMustRead
                            ? { backgroundColor: '#b3b3b3', fontWeight: 'bold', color: 'blue' } // 상단 고정 게시글 스타일
                            : { backgroundColor: 'transparent' } // 일반 게시글 스타일
                        }>
                            <td >&nbsp;&nbsp;{row.displayNumber}</td> {/* 중요 게시물은 번호 표시 X */}
                            <td
                                className="title-cell"
                                style={{ cursor: 'pointer', color: 'black'}}
                                onClick={() => handleTitleClick(row.id)} // 제목 클릭 이벤트 설정
                            >
                                {row.mustRead && <span><b>[공지]&nbsp;</b></span>}
                                {row.title}
                                {row.commentCount > 0 && <span style={{ marginLeft: '10px', color: 'gray' }}>({row.commentList.length})</span>}
                                {row.file && <i className="bi bi-paperclip" style={{ marginLeft: '10px', color: 'gray' }}></i>}
                            </td>
                            <td>{row.memberId}</td>
                            <td>
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
