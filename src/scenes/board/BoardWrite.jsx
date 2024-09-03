import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components";
import axios from 'axios';
import { Box, Button, Chip } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const BoardWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [readCount, setReadCount] = useState(0);
    const [mustRead, setMustRead] = useState(false); // 공지사항 체크박스 상태
    const [mustMustRead, setMustMustRead] = useState(false); // 중요 체크박스 상태
    const [file, setFile] = useState(null); // 파일 데이터
    const [originalFileName, setOriginalFileName] = useState(''); // 파일명

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

    // react-dropzone을 사용한 드래그 앤 드롭 구현
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]); // 첫 번째 파일을 저장
            setOriginalFileName(acceptedFiles[0].name); // 파일명을 저장
        }
    };

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        noClick: true, // 기본 클릭으로 파일 선택을 하지 않게 함
        noKeyboard: true, // 키보드로 선택 불가능
    });

    // 첨부파일 삭제 기능
    const DeleteAttachment = () => {
        setFile(null);
        setOriginalFileName('');
    };

    const FileAttachClick = (event) => {
        event.preventDefault();
        open();
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
            formData.append('file', file); // 파일 데이터
            formData.append('originalFileName', originalFileName); // 파일명
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
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <b style={{ width: '65px', textAlign: 'center' }}>첨부파일</b>
                            <button
                                onClick={FileAttachClick}  // 파일첨부 버튼 클릭 시 파일 선택 창 열기
                                style={{ marginLeft: '20px', border: '1px solid #dddd', backgroundColor: 'transparent', borderRadius: '4px', padding: '3px 6px' }}
                            >
                                파일첨부하기
                            </button>
                            {file && (
                                <button
                                    onClick={DeleteAttachment}
                                    style={{ marginLeft: '10px', border: '1px solid #dddd', backgroundColor: 'transparent', borderRadius: '4px', padding: '3px 6px' }}
                                >
                                    삭제
                                </button>
                            )}
                        </Box>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #dddddd',
                                borderRadius: '4px',
                                padding: '20px',
                                textAlign: 'center',
                                backgroundColor: isDragActive ? '#f0f0f0' : 'white',
                                marginBottom: '20px',
                                width:'800px'
                            }}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <Chip
                                    label={originalFileName}
                                    onDelete={DeleteAttachment}
                                    sx={{
                                        maxWidth: '200px', // 파일명이 너무 길 경우 잘리게 함
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden'
                                    }}
                                />
                            ) : (
                                <>
                                    <UploadFileIcon style={{ color: 'gray', marginBottom: '5px' }} />
                                    <p style={{ color: 'gray' }}>파일을 여기에 드래그하여 파일을 선택하세요.</p>
                                </>
                            )}
                        </Box>
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

                        <Button
                            type="submit"
                            variant='contained'
                            style={{
                                color: 'white',
                                backgroundColor: '#36c3ff', // 하늘색 기본 색상
                                backgroundImage: 'linear-gradient(135deg, #36c3ff 0%, #74d2ff 100%)', // 하늘색에서 약간 밝은 하늘색으로 그라데이션
                                border: 'none',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease', // 모든 속성의 변화를 부드럽게
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#74d2ff'; // 마우스 오버 시 밝은 하늘색으로 변경
                                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'; // 더 강한 그림자 효과로 살짝 떠오르는 느낌
                                e.target.style.transform = 'scale(1.05)'; // 약간 커지는 효과
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#36c3ff'; // 마우스가 벗어났을 때 원래 색상으로 돌아옴
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 원래 그림자 효과로 복구
                                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                            }}
                        >
                            등록
                        </Button>
                    </form>
                </div>
            </Box>
        </Box>
    );
};

export default BoardWrite;
