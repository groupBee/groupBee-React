import React, { Component } from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

class EmailModal extends Component {
    formatDate(dateString) {
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
    }

    handleReply = () => {
        const { email } = this.props;
        const encodedContent = encodeURIComponent(email.content);
        const encodedSubject = encodeURIComponent(email.subject);
        const encodedReceivedDate = encodeURIComponent(email.receivedDate);
        const encodedTo = encodeURIComponent(email.to);
        const encodedCc = encodeURIComponent(email.cc);
        const encodedFrom = encodeURIComponent(email.from);
        const replyText = "=========================Original mail =========================";

        window.location.href = `/email?email=${encodedFrom}&content=${encodedContent}&replyText=${encodeURIComponent(replyText)}&subject=${encodedSubject}&receivedDate=${encodedReceivedDate}&to=${encodedTo}&cc=${encodedCc}`;    }

    render() {
        const { open, onClose, email } = this.props;

        if (!email) return null;

        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '900px', // 크기를 살짝 조정하여 더 적절하게
                        height: 'auto', // 높이를 내용에 맞추어 자동 조정
                        bgcolor: 'background.paper',
                        borderRadius: '10px', // 테두리를 둥글게
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // 더 부드러운 그림자 효과
                        p: 4,
                        overflowY: 'auto', // 내용이 넘칠 경우 스크롤
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', top: 16, right: 16, color: '#555' }} // 색상을 회색으로
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        id="modal-title"
                        variant="h5"
                        component="h2"
                        sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }} // 중앙 정렬, 굵은 글씨
                    >
                        {email.subject}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        <strong>수신일: </strong> {this.formatDate(email.receivedDate)}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                        <strong>수신: </strong> {email.to}
                    </Typography>
                    {email.cc && (
                        <Typography sx={{ mb: 1 }}>
                            <strong>참조: </strong> {email.cc}
                        </Typography>
                    )}
                    <Typography sx={{ mb: 1 }}>
                        <strong>발신: </strong> {email.from}
                        <Button
                            variant="contained"
                            sx={{ float: 'right', bgcolor: '#00B065', color: 'white'}} // 버튼 색상과 위치 조정
                            onClick={this.handleReply}
                        >
                            답장하기
                        </Button>
                    </Typography>

                    <Typography sx={{ mt: 2, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        <hr />
                        <strong>내용:</strong> <br />
                        {email.content}
                    </Typography>
                </Box>
            </Modal>

        );
    }
}

export default EmailModal;
