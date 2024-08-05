import { useState } from "react";

const AppDocVacation = ({ handleAdditionalFieldChange }) => {
    const [days, setDays] = useState(0);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [day, setDay] = useState('');
    const [type, setType] = useState('');
    const [detail,setDetail]=useState('');

    // 휴가 정보 변경 시 상위 컴포넌트에 알림

    const handleStartChange = (e) => {
        setStart(e.target.value);
        handleAdditionalFieldChange("start", e.target.value);
    };

    const handleEndChange = (e) => {
        setEnd(e.target.value);
        handleAdditionalFieldChange("end", e.target.value);
    };


    const handleTypeChange = (e) => {
        setType(e.target.value);
        handleAdditionalFieldChange("type", e.target.value);
    };

    const handleDetailChange = (e) => {
        setDetail(e.target.value);
        handleAdditionalFieldChange("detail", e.target.value);
    };
    return (
        <>
            <tr>
                <td colSpan={2}>휴가 종류</td>
                <td colSpan={6}>
                    <input type="radio" value="반차" checked={type === "반차"} onChange={handleTypeChange}
                    style={{width:'20px'}}/>반차
                    <input type="radio" value="월차" checked={type === "월차"} onChange={handleTypeChange}
                           style={{width:'20px'}}/>월차
                    <input type="radio" value="병가" checked={type === "병가"} onChange={handleTypeChange}
                           style={{width:'20px'}}/>병가
                    <input type="radio" value="기타" checked={type === "기타"} onChange={handleTypeChange}
                           style={{width:'20px'}}/>기타
                </td>
            </tr>
            <tr>
                <td colSpan={2}>휴가 기간</td>
                <td colSpan={6}>
                    <input type="date" value={start} name="start" onChange={handleStartChange}/>
                    ~<input type="date" value={end} name="end" onChange={handleEndChange}/>
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height: '50px'}}>내 용</td>
            </tr>
            <tr>
                <td colSpan={8}>
                    <input type='text' value={detail} name='detail' onChange={handleDetailChange}
                           style={{height: '600px', width: '100%'}}/>
                </td>
            </tr>
            <tr>
                <td colSpan={8} style={{height:'50px'}}>위와 같이 휴가을 신청하오니 허락해주시기 바랍니다.</td>
            </tr>
        </>
    );
};

export default AppDocVacation;
