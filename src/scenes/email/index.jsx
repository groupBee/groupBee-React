import { Button } from "react-bootstrap";
import SendMail from "./sendEmail";
import { useState } from "react";
import EmailList from "./emailList";

const EmailMain = () => {
    const [view, setView] = useState("none");

    return (
        <div>
            <h1>Email</h1>
            <div>
                <Button variant="contained" color="info" onClick={() => setView("send")}>
                    메일 보내기
                </Button>
                <Button variant="contained" color="warning" onClick={() => setView("list")}>
                    메일 확인하기
                </Button>
            </div>
            <div>
                {view === "send" && <SendMail />}
                {view === "list" && <EmailList />}
            </div>
        </div>
    );
};

export default EmailMain;
