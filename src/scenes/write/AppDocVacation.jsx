import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";

const AppDocVacation = ({ handleAdditionalFieldChange }) => {
    const [days, setDays] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [day, setDay] = useState('');
    const [type, setType] = useState('');
    const [detail,setDetail]=useState('');

    useEffect(() => {
        // 컴포넌트가 마운트될 때 기본 날짜 저장 (오늘 날짜)
        const formattedDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
        handleAdditionalFieldChange("start", formattedDate);
        handleAdditionalFieldChange("end", formattedDate);
    }, []);  // 빈 배열로 주면 컴포넌트가 처음 렌더링될 때 한 번만 실행

    // 휴가 정보 변경 시 상위 컴포넌트에 알림

    const handleStartChange = (date) => {
        setStartDate(date);
        const formattedDate = date.toISOString().split('T')[0];
        handleAdditionalFieldChange("start", formattedDate);
    };

    const handleEndChange = (date) => {
        setEndDate(date);
        const formattedDate = date.toISOString().split('T')[0];
        handleAdditionalFieldChange("end", formattedDate);
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
            <tr style={{fontSize:'23px'}}>
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
            <tr style={{fontSize:'23px'}}>
                <td colSpan={2}>휴가 기간</td>
                <td colSpan={6} style={{textAlign:'center'}}>
                    <div style={{display: 'inline-flex', alignItems: 'center', width: '100%'}}>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartChange}
                            dateFormat="yyyy년 MM월 dd일"
                            className="custom-datepickerstart"
                        />
                        <span style={{margin: '0 10px'}}>~</span>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndChange}
                            dateFormat="yyyy년 MM월 dd일"
                            className="custom-datepickerend"
                        />
                    </div>
                </td>
            </tr>
            <tr style={{fontSize: '23px'}}>
            <td colSpan={8} style={{height: '50px'}}>내 용</td>
            </tr>
            <tr style={{fontSize:'23px'}}>
                <td colSpan={8}>
                    <textarea value={detail} name='detail' onChange={handleDetailChange}
                           style={{height: '600px', width: '100%', border:'none',resize:'none'}}/>
                </td>
            </tr>
            <tr style={{fontSize:'23px'}}>
                <td colSpan={8} style={{height:'50px'}}>위와 같이 휴가을 신청하오니 허락해주시기 바랍니다.</td>
            </tr>
        </>
    );
};

export default AppDocVacation;
