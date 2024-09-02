import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const UpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mustRead, setMustRead] = useState(false);
    const [mustMustRead, setMustMustRead] = useState(false);
    const [file, setFile] = useState(null);
    const {Page}=useParams();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(()=>{
        if(Page){
            setCurrentPage(Page)}

    },[])

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            const data = response.data;
            setPost(data);
            setTitle(data.title);
            setContent(data.content);
            setMustRead(data.mustRead);
            setMustMustRead(data.mustMustRead);
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
                            style={{backgroundColor:'white',width:'1100px'}}
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
                            style={{backgroundColor:'white',width:'1100px'}}
                        />
                    </div>
                    <Box mt={2}>
                        <Button type="submit" variant='contained'   style={{
                            color: 'white',
                            backgroundColor: '#4e73df',
                            backgroundImage: 'linear-gradient(135deg, #4e73df 0%, #6f42c1 100%)', // 파란색에서 보라색으로 그라데이션
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s ease',
                            marginRight:'20px'
                        }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2bb48c'; // 마우스 오버 시 더 진한 색상으로 변경
                                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'; // 더 강한 그림자 효과로 살짝 떠오르는 느낌
                                    e.target.style.transform = 'scale(1.05)'; // 약간 커지는 효과
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3af0b6'; // 마우스 벗어나면 원래 색상으로 복구
                                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 원래 그림자 효과로 복구
                                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                                }}>
                            저장
                        </Button>
                        <Button variant='contained' onClick={handleCancelClick}
                                style={{        color: 'white',
                                    backgroundColor: '#8c8b89',
                                    backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)', // 회색 그라데이션
                                    border: 'none',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',}}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2bb48c'; // 마우스 오버 시 더 진한 색상으로 변경
                                    e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'; // 더 강한 그림자 효과로 살짝 떠오르는 느낌
                                    e.target.style.transform = 'scale(1.05)'; // 약간 커지는 효과
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3af0b6'; // 마우스 벗어나면 원래 색상으로 복구
                                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 원래 그림자 효과로 복구
                                    e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
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
