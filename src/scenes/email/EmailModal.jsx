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
                        width: '1100px',
                        height: '600px',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ mt: 2 }}>
                        <strong>수신일: </strong> {this.formatDate(email.receivedDate)}
                    </Typography>
                    <Typography id="modal-title" variant="h6" component="h2">
                        <strong>제  목 :</strong> {email.subject}
                    </Typography>
                    <Typography id="modal-description">
                        <strong>수 신 :</strong> {email.to}
                    </Typography>
                    <Typography id="modal-description">
                        <strong>참 조 :</strong> {email.cc}
                    </Typography>
                    <Typography id="modal-description">
                        <strong>발 신 :</strong> {email.from}
                        <Button
                            variant="contained"
                            style={{ float: 'right' }}
                            onClick={this.handleReply}
                        >
                            답장하기
                        </Button>
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
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
