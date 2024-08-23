import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

const UpdatePage = () => {
    const { id } = useParams(); // URL에서 ID 가져오기
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mustRead, setMustRead] = useState(false); // 공지사항 체크박스 상태
    const [mustMustRead, setMustMustRead] = useState(false); // 중요 체크박스 상태

    useEffect(() => {
        // 게시글 ID로 서버에서 데이터 가져오기
        axios.get(`/api/board/${id}`)
            .then(response => {
                const postData = response.data;
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setMustRead(postData.mustRead);
                setMustMustRead(postData.mustMustRead);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault(); // 기본 제출 방지
        try {
            // 게시글 업데이트 요청
            await axios.put(`/api/board/update/${id}`, {
                title,
                content,
                mustRead,
                mustMustRead,
            });
            navigate(`/board/${id}`); // 업데이트 후 게시글 상세 페이지로 이동
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (!post) {
        return <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>;
    }

    return (
        <Box m="20px">
            <Typography variant="h4">게시글 수정</Typography>
            <Box mt="20px">
                <form onSubmit={handleUpdate}>
                    <div>
                        <TextField
                            label="제목"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <Box mt="20px">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustRead}
                                    onChange={(e) => setMustRead(e.target.checked)}
                                />
                            }
                            label="공지사항"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mustMustRead}
                                    onChange={(e) => setMustMustRead(e.target.checked)}
                                />
                            }
                            label="중요"
                        />
                    </Box>
                    <div>
                        <TextField
                            label="내용"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <Box mt="20px">
                        <Button type="submit" variant="contained" color="primary">
                            수정 완료
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default UpdatePage;
