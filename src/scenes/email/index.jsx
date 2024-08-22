import {Box,Button} from "@mui/material";
import SendMail from "./sendEmail";
import { useState } from "react";
import EmailList from "./emailList";
import {Header} from "../../components/index.jsx";

const EmailMain = () => {
    const [view, setView] = useState("send");
    const [sendMailButtonColor, setSendMailButtonColor] = useState('#f7b552');
    const [listMailButtonColor, setListMailButtonColor] = useState('#c9c5bf');

    const handleSendMailButtonClick = () => {
        setView("send");
        setSendMailButtonColor('#f7b552');
        setListMailButtonColor('#c9c5bf');
    };

    const handleListMailButtonClick = () => {
        setView("list");
        setSendMailButtonColor('#c9c5bf');
        setListMailButtonColor('#f7b552');
    };

    return (
        <Box m="20px">
            <Box height="75vh">
                <div>
                    <div>
                        <Button
                            variant='contained'
                            sx={{ backgroundColor: sendMailButtonColor }}
                            onClick={handleSendMailButtonClick}
                            style={{fontSize:'15px'}}
                        >
                            메일 보내기
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: listMailButtonColor }}
                            onClick={handleListMailButtonClick}
                            style={{fontSize:'15px'}}
                        >
                            받은 메일함
                        </Button>
                    </div>
                    <div>
                        {view === "send" && <SendMail />}
                        {view === "list" && <EmailList />}
                    </div>
                </div>
            </Box>
        </Box>
    );
};

export default EmailMain;
