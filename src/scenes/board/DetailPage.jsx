import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';

const getinfo = () =>{
    axios.get("/")
}

const DetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleEditClick = () => {
        navigate(`/board/update/${id}`);
    };

    const handleDeleteClick = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            axios.delete(`/api/board/delete/${id}`)
                .then(() => {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                })
                .catch(error => {
                    console.error('Error deleting post:', error);
                });
        }
    };

    const handleBackClick = () => {
        navigate('/board');
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
                    <Box mb={2} style={{ width: '300px', display: 'flex', alignItems: 'center' }}>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: '20px',
                            }}
                        >
                            <div style={{ width: '16px', height: '16px', border: '1px solid black', backgroundColor: post.mustRead ? 'red' : 'white' }} />
                            <b style={{ marginLeft: '10px' }}>공지사항</b>
                        </Box>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ width: '16px', height: '16px', border: '1px solid black', backgroundColor: post.mustMustRead ? 'red' : 'white' }} />
                            <b style={{ marginLeft: '10px' }}>중요</b>
                        </Box>
                    </Box>
                    <Box mb={2} style={{ width: '300px' }}>
                        <Typography variant="body1" paragraph>
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

                    <Box mt={2} style={{ width: '300px' }}>
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
