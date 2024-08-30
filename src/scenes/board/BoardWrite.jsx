import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components";
import axios from 'axios';
import { Box, Button } from "@mui/material";

const BoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [readCount, setReadCount] = useState(0);
    const [mustRead, setMustRead] = useState(false); // 공지사항 체크박스 상태
    const [mustMustRead, setMustMustRead] = useState(false); // 중요 체크박스 상태
    const [file, setFile] = useState(null); // 파일 상태

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
        e.preventDefault(); // 기본 제출 방지

        const boardData = {
            title,
            content,
            mustRead,
            mustMustRead,
            readCount,
        };

        const formData = new FormData();
        formData.append('boardData', JSON.stringify(boardData));

        if (file) {
            formData.append('file', file);
        }

        try {
            // 게시글과 파일 함께 전송
            await axios.post('/api/board/insert', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/board'); // 요청이 성공하면 게시판 페이지로 이동
        } catch (error) {
            console.error('Error creating post or uploading file:', error); // 에러 발생 시 콘솔에 출력
        }
    };

    return (
        <Box m="20px">
            <Header title="게시글 작성" />
            <Box height="75vh">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title"><b style={{ fontSize: '15px' }}>제목</b></label>
                            <br />
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                style={{ width: '800px', height: '30px' }}
                            />
                        </div>
                        <div style={{ display: 'flex' }}>
                            <input
                                type="checkbox"
                                checked={mustRead}
                                onChange={handleMustReadChange}
                            /><b style={{ marginTop: '15px', marginLeft: '10px' }}>공지사항</b>

                            <input
                                type="checkbox"
                                checked={mustMustRead}
                                onChange={handleMustMustReadChange}
                                style={{ marginLeft: '20px' }}
                            /><b style={{ marginTop: '15px', marginLeft: '10px' }}>중요</b>
                        </div>
                        <div>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ marginTop: '10px' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="content"></label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={handleContentChange}
                                required
                                style={{ width: '800px', height: '300px' }}
                                placeholder='중요 체크시 상단 고정!'
                            ></textarea>
                        </div>
                        <Button type="submit" variant='contained' color='info'>등록</Button>
                    </form>
                </div>
            </Box>
        </Box>
    );
};

export default BoardWrite;
