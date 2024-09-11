import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MailOpenIcon from '@mui/icons-material/Drafts';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";

function EmailList() {
    const [emails, setEmails] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(0);
    const emailsPerPage = 15;
    const pagesPerGroup = 5;
    const navigate = useNavigate();

    const checkEmail = async () => {
        try {
            const response = await fetch('/api/email/check', {
                method: 'get'
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
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

    const showMail = (email) => {
        // email.id가 없거나 undefined인 경우 대체 식별자 사용
        const identifier = email.id || createEmailIdentifier(email);

        const params = new URLSearchParams({
            subject: email.subject || '',
            from: email.from || '',
            to: email.to || '',
            cc: email.cc || '',
            receivedDate: email.receivedDate || '',
            content: email.content || ''
        }).toString();

        navigate(`/email/${identifier}?${params}`);
    };

    const createEmailIdentifier = (email) => {
        const date = new Date(email.receivedDate);
        return `${date.getTime()}-${email.subject.slice(0, 20).replace(/\s+/g, '-')}`;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const nextPageGroup = () => {
        setPageGroup(pageGroup + 1);
        setCurrentPage(pageGroup * pagesPerGroup + pagesPerGroup + 1);
    };

    const prevPageGroup = () => {
        if (pageGroup > 0) {
            setPageGroup(pageGroup - 1);
            setCurrentPage(pageGroup * pagesPerGroup);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return new Intl.DateTimeFormat('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(date);
        }

        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const isToday = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    useEffect(() => {
        checkEmail();
    }, []);

    const indexOfLastEmail = currentPage * emailsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
    const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

    const totalPages = Math.ceil(emails.length / emailsPerPage);

    const pageButtons = Array.from(
        { length: Math.min(pagesPerGroup, totalPages - pageGroup * pagesPerGroup) },
        (_, i) => pageGroup * pagesPerGroup + i + 1
    );

    return (
        <Box sx={{ m: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0 10px' }}>
            <Paper sx={{ width: '100%', maxWidth: '1050px', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>받은 메일함</h1>
                </Box>
                {error && <Box sx={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</Box>}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell align="center" width="80px">읽음</TableCell>
                                <TableCell align="center" width="500px">제목</TableCell>
                                <TableCell align="center" width="200px">발신자</TableCell>
                                <TableCell align="center" width="200px">받은 날짜</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentEmails.map((email) => (
                                <TableRow
                                    key={email.id || createEmailIdentifier(email)}
                                    onClick={() => showMail(email)}
                                    sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}
                                >
                                    <TableCell align="center">
                                        {email.isRead ? <MailOpenIcon /> : <MailOutlineIcon />}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: email.isRead ? 'normal' : 'bold' }}>
                                        {email.subject}
                                    </TableCell>
                                    <TableCell align="center">{email.from}</TableCell>
                                    <TableCell align="center" sx={{ color: isToday(email.receivedDate) ? '#ff4b22' : 'black' }}>
                                        {formatDate(email.receivedDate)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
            </Paper>
        </Box>
    );
}

export default EmailList;