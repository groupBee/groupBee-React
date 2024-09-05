import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const DetailPage = () => {
    const { id, currentPage } = useParams();
    const [post, setPost] = useState(null);
    const [myinfoList, setMyinfoList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
        getinfo();
    }, [id]);

    const getinfo = async () => {
        try {
            const response = await axios.get("/api/employee/info");
            setMyinfoList(response.data);
        } catch (error) {
            console.error('Error fetching employee info:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            setPost(response.data);
            getcomment();
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const getcomment = async () => {
        try {
            const response = await axios.get(`/api/comment/list?boardId=${id}`);
            setCommentList(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const writeComment = async () => {
        if (!comment) {
            alert("댓글을 입력하세요");
            return;
        }

        const data = {
            "content": comment,
            "boardId": id
        };

        try {
            await axios.post('/api/comment/insert', data);
            alert("댓글이 작성되었습니다");
            setComment('');
            getcomment();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('댓글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleEditClick = () => {
        navigate(`/board/update/${id}`);
    };

    const handleDeleteClick = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/board/delete/${id}`);
                alert('게시글이 삭제되었습니다.');
                navigate('/board');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/board/${currentPage}`);
    };

    const commentDeleteClick = async (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/comment/delete/${commentId}`);
                alert("댓글이 삭제되었습니다");
                getcomment();
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleEditCommentClick = (commentId, content) => {
        setEditCommentId(commentId);
        setEditedComment(content);
    };

    const handleEditCommentSave = async () => {
        if (!editedComment) {
            alert("수정된 댓글을 입력하세요");
            return;
        }

        try {
            await axios.delete(`/api/comment/delete/${editCommentId}`);
            const data = {
                "content": editedComment,
                "boardId": id
            };
            await axios.post('/api/comment/insert', data);
            alert("댓글이 수정되었습니다");
            setEditCommentId(null);
            setEditedComment('');
            getcomment();
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('댓글 수정 중 오류가 발생했습니다.');
        }
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <Box m="20px">
            <Box
                height="auto"
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    top: "50%",
                    left: "50%",
                    marginLeft: '10%',
                    height: "auto",
                    minHeight: '1000px',
                    width: "100%",
                    maxWidth: "1000px",
                }}
            >
                <Box p={3}>
                    {post ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ backgroundColor: 'white', maxWidth: '1155px', marginLeft: '-24px', paddingLeft: '5%' }}>
                            <Box mb={2} style={{ width: '300px', }}>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    style={{
                                        width: '100%',
                                        minWidth: '900px',
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        padding: '3px',
                                        marginTop: '20px',
                                        borderBottom: '1px solid grey',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    {post.mustRead && <span><b style={{ fontSize: '20px' }}>[공지]&nbsp;</b></span>}
                                    <b style={{ fontSize: '20px' }}>{post.title}</b>
                                </Typography>
                                <Typography variant="subtitle1" style={{ width: '400px', paddingLeft: '5px', marginTop: '-3px' }}>
                                    작성자: {post.writer}&nbsp;&nbsp;&nbsp;<br />
                                    조회수: {post.readCount}
                                </Typography>
                            </Box>
                            <Box mb={2} style={{ width: '300px', marginTop: '-50px' }}>
                                <Typography variant="subtitle1" style={{ marginLeft: '705px', width: '400px', marginTop: '-12px' }}>
                                    작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                                </Typography>

                                {post.updateDate && new Date(post.updateDate) > new Date(post.createDate) && (
                                    <Typography variant="subtitle1" style={{ marginLeft: '705px', width: '400px', marginBottom: '-23px' }}>
                                        수정일: {new Date(post.updateDate).toLocaleString('ko-KR')}
                                    </Typography>
                                )}

                                <Box mb={2} style={{ width: '300px' }}>
                                    {post.files && post.originalFileNames && post.files.length > 0 && post.originalFileNames.length === post.files.length && (
                                        <Box style={{ borderTop: '1px solid grey', borderBottom: '1px solid grey', width: 'auto', minWidth: '900px', maxWidth: '1100px', paddingBottom: '-10px', marginTop: '30px' }}>
                                            <Typography variant="body1" style={{ marginBottom: '10px', fontSize: '15px', paddingTop: '5px' }}>
                                                첨부파일:&nbsp;&nbsp;&nbsp;
                                                {post.files.map((file, index) => (
                                                    <div key={index}>
                                                        <Button
                                                            onClick={() => downloadFile(`https://minio.bmops.kro.kr/groupbee/board/${file}`, post.originalFileNames[index])}
                                                            style={{
                                                                color: '#1e90ff',
                                                                textDecoration: 'none',
                                                                fontWeight: 'bold',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                padding: '0',
                                                                cursor: 'pointer',
                                                                fontSize: '15px',
                                                                display: 'block',
                                                                marginBottom: '5px'
                                                            }}
                                                        >
                                                            {post.originalFileNames[index]}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box mb={2} style={{ width: '69%' }}>
                                <Typography
                                    variant="body1"
                                    paragraph
                                    style={{
                                        fontSize: '16px',
                                        lineHeight: '1.6',
                                        color: '#444'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            minWidth: '900px',
                                            minHeight: '300px',
                                            marginTop: '-30px',
                                            borderRadius: '8px',
                                            backgroundColor: '#fafafa',
                                            padding: '16px',
                                            fontSize: '15px',
                                            overflow: 'auto'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </Typography>
                            </Box>

                            <Box mt={2} style={{ width: '300px', marginTop: '-30px', marginLeft: '750px' }}>
                                {
                                    myinfoList.potalId === post.memberId ?
                                        <>
                                            &nbsp;&nbsp;&nbsp;
                                            <Button
                                                onClick={handleEditClick}
                                                style={{ width: '40px', height: '20px', marginRight: '20px', marginTop: '20px', marginLeft: '40px' }}
                                            >
                                                편집
                                            </Button>
                                            <Button onClick={handleDeleteClick} style={{ marginLeft: '-30px', width: '30px', height: '20px', marginTop: '20px' }}>
                                                삭제
                                            </Button><br />
                                        </> : ''
                                }
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button
                                    variant="contained"
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#8c8b89',
                                        backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)',
                                        border: 'none',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'background-color 0.3s ease',
                                        marginLeft: '60px',
                                        marginTop: '10px'
                                    }}
                                    onClick={handleBackClick}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#2bb48c';
                                        e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#3af0b6';
                                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    목록
                                </Button>
                            </Box>
                            <hr />
                            <div style={{ marginTop: '30px' }}>
                                <b>댓글</b><br />
                            </div>
                            <div>
                                <textarea
                                    style={{ width: '100%', minWidth: '850px', height: '100px', borderRadius: '10px' }}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button
                                    onClick={writeComment}
                                    variant='contained'
                                    style={{
                                        float: 'right',
                                        marginBottom: '20px',
                                        color: 'black',
                                        border: '1px solid grey',
                                        backgroundColor: '#e1e1f5',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                                        e.target.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    등록
                                </Button>
                            </div><br />

                            <table>
                                <tbody>
                                <tr>
                                    <th><p style={{ width: '100px' }}>작성자</p></th>
                                    <th><p style={{ minWidth: '400px', marginLeft: '20px', marginRight: '200px' }}>내용</p></th>
                                    <th><p style={{ width: '100px' }}>작성일</p></th>
                                </tr>
                                </tbody>
                            </table>
                            {
                                commentList &&
                                commentList.map((item, idx) =>
                                    <table key={item.id}>
                                        <tbody>
                                        <tr style={{ borderBottom: '0.5px solid grey', maxHeight: '100px' }}>
                                            <td style={{ fontSize: '15px', minWidth: '55px', maxHeight: '50px' }}>{item.writer}</td>
                                            <td style={{ marginRight: '200px', minWidth: '350px', fontSize: '15px', maxHeight: '50px' }}>
                                                {editCommentId === item.id ? (
                                                    <div>
                                                        <textarea
                                                            value={editedComment}
                                                            onChange={(e) => setEditedComment(e.target.value)}
                                                            style={{ width: '700px', padding: '8px', borderRadius: '8px', paddingTop: '-10px', paddingBottom: '-10px' }}
                                                        />
                                                        <Button onClick={handleEditCommentSave} variant='contained' style={{ marginLeft: '10px' }}>
                                                            저장
                                                        </Button>
                                                        <Button onClick={() => setEditCommentId(null)} variant='contained' style={{ marginLeft: '10px' }}>
                                                            취소
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <p style={{
                                                        width: '550px',
                                                        whiteSpace: 'normal',
                                                        wordWrap: 'break-word',
                                                        padding: '8px',
                                                        marginTop: '5px',
                                                        marginLeft: '55px',
                                                        marginRight: '50px',
                                                        paddingTop: '-10px',
                                                        paddingBottom: '-10px'
                                                    }}>{item.content}</p>
                                                )}
                                            </td>
                                            <td style={{ width: '200px', maxHeight: '50px', marginLeft: '-50px' }}>
                                                {new Date(item.createDate).getFullYear()}-{String(new Date(item.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(item.createDate).getDate()).padStart(2, '0')} &nbsp;
                                                {new Date(item.createDate).toLocaleTimeString('ko-KR', {
                                                    timeZone: 'Asia/Seoul',
                                                    hour12: false,
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </td>
                                            {
                                                myinfoList.potalId === item.memberId ?
                                                    <><div style={{ display: 'flex', paddingTop: '15px' }}>
                                                        <Button
                                                            style={{ width: '30px' }}
                                                            onClick={() => handleEditCommentClick(item.id, item.content)}
                                                        >
                                                            <EditIcon />
                                                        </Button>
                                                        <Button
                                                            style={{ width: '30px' }}
                                                            onClick={() => commentDeleteClick(item.id)}
                                                        >
                                                            <CloseIcon />
                                                        </Button>
                                                    </div>
                                                    </> : ''
                                            }
                                        </tr>
                                        </tbody>
                                    </table>
                                )
                            }
                        </Box>

                    ) : (
                        <Typography variant="body1">게시글을 불러오는 중입니다...</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DetailPage;
