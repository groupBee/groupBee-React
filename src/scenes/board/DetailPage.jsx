import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import Swal from "sweetalert2";

const DetailPage = () => {
    const { id, currentPage } = useParams();
    const [post, setPost] = useState(null);
    const [myinfoList, setMyinfoList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [editedCreateDate, setEditedCreateDate] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchPost();
        getinfo();
        getComment();
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

    const getComment = async () => {
        try {
            const response = await axios.get(`/api/comment/list?boardId=${id}`);
            const sortedComments = response.data.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
            setCommentList(sortedComments);
            console.log(sortedComments);
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

            setComment('');
            getComment();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('댓글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleEditClick = () => {
        navigate(`/board/update/${id}`);
    };

    const handleDeleteClick = async () => {
        const result = await Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "이 작업은 되돌릴 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffb121',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/board/delete/${id}`);
                Swal.fire({
                    title: '<strong>게시글이 삭제되었습니다</strong>',
                    icon: 'success',
                    html: '게시글이이 성공적으로 삭제되었습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#ffb121',
                });
                navigate('/board');
            } catch (error) {
                console.error('Error deleting post:', error);
                Swal.fire('게시글 삭제에 실패했습니다.', '', 'error');
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/board/${currentPage}`);
    };

    const commentDeleteClick = async (commentId) => {
        const result = await Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: "이 작업은 되돌릴 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffb121',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/comment/delete/${commentId}`);
                Swal.fire({
                    title: '<strong>댓글이 삭제되었습니다</strong>',
                    icon: 'success',
                    html: '댓글이 성공적으로 삭제되었습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#ffb121',
                });
                getComment(); // 댓글 목록을 갱신
            } catch (error) {
                console.error('Error deleting comment:', error);
                Swal.fire('댓글 삭제에 실패했습니다.', '', 'error');
            }
        }
    };

    const handleEditCommentClick = (commentId, content, createDate) => {
        setEditCommentId(commentId);
        setEditedComment(content);
        setEditedCreateDate(createDate);
    };

    const handleEditCommentSave = async () => {
        if (!editedComment) {
            alert("수정된 댓글을 입력하세요");
            return;
        }

        const data = {
            id: editCommentId, // ID를 포함
            content: editedComment,
            boardId: id,
            createDate : editedCreateDate,
        };

        try {
            await axios.post('/api/comment/insert', data);
            setEditCommentId(null);
            setEditedComment('');
            getComment();
        } catch (error) {
            console.error('Error updating comment:', error);
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
        <Box sx={{ m: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "900px",
                    padding: "20px",
                    marginBottom: "40px",
                    marginTop: "20px",
                }}
            >
                <Box p={3}>
                    {post ? (
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Typography

                                sx={{
                                    fontWeight: "bold",
                                    color: "#333",
                                    minWidth:'810px',
                                    fontSize: '25px'
                                }}
                            >
                                {post.mustRead && <span><b style={{ fontSize: '20px' }}>[공지]&nbsp;</b></span>}
                                {post.title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                            <Typography variant="body2" sx={{ color: "#777", fontSize: '13px'}}>
                                작성자: {post.writer} | 조회수: {post.readCount}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#777", fontSize: '13px' }}>
                                작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                            </Typography>
                            </Box>
                            {post.updateDate && new Date(post.updateDate) > new Date(post.createDate) && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <Typography variant="body2" sx={{ color: "#777", fontSize: '13px' }}>
                                        수정일: {new Date(post.updateDate).toLocaleString('ko-KR')}
                                    </Typography>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    marginTop: "5px",
                                    borderTop: "1px solid #eeeeee",
                                    paddingTop: "10px",
                                    width: "100%",
                                    minHeight:'250px',
                                    color: "#555",
                                    maxWidth: '810px',
                                    overflowWrap: 'break-word'
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {post.files && post.files.length > 0 && (
                                <Box sx={{ marginTop: "20px", borderTop: "1px solid #eeeeee", paddingTop: "10px",minWidth:'810px' }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
                                        첨부파일:
                                    </Typography>
                                    {post.files.map((file, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => downloadFile(`https://minio.bmops.kro.kr/groupbee/board/${file}`, post.originalFileNames[index])}
                                            sx={{
                                                display: "block",
                                                color: "#1e90ff",
                                                fontSize: "12px",
                                                textDecoration: "underline",
                                                marginBottom: "5px"
                                            }}
                                        >
                                            {post.originalFileNames[index]}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            <Box mb={1} display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                    <DriveFileRenameOutlineRoundedIcon sx={{ marginRight: '5px' }} />
                                    댓글
                                </Typography>
                                {myinfoList.potalId === post.memberId && (
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleEditClick}
                                            sx={{marginRight: '4px'}}
                                        >
                                            수정
                                        </Button>
                                        <Button variant="outlined" color="error" onClick={handleDeleteClick}>
                                            삭제
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <textarea
                                    style={{ width: '100%', minWidth: '810px', height: '100px', borderRadius: '8px' }}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Box display="flex" justifyContent="flex-end" width="100%">
                                <Button
                                        style={{
                                    color: '#ffb121',
                                    border: '1px solid #ffb121',
                                            backgroundColor: 'white',
                                            marginRight: '4px'}}
                                      onClick={handleBackClick}>
                                    목록
                                </Button>
                                <Button
                                    onClick={writeComment}
                                    style={{
                                        color: 'white',
                                        border: '1px solid #ffb121',
                                        backgroundColor: '#ffb121'
                                    }}
                                >
                                    등록
                                </Button>
                                </Box>
                            </Box>

                            <Box mt={2}>
                                {commentList.map((comment) => (
                                    <Box
                                        key={comment.id}
                                        sx={{
                                            border: "1px solid #ddd",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                            minWidth:'810px',
                                            maxWidth: '810px',
                                            overflowWrap: 'break-word', // 긴 텍스트를 줄 바꿈하도록 설정
                                        }}
                                    >
                                        {editCommentId === comment.id ? (
                                            <>
                                                <textarea
                                                    value={editedComment}
                                                    onChange={(e) => setEditedComment(e.target.value)}
                                                    style={{ width: '100%', borderRadius: '10px', minWidth: '700px' }}
                                                />
                                                <Button
                                                    onClick={handleEditCommentSave}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                    sx={{ marginTop: '10px', border: '1px solid #ffb121', color: '#ffb121' }}
                                                >
                                                    저장
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                                <Typography variant="body2" sx={{ color: "black", fontWeight: 'bold', fontSize: '15px' }}>
                                                    {comment.writer}
                                                </Typography>

                                                    <Typography variant="caption" sx={{ color: "#999" }}>
                                                        작성일: {new Date(comment.createDate).toLocaleString('ko-KR')}
                                                        {comment.updateDate && new Date(comment.updateDate) > new Date(comment.createDate) && (
                                                            <> &nbsp;&nbsp;(수정일: {new Date(comment.updateDate).toLocaleString('ko-KR')})</>
                                                        )}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ marginBottom: "5px", color: "black", fontSize:'13px'}}>
                                                    &nbsp;{comment.content}
                                                </Typography>
                                            </>
                                        )}
                                        {myinfoList.potalId === comment.memberId && (
                                            <Box mt={1} display="flex" justifyContent="flex-end">
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditCommentClick(comment.id, comment.content, comment.createDate)}
                                                >
                                                    수정
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<CloseIcon />}
                                                    onClick={() => commentDeleteClick(comment.id)}
                                                    color="error"
                                                >
                                                    삭제
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="h6">게시물을 불러오는 중입니다...</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default DetailPage;
