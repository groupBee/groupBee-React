import { Box, Button } from "@mui/material";
import SendMail from "./sendEmail";
import { useEffect, useState } from "react";
import EmailList from "./emailList";
import SentEmail from "./sentEmail";
const EmailMain = () => {
    const [view, setView] = useState("send");
    const [sendMailButtonColor, setSendMailButtonColor] = useState('#f7b552');
    const [listMailButtonColor, setListMailButtonColor] = useState('#c9c5bf');
    const [sentMailButtonColor,setSentMailButtonColor]= useState('#c9c5bf');

    const handleSendMailButtonClick = () => {
        setView("send");
        setSendMailButtonColor('#f7b552');
        setListMailButtonColor('#c9c5bf');
        setSentMailButtonColor('#c9c5bf');
    };

    const handleListMailButtonClick = () => {
        setView("list");
        setSendMailButtonColor('#c9c5bf');
        setSentMailButtonColor('#c9c5bf');
        setListMailButtonColor('#f7b552');
    };
    const handlesentListMailButtonClick = () => {
        setView("sent");
        setSendMailButtonColor('#c9c5bf'); 
        setListMailButtonColor('#c9c5bf');
        setSentMailButtonColor('#f7b552');
    };

    
    
    function sendMessage(message) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.error('WebSocket is not open. Current state: ', socket.readyState);
        }
    }
    

    return (
        <Box m="20px">
            <Box height="75vh">
                <div>
                     <div>
                        <Button
                            onClick={handleSendMailButtonClick}
                            sx={{
                                backgroundColor: 'transparent',
                                color: sendMailButtonColor,
                                fontSize: '15px',
                                padding: '0',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: '#f7b552',  // hover 시 색상 변경
                                }
                            }}
                        >
                            메일 보내기
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            onClick={handleListMailButtonClick}
                            sx={{
                                backgroundColor: 'transparent',
                                color: listMailButtonColor,
                                fontSize: '15px',
                                padding: '0',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: '#f7b552',  // hover 시 색상 변경
                                }
                            }}
                        >
                            받은 메일함
                        </Button>
                         &nbsp;&nbsp;&nbsp;
                        <Button
                            onClick={handlesentListMailButtonClick}
                            sx={{
                                backgroundColor: 'transparent',
                                color: sentMailButtonColor,
                                fontSize: '15px',
                                padding: '0',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: '#f7b552',  // hover 시 색상 변경
                                }
                            }}
                        >
                            보낸 메일함
                        </Button>
                    </div>
                    <div>
                        {view === "send" && <SendMail />}
                        {view === "list" && <EmailList />}
                        {view==="sent"&&<SentEmail/>}
                    </div> 


                    
                </div>
            </Box>
        </Box>
    ); 
};

export default EmailMain;
