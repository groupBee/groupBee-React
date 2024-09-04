import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Typography, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const DetailPage = () => {
    const {id,currentPage} = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [myinfoList, setMyinfoList] = useState([]);
    const [commentList, setCommentList] = useState([]);

    const [comment,setComment] = useState('');

    useEffect(() => {
        getinfo();
    }, []);

    const getinfo = () => {
        axios.get("/api/employee/info")
            .then(res => {
                setMyinfoList(res.data)
                console.log(res.data.potalId);
            })
    }
    const getcomment = () => {
        console.log(id)
        axios.get("/api/comment/list?boardId=" + id)
            .then(res => {
                console.log(res.data)
                setCommentList(res.data)
            })
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`/api/board/list/${id}`);
            setPost(response.data);
            console.log(response.data)
            getcomment();
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };
    const writeComment = () => {
        if (!comment) {  // comment가 비어있을 때
            alert("댓글을 입력하세요");
            return;  // 함수 종료
        }

        const data = {
            "content": comment,
            "boardId": post.id
        }

        axios.post('/api/comment/insert', data)
            .then(res => {
                alert("댓글이 작성되었습니다")
                getcomment();
                setComment('');
            })
            .catch(error => {
                console.error('Error posting comment:', error);
                alert('댓글 작성 중 오류가 발생했습니다.');
            });
    }

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
        navigate(`/board/${currentPage}`);
    };

    const commentDeleteClick = (commentId) => {
        const isConfirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');

        if (isConfirmed) {
            axios.delete(`/api/comment/delete/${commentId}`)
                .then(() => {
                    alert("댓글이 삭제되었습니다");
                    getcomment();
                })
                .catch(error => {
                    console.error('Error deleting comment:', error);
                    alert('댓글 삭제 중 오류가 발생했습니다.');
                });
        }
    };

    const downloadFile = async (fileUrl, fileName) => {
        try {
            // 파일을 fetch
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            // 파일을 Blob 형태로 변환
            const blob = await response.blob();

            // Blob URL 생성
            const url = window.URL.createObjectURL(blob);

            // 다운로드 링크 생성
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // Blob URL 해제
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };
    return (
        <Box p={3}>
            {post ? (
                <Box display="flex" flexDirection="column" alignItems="flex-start" style={{backgroundColor:'white',maxWidth:'1155px',marginLeft:'-24px',paddingLeft:'30px'}}>
                    <Box mb={2} style={{width: '300px'}}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            style={{
                                width: '1100px',
                                whiteSpace: 'normal', // 줄바꿈 자동 적용
                                wordWrap: 'break-word', // 긴 단어의 줄바꿈을 허용
                                padding: '3px',
                                marginTop:'20px',
                                borderBottom:'1px solid grey',
                                borderTop:'1px solid grey',
                                backgroundColor:'#f0f3fa'
                            }}
                        >{post.mustRead && <span><b style={{fontSize:'15px'}}>[공지]&nbsp;</b></span>}
                            <b style={{fontSize:'15px'}}>{post.title}</b>
                        </Typography>
                        <Typography variant="subtitle1" style={{width:'400px',paddingLeft:'5px',marginTop:'-3px'}}>
                            작성자: {post.writer}&nbsp;&nbsp;&nbsp;
                        </Typography>
                    </Box>
                    <Box mb={2} style={{width: '300px',marginTop:'-50px'}}>
                        <Typography variant="subtitle1" style={{ marginLeft: '910px', width: '400px', marginTop: '-20px' }}>
                            작성일: {new Date(post.createDate).toLocaleString('ko-KR')}
                        </Typography>

                        {post.updateDate && new Date(post.updateDate) > new Date(post.createDate) && (
                            <Typography variant="subtitle1" style={{ marginLeft: '910px', width: '400px', marginTop: '5px' }}>
                                수정일: {new Date(post.updateDate).toLocaleString('ko-KR')}
                            </Typography>
                        )}
                        <Typography style={{marginLeft:'1035px',width:'400px',paddingTop:'10px'}}>
                            조회수: {Math.floor(post.readCount / 2)}
                        </Typography>

                    <Box mb={2} style={{width: '300px', display: 'flex', alignItems: 'center'}}>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: '20px',
                                visibility:'hidden'
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '1px solid black',
                                marginLeft:'10px',
                                backgroundColor: post.mustRead ? '#171fb3' : 'white'
                            }}/>
                            <b style={{marginLeft: '10px'}}>공지사항</b>
                        </Box>
                        <Box
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                visibility:'hidden'
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '1px solid black',
                                backgroundColor: post.mustMustRead ? 'red' : 'white'
                            }}/>
                            <b style={{marginLeft: '10px'}}>중요</b>
                        </Box>

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
                                        width: '1100px',
                                        minHeight: '300px',
                                        marginTop:'-30px',
                                        border: '1px solid black',
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
                    {/* 첨부파일 부분 */}
                    <Box mb={2} style={{ width: '300px' }}>
                        {post.file && post.originalFileName && (
                            <Box>
                                <Typography variant="body1" style={{ marginBottom: '10px',fontSize:'15px' }}>
                                    첨부파일:
                                    <Button
                                        onClick={() => downloadFile(`https://minio.bmops.kro.kr/groupbee/board/${post.file}`, post.originalFileName)}
                                        style={{
                                            color: '#1e90ff',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            padding: '0',
                                            cursor: 'pointer',
                                            fontSize:'15px'
                                        }}
                                    >
                                        {post.originalFileName}
                                    </Button>
                                </Typography>
                            </Box>
                        )}
                    </Box>


                    <Box mt={2} style={{width: '300px'}}>
                        {
                            myinfoList.potalId == post.memberId ?
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={handleEditClick}
                                        style={{
                                            marginRight: '10px',
                                            color: 'white',
                                            backgroundColor: '#f7d774', // 기본 노란색
                                            backgroundImage: 'linear-gradient(135deg, #f7d774 0%, #f1c40f 100%)', // 노란색 그라데이션
                                            border: 'none',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s ease',
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
                                        }}
                                    >
                                        수정
                                    </Button>
                                    <Button variant="contained"  onClick={handleDeleteClick}
                                            style={{  marginRight: '10px',
                                                color: 'white',
                                                backgroundColor: '#fc9a38',
                                                backgroundImage: 'linear-gradient(135deg, #fc9a38 0%, #f77f00 100%)', // 주황색 그라데이션
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
                                        삭제
                                    </Button> </> : ''}
                        <Button variant="contained" style={{        color: 'white',
                            backgroundColor: '#8c8b89',
                            backgroundImage: 'linear-gradient(135deg, #8c8b89 0%, #6c6b68 100%)', // 회색 그라데이션
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'background-color 0.3s ease',}} onClick={handleBackClick}
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
                            목록
                        </Button>
                    </Box>
                    <hr/>
                    <div>
                        <b>댓글</b><br/>
                    </div>
                    <div>
                        <textarea style={{width:'1100px',height:'100px',borderRadius:'10px'}} value={comment} onChange={(e) => setComment(e.target.value)}>
                        </textarea>
                        <Button
                            onClick={writeComment}
                            variant='contained'
                            style={{
                                marginRight: '20px',
                                float: 'right',
                                marginBottom: '20px',
                                color: 'black',
                                border:'1px solid grey',
                                backgroundColor: '#e1e1f5', // 기본 하늘색
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'; // 더 강한 그림자 효과로 살짝 떠오르는 느낌
                                e.target.style.transform = 'scale(1.05)'; // 약간 커지는 효과
                            }}
                            onMouseOut={(e) => {
                                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // 원래 그림자 효과로 복구
                                e.target.style.transform = 'scale(1)'; // 원래 크기로 복구
                            }}
                        >
                            등록
                        </Button>
                    </div><br/>

                    <table>
                        <tbody>
                        <tr>
                            <th><p  style={{width: '100px'}}>작성자</p></th>
                            <th><p  style={{minWidth:'400px',marginLeft:'20px',marginRight:'200px'}}>내용</p></th>
                            <th><p  style={{marginLeft:'180px',width: '100px'}}>작성일</p></th>
                        </tr>
                        </tbody>
                    </table>
                    {
                        commentList &&
                        commentList.map((item, idx) =>
                            <table>
                                <tbody>
                                <tr style={{borderBottom:'0.5px solid grey',maxHeight:'100px'}}>
                                    <td style={{fontSize:'15px',width:'55px',maxHeight:'50px'}}>{item.writer}</td>
                                    <td style={{marginRight:'200px',minWidth:'350px',fontSize:'15px',maxHeight:'50px'}}><p  style={{
                                        width: '700px',
                                        whiteSpace: 'normal', // 줄바꿈 자동 적용
                                        wordWrap: 'break-word', // 긴 단어의 줄바꿈을 허용
                                        padding: '8px',
                                        marginTop:'5px',
                                        paddingTop:'15px',
                                        marginLeft:'55px'
                                        ,marginRight:'50px'
                                    }}>{item.content}</p></td>
                                    <td style={{width:'200px',maxHeight:'50px'}}>     {new Date(item.createDate).getFullYear()}-{String(new Date(item.createDate).getMonth() + 1).padStart(2, '0')}-{String(new Date(item.createDate).getDate()).padStart(2, '0')} &nbsp;
                                        {new Date(item.createDate).toLocaleTimeString('ko-KR', {
                                            timeZone: 'Asia/Seoul',
                                            hour12: false,  // 24시간 형식으로 설정
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}</td>
                                    {
                                        myinfoList.potalId == item.memberId ?
                                            <>
                                                <Button
                                                    style={{marginTop:'30%'}}
                                                    onClick={(e) => commentDeleteClick(item.id)}

                                                >
                                                    <CloseIcon />
                                                </Button> </> : ''}

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
    );
};

export default DetailPage;
