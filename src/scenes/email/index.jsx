import { Button } from "react-bootstrap";
import SendMail from "./sendEmail";
import { useState } from "react";

const EmailMain=()=>{
    
    return(
        <div>
            <h1>Email</h1>
            <div>
                <Button variant="contained" color="info" >메일 보내기</Button>
                <Button variant="contained" color="warning" >메일 확인하기</Button>
            </div>
            <div>
                <SendMail/>
            </div>
            <div>

            </div>
            
        </div>
    )
}
export default EmailMain;