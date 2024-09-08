import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailOpenIcon from '@mui/icons-material/Drafts';
import EmailModal from "./EmailModal.jsx";
import {Box} from "@mui/material";

function EmailList() {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [readEmails, setReadEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const emailsPerPage = 15; // 페이지당 15개의 이메일을 표시
    const [pageGroup, setPageGroup] = useState(0); // 페이지 그룹 관리
    const pagesPerGroup = 5; // 그룹당 페이지 수를 5로 설정



    // 이메일 목록을 가져오는 함수
    const checkEmail = async () => {

        try {
            const response = await fetch('/api/email/check', {
                method: 'get'
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                // 이메일 목록을 최신순으로 정렬
                result.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));
                setEmails(result);
                setError('');
            } else {
                const result = await response.json();
                setError(result.error || '관리자에게 문의해 주세요.');
            }
        } catch (err) {
            setError('에러: ' + err.message);
        }
    };

    // 특정 이메일 내용을 보여주는 함수
    const showMail = (content) => {
        setSelectedEmail(content);
        setShowModal(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // 페이지 이동 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지 그룹 이동 함수
    const nextPageGroup = () => {
        setPageGroup(pageGroup + 1);
        setCurrentPage(pageGroup * pagesPerGroup + pagesPerGroup + 1); // 다음 그룹의 첫 페이지
    };

    const prevPageGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * pagesPerGroup); // 이전 그룹의 마지막 페이지
        }
    };

  // 날짜를 한국어 형식으로 변환하는 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    // 날짜가 오늘인 경우 시간만 표시
    if (date.toDateString() === today.toDateString()) {
        return new Intl.DateTimeFormat('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false  // 24시간 형식으로 표시
        }).format(date);
    }

    // 오늘이 아닌 경우 날짜를 한글 형식으로 표시
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false  // 24시간 형식으로 표시
    }).format(date);
};


    // 현재 페이지에 보여줄 이메일 목록 슬라이싱
    const indexOfLastEmail = currentPage * emailsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(emails.length / emailsPerPage);

    // 현재 그룹의 페이지 버튼 생성
    const pageButtons = Array.from(
        { length: Math.min(pagesPerGroup, totalPages - pageGroup * pagesPerGroup) },
        (_, i) => pageGroup * pagesPerGroup + i + 1
    );


    // 유저 이름이 설정된 후 이메일 체크
    useEffect(() => {

            checkEmail();
        },[]);

    const isToday = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString(); // 오늘 날짜인지 여부 반환
    };

    return (
        <Box
            sx={{
                m: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                width: '100%', // 반응형을 위한 너비 조정
                padding: '0 10px', // 양쪽에 패딩 추가
            }}
        >
            <Box
                sx={{
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    minHeight: '850px',
                    width: '100%',
                    maxWidth: '1050px',
                    padding: '40px', // 패딩을 줄여서 내용이 잘 보이도록 조정
                    overflow: 'hidden', // 요소가 넘어가면 숨김
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '-10px',
                        marginBottom: '30px',
                        fontSize: '25px',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'10px', marginBottom: '10px',
                        fontSize: '25px'}}><h1>받은 메일함</h1></Box>
                </Box>
                {error && (
                    <Box sx={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                        {error}
                    </Box>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        height: 'auto',
                        overflow: 'auto', // 스크롤이 생기도록 설정
                    }}
                >
                    <table
                        style={{
                            border: '1px solid #ddd',
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}
                    >
                        <thead>
                        <tr
                            style={{
                                backgroundColor: '#f5f5f5', // 연한 회색 배경색
                                borderBottom: '2px solid #ddd', // 구분선을 두껍게
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 약간의 음영 추가
                            }}
                        >
                            <th style={{
                                width: '80px',
                                textAlign: 'center',
                                padding: '10px',
                                fontWeight: 'bold'
                            }}>읽음
                            </th>
                            <th style={{
                                width: '500px',
                                textAlign: 'center',
                                padding: '10px',
                                fontWeight: 'bold'
                            }}>제목
                            </th>
                            <th style={{
                                width: '200px',
                                textAlign: 'center',
                                padding: '10px',
                                fontWeight: 'bold'
                            }}>발신자
                            </th>
                            <th style={{width: '200px', textAlign: 'center', padding: '10px', fontWeight: 'bold'}}>받은
                                날짜
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentEmails.map((email, index) => (
                            <tr key={index}>
                                <td style={{textAlign: 'center', padding: '10px'}}>
                                    {readEmails[index] ? <MailOpenIcon/> : <MailOutlineIcon/>}
                                </td>
                                <td
                                    style={{
                                        textAlign: 'left',
                                        padding: '10px 20px',
                                        fontWeight: readEmails[index] ? 'normal' : 'bold',
                                        whiteSpace: 'nowrap', // 긴 텍스트 줄바꿈 방지
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis', // 긴 텍스트 말줄임 표시
                                        maxWidth: '400px', // 칸의 최대 너비 설정
                                        cursor: 'pointer',

                                    }}
                                    onClick={() => showMail(email)}
                                >
                                    {email.subject}
                                </td>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '10px',
                                        fontWeight: readEmails[index] ? 'normal' : 'bold',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {email.from}
                                </td>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '10px',
                                        fontWeight: readEmails[index] ? 'normal' : 'bold',
                                        whiteSpace: 'nowrap',
                                        color: isToday(email.receivedDate) ? '#ff4b22' : 'black', // 오늘 날짜면 초록색으로 표시
                                    }}
                                >
                                    {formatDate(email.receivedDate)}
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Box>
                <Box sx={{textAlign: 'center', marginTop: '20px'}}>
                    {pageGroup > 0 && (
                        <button
                            onClick={prevPageGroup}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#ddd',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {"<"}
                        </button>
                    )}

                    {pageButtons.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: currentPage === page ? '#ffb121' : '#ddd',
                                color: currentPage === page ? 'white' : 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {page}
                        </button>
                    ))}

                    {pageGroup * pagesPerGroup + pagesPerGroup < totalPages && (
                        <button
                            onClick={nextPageGroup}
                            style={{
                                margin: '5px',
                                padding: '5px 10px',
                                backgroundColor: '#ddd',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            {">"}
                        </button>
                    )}
                </Box>
                <EmailModal open={showModal} onClose={closeModal} email={selectedEmail} />
            </Box>
        </Box>

    );
}

export default EmailList;
