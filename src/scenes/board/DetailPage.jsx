import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

const DetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const currentUserId = "currentUser"; // 나중에 로그인한 사용자 정보를 가져올 때 이 부분을 업데이트해야 함

    useEffect(() => {
        axios.get(`/api/board/list/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    const handleEditClick = () => {
        navigate(`/board/update/${id}`);
    };

    const handleDeleteClick = () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            axios.delete(`/api/board/delete/${id}`)
                .then(response => {
                    alert("게시글이 삭제되었습니다.");
                    navigate('/board');
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                });
        }
    };

    const handleBackClick = () => {
        navigate('/board'); // 목록 페이지로 이동
    };

    return (
        <Box p={3}>
            {post ? (
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box mb={2} style={{ width: '300px' }}>
                        <Typography variant="h4" gutterBottom>
                            {post.title}
                        </Typography>
                    </Box>
                    <Box mb={2} style={{ width: '300px' }}>
                        <Typography variant="subtitle1">
                            작성자: {post.memberId}
                        </Typography>
                    </Box>
                    <Box mb={2} style={{ width: '1100px',minHeight:'500px',border: '1px solid black',padding:'20px' }}>
                        <Typography variant="body1" paragraph style={{fontSize:'15px'}}>
                            {post.content}
                        </Typography>
                    </Box>
                    {post.file && (
                        <Box mb={2} style={{ width: '300px' }}>
                            {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                                <img src={`/uploads/${post.file}`} alt="첨부파일" style={{ maxWidth: '100%' }} />
                            ) : (
                                <a href={`/uploads/${post.file}`} download>
                                    첨부파일 다운로드
                                </a>
                            )}
                        </Box>
                    )}
                    <Box mb={2} style={{ width: '300px' }}>
                        <Typography variant="subtitle2">
                            작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                        </Typography>
                        <Typography variant="subtitle2">
                            조회수: {post.readCount}
                        </Typography>
                    </Box>
                    <Box mt={2} style={{ width: '300px'}}>
                        <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                            수정
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeleteClick} style={{ marginRight: '10px' }}>
                            삭제
                        </Button>
                        <Button variant="outlined" onClick={handleBackClick}>
                            목록
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>
            )}
        </Box>
    );
};


export default DetailPage;
