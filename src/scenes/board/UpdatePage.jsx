import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Checkbox, FormControlLabel, Typography, Link } from '@mui/material';

const UpdatePage = () => {
    const { id, Page } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mustRead, setMustRead] = useState(false);
    const [mustMustRead, setMustMustRead] = useState(false);
    const [file, setFile] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (Page) {
            setCurrentPage(Page);
        }
    }, [Page]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            const data = response.data;
            setPost(data);
            setTitle(data.title);
            setContent(data.content);
            setMustRead(data.mustRead);
            setMustMustRead(data.mustMustRead);
            if (data.file) {
                setOriginalFileName(data.originalFileName);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleMustReadChange = (e) => {
        setMustRead(e.target.checked);
    };

    const handleMustMustReadChange = (e) => {
        setMustMustRead(e.target.checked);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardData = {
            title,
            content,
            mustRead,
            mustMustRead,
        };

        const formData = new FormData();
        formData.append('boardData', JSON.stringify(boardData));

        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.patch(`/api/board/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate(`/board/list/${id}/${currentPage}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error('Error updating post or uploading file:', error);
        }
    };

    const handleCancelClick = () => {
        navigate(`/board/list/${id}/${currentPage}`);
    };

    return (
        <Box m="20px">
            <Box height="75vh">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title"><b style={{ fontSize: '15px' }}>제목</b></label>
                        <br />
                        <TextField
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            fullWidth
                            variant="outlined"
                            style={{ backgroundColor: 'white', width: '1100px' }}
                        />
                    </div>
                    <Box mb={2} mt={2} style={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustRead}
                                    onChange={handleMustReadChange}
                                />
                            }
                            label="공지사항"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustMustRead}
                                    onChange={handleMustMustReadChange}
                                    style={{ marginLeft: '20px' }}
                                />
                            }
                            label="중요"
                        />
                    </Box>
                    <div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ marginTop: '10px' }}
                        />
                    </div>
                    {originalFileName && (
                        <Box mt={2}>
                            <Typography variant="body1">기존 첨부 파일: </Typography>
                            <Link href={`/api/download/${id}`} target="_blank" rel="noopener noreferrer">
                                {originalFileName}
                            </Link>
                        </Box>
                    )}
                    <div>
                        <label htmlFor="content"></label>
                        <TextField
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            required
                            multiline
                            rows={10}
                            fullWidth
                            variant="outlined"
                            placeholder="내용을 입력하세요"
                            style={{ backgroundColor: 'white', width: '1100px' }}
                        />
                    </div>
                    <Box mt={2}>
                        <Button type="submit" variant="contained" style={{
                            color: 'white',
                            backgroundColor: '#4e73df',
                            backgroundImage: 'linear-gradient(135deg, #4e73df 0%, #6f42c1 100%)',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s ease',
                            marginRight: '20px'
                        }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2bb48c';
                                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3af0b6';
                                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}>
                            저장
                        </Button>
                        <Button variant="contained" onClick={handleCancelClick}
                                style={{
                                    color: 'white',
                                    backgroundColor: '#8c8b89',
                                    backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)',
                                    border: 'none',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2bb48c';
                                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                    e.target.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3af0b6';
                                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}>
                            취소
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default UpdatePage;
