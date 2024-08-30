import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';

const UpdatePage = () => {
    const { id } = useParams(); // URL에서 게시글 ID 가져오기
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 서버에서 기존 게시글 정보를 가져와서 상태 업데이트
        axios.get(`/api/board/list/${id}`)
            .then(response => {
                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setFile(post.file);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpdateClick = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        axios.put(`/api/board/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                alert('게시글이 수정되었습니다.');
                navigate(`/board/list/${id}`); // 수정 후 게시글 상세 페이지로 이동
            })
            .catch(error => {
                console.error('Error updating post:', error);
            });
    };

    const handleCancelClick = () => {
        navigate(`/board/list/${id}`); // 취소 버튼을 누르면 게시글 상세 페이지로 이동
    };

    return (
        <Box m="20px">
            <Typography variant="h4" mb={2}>게시글 수정</Typography>
            <TextField
                fullWidth
                label="제목"
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                margin="normal"
            />
            <TextField
                fullWidth
                label="내용"
                value={content}
                onChange={handleContentChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={10}
            />
            <input
                type="file"
                onChange={handleFileChange}
                style={{ marginTop: '10px' }}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleUpdateClick} style={{ marginRight: '10px' }}>
                    수정
                </Button>
                <Button variant="outlined" onClick={handleCancelClick}>
                    취소
                </Button>
            </Box>
        </Box>
    );
};

export default UpdatePage;
