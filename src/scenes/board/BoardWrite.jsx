import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

const DetailPage = () => {
    const { id } = useParams(); // URL에서 ID 가져오기
    const [post, setPost] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 게시글 ID로 서버에서 데이터 가져오기
        axios.get(`/api/board/list/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });

        // 현재 로그인한 사용자 정보 가져오기
        axios.get('/api/user/current')
            .then(response => {
                setCurrentUserId(response.data.memberId);
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
            });
    }, [id]);

    const handleEditClick = () => {
        navigate(`/board/update/${id}`); // 게시글 수정 페이지로 이동
    };

    const handleDeleteClick = () => {
        if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
            axios.delete(`/api/board/list/${id}`)
                .then(() => {
                    navigate('/board'); // 삭제 후 목록 페이지로 이동
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                });
        }
    };

    return (
        <Box m="20px">
            <Button variant="contained" color="secondary" onClick={() => navigate('/board')}>
                목록으로 돌아가기
            </Button>
            {post ? (
                <>
                    <Typography variant="h4" style={{ marginTop: '20px' }}>{post.title}</Typography>
                    <Typography variant="subtitle1">작성자: {post.memberId}</Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        {post.content}
                    </Typography>
                    {post.file && (
                        post.file.endsWith('.jpg') || post.file.endsWith('.jpeg') || post.file.endsWith('.png') ? (
                            <Box mt={2}>
                                <img src={post.file} alt="첨부파일" style={{ maxWidth: '100%' }} />
                            </Box>
                        ) : (
                            <Box mt={2}>
                                <a href={post.file} download>
                                    <Button variant="contained" color="primary">다운로드</Button>
                                </a>
                            </Box>
                        )
                    )}
                    <Typography variant="subtitle2" style={{ marginTop: '20px' }}>
                        작성일: {new Date(post.createDate).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </Typography>
                    <Typography variant="subtitle2">
                        조회수: {post.readCount}
                    </Typography>
                    {post.memberId === currentUserId && (
                        <Box mt={2}>
                            <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                                수정
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDeleteClick}>
                                삭제
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>
            )}
        </Box>
    );
};

export default DetailPage;
