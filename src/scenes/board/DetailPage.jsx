import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DetailPage = () => {
    const { id } = useParams(); // URL에서 ID 가져오기
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 게시글 ID로 서버에서 데이터 가져오기
        axios.get(`/api/board/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    const handleEditClick = () => {
        navigate(`/board/update/${id}`); // 게시글 수정 페이지로 이동
    };

    return (
        <Box m="20px">
            {post ? (
                <>
                    <Typography variant="h4">{post.title}</Typography>
                    <Typography variant="subtitle1">작성자: {post.writer}</Typography>
                    <Typography variant="body1" style={{ marginTop: '20px' }}>
                        {post.content}
                    </Typography>
                    <Typography variant="subtitle2" style={{ marginTop: '20px' }}>
                        작성일: {new Date(post.create).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </Typography>
                    <Typography variant="subtitle2">
                        조회수: {post.readcount}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginTop: '20px' }}>
                        수정
                    </Button>
                </>
            ) : (
                <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>
            )}
        </Box>
    );
};

export default DetailPage;
