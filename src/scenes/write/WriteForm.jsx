import { Button } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import AppDocVacation from "./AppDocVacation";
import AppDocExpend from "./AppDocExpend";
import AppDocIntent from "./AppDocIntent";
import NewAppDocType from "./NewAppDocType";
import '../css/WriteForm.css';

const WriteForm = () => {
    const [writer, setWriter] = useState('');
    const [secondApprover, setSecondApprover] = useState('');
    const [firstApprover, setFirstApprover] = useState('');
    const [thirdApprover, setThirdApprover] = useState('');
    const fileRef = useRef(null);
    const [originalFile, setOriginalFile] = useState(null);
    const [attachedFile, setAttachedFile] = useState('');
    const [approveStatus, setApproveStatus] = useState(0);
    const [approveType, setApproveType] = useState(2);
    const [level, setLevel] = useState(0);
    const [approveDate, setApproveDate] = useState('');
    const [appDocType, setAppDocType] = useState(0);
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');
    const [additionalFields, setAdditionalFields] = useState({});

    const uploadPhoto = (e) => {
        const uploadFile = e.target.files[0];
        setOriginalFile(uploadFile);
        const uploadForm = new FormData();
        uploadForm.append("file", uploadFile);
        axios.post('/elecapp/uploadfile', uploadForm, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then(res => {
            console.log(res.data);
            setAttachedFile(res.data);
        })
        .catch(err => {
            console.error('파일 업로드 중 오류 발생:', err);
        });
    }

    const changeAppDoc = (value) => {
        setAppDocType(value);
    }

    const handleAdditionalFieldChange = (key, value) => {
        setAdditionalFields(prevFields => ({
            ...prevFields,
            [key]: value
        }));
    };

    const createApp = () => {
        const originalFileName = originalFile ? originalFile.name : '';

        // additionalFields의 키에서 '__'를 '.'으로 변환
        const transformedAdditionalFields = {};
        Object.keys(additionalFields).forEach(key => {
            const newKey = key.replace(/__/g, '.');
            transformedAdditionalFields[newKey] = additionalFields[key];
        });

        axios.post('/elecapp/create', {
            writer, firstApprover, secondApprover, thirdApprover,
            originalFile: originalFileName, attachedFile, approveStatus, appDocType, level,
            approveType, position, department, additionalFields
        })
            .then(res => {
                alert("성공");
            })
            .catch(err => {
                console.error('데이터 전송 중 오류 발생:', err);
            });
    }

    return (
        <div>
            <div class='diamond'>
            </div>
            <div style={{border:'none', padding:'100px 100px 100px 100px',backgroundColor:'#fafaf0'}}>
            <table style={{border: '3px solid black', backgroundColor: "white", color: 'black', textAlign: 'center'}}>
                <caption align='top' style={{paddingBottom:'20ox'}}>
                    <button onClick={() => changeAppDoc(0)}
                            style={{backgroundColor: appDocType === 0 ? '#ffb121' : ''}}>
                        품의서
                    </button>
                    <button onClick={() => changeAppDoc(1)}
                            style={{backgroundColor: appDocType === 1 ? '#ffb121' : ''}}>
                        휴가신청서
                    </button>
                    <button onClick={() => changeAppDoc(2)}
                            style={{backgroundColor: appDocType === 2 ? '#ffb121' : ''}}>
                        지출보고서
                    </button>
                </caption>
                <tbody className='tableborder'>
                <tr>
                    <td colSpan={4} rowSpan={3}
                        style={{fontSize: '60px'}}>{appDocType === 0 ? '품 의 서' : appDocType === 1 ? '휴 가 신 청 서' : '지 출 보 고 서'}</td>
                    <td rowSpan={3} style={{fontSize: '23px'}}>결제</td>
                    <td style={{height: '50px', fontSize: '23px'}}>최초승인자</td>
                    <td style={{fontSize: '23px'}}>중간승인자</td>
                    <td style={{fontSize: '23px'}}>최종승인자</td>
                </tr>
                <tr>
                    <td style={{height: '150px'}}></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <input type="text" value={firstApprover} onChange={(e) => setFirstApprover(e.target.value)}/>
                    </td>
                    <td>
                        <input type="text" value={secondApprover} onChange={(e) => setSecondApprover(e.target.value)}/>
                    </td>
                    <td>
                        <input type="text" value={thirdApprover} onChange={(e) => setThirdApprover(e.target.value)}/>
                    </td>
                </tr>
                <tr>
                    <td style={{width: '70px', fontSize: '23px'}}>성명</td>
                    <td><input type="text" value={writer} onChange={(e) => setWriter(e.target.value)}
                               style={{fontSize: '23px', width: '175px'}}/></td>
                    <td style={{width: '70px', fontSize: '23px'}}>부서</td>
                    <td><input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                               style={{fontSize: '23px', width: '175px'}}/></td>
                    <td style={{width: '70px', fontSize: '23px'}}>직급</td>
                    <td><input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
                               style={{fontSize: '23px', width: '175px'}}/></td>
                    <td style={{width: '70px', fontSize: '23px'}}>보안등급</td>
                    <td><input type="number" value={level} onChange={(e) => setLevel(e.target.value)}
                               style={{fontSize: '23px', width: '175px'}}/></td>
                </tr>
                {appDocType === 0 && <AppDocIntent handleAdditionalFieldChange={handleAdditionalFieldChange}/>}
                {appDocType === 1 && <AppDocVacation handleAdditionalFieldChange={handleAdditionalFieldChange}/>}
                {appDocType === 2 && <AppDocExpend handleAdditionalFieldChange={handleAdditionalFieldChange}/>}
                {appDocType > 2 && <NewAppDocType handleAdditionalFieldChange={handleAdditionalFieldChange}/>}
                <tr style={{fontSize: '23px'}}>
                    <td colSpan={2}>첨부파일</td>
                    <td colSpan={6}><input type="file" ref={fileRef} onChange={uploadPhoto}/></td>
                </tr>
                </tbody>
                <tbody>
                <tr style={{fontSize: '23px'}}>
                    <td colSpan={8}><input type="date" value={approveDate}
                                           onChange={(e) => setApproveDate(e.target.value)}
                                           style={{marginTop: '50px'}}/></td>
                </tr>
                <tr style={{fontSize: '23px'}}>
                    <td colSpan={4} style={{height: '50px'}}></td>
                    <td>서명</td>
                    <td>신청자 :</td>
                    <td></td>
                    <td>(인)</td>
                </tr>
                <tr>
                    <td colSpan={8}>
                        <Button variant="outlined" color="warning" onClick={() => setApproveStatus('1')}>임시저장</Button>
                        <Button variant="outlined" color="warning" onClick={createApp}>작성완료</Button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default WriteForm;
