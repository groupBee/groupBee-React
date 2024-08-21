import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";

const AppDocExpend = ({ handleAdditionalFieldChange }) => {
    // 요청일자, 지출유형, 최종금액, 통화 단위는 개별 상태로 유지
    const [expendType, setExpendType] = useState(0);
    const [title, setTitle] = useState('');
    const [finalPrice, setFinalPrice] = useState(0);
    const [monetaryUnit, setMonetaryUnit] = useState(0);
    const [requestDate, setRequestDate] = useState(new Date());

    // 내역을 관리하는 배열 상태, 기본적으로 10개 초기화

    const [details, setDetails] = useState(Array(9).fill(null).map(() => ({ content: '', price: '0', note: '' })));

    useEffect(() => {
        // details 배열의 price 값을 모두 더하여 finalPrice를 업데이트
        const total = details.reduce((sum, detail) => sum + Number(detail.price.replaceAll(',','')), 0);
        const formattendTotal=total.toLocaleString('ko-kR');
        setFinalPrice(formattendTotal);
        handleAdditionalFieldChange("finalPrice",formattendTotal);
    }, [details]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 기본 날짜 저장 (오늘 날짜)
        const formattedDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
        handleAdditionalFieldChange("requestDate", formattedDate);
    }, []);  // 빈 배열로 주면 컴포넌트가 처음 렌더링될 때 한 번만 실행

    const handleRequestDateChange = (date) => {
        setRequestDate(date);
        const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 변환
        handleAdditionalFieldChange("requestDate", formattedDate);
    };

    const handleExpendTypeChange = (e) => {
        setExpendType(e.target.value);
        handleAdditionalFieldChange("expendType", e.target.value);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        handleAdditionalFieldChange("title", e.target.value);
    };

    const handleMonetaryUnitChange = (e) => {
        setMonetaryUnit(parseInt(e.target.value));
        handleAdditionalFieldChange("monetaryUnit", e.target.value);
    };

    // 각 행의 데이터를 업데이트하는 함수
    const handleDetailChange = (index, field, value) => {
        const newDetails = [...details];
        if (field === 'price') {
            value = value.replaceAll(',', '');
            if (isNaN(value)) {
                value = '0';
            } else {
                value = Number(value).toLocaleString('ko-KR');
            }
        }
        newDetails[index][field] = value;
        setDetails(newDetails);
        handleAdditionalFieldChange(`details_${index}_${field}`, value);
    };

    // 행 추가 함수
    const addDetail = () => {
        setDetails((prevDetails) => {
            const updatedDetails = [...prevDetails, { content: '', price: '0', note: '' }];
            return updatedDetails;
        });
    };

    // 마지막 행 삭제 함수
    const removeLastDetail = () => {
        if (details.length > 0) {
            setDetails(details.slice(0, -1));
        }
    };

    return (
        <>
            <tr style={{ fontSize: '23px' }}>
                <td>요청일자</td>
                <td colSpan={3}>
                    <DatePicker
                        selected={requestDate}
                        onChange={handleRequestDateChange}
                        dateFormat="yyyy년 MM월 dd일"
                        className="custom-datepicker"/>
                </td>
                <td>지출유형</td>
                <td>
                    <select defaultValue={expendType} onChange={handleExpendTypeChange} name='expend_type'>
                        <option value={0}>자재비</option>
                        <option value={1}>배송비</option>
                        <option value={2}>교육비</option>
                        <option value={3}>기타</option>
                    </select>
                </td>
            </tr>
            <tr style={{ fontSize: '23px' }}>
                <td>제목</td>
                <td colSpan={7}>
                    <input type='text' value={title} name='title' onChange={handleTitleChange} style={{width:'100%'}}/>
                </td>
            </tr>
            <tr style={{ fontSize: '23px',appearance:'none'}}>
                <td>최종금액</td>

                <td colSpan={7}>
                    <input type='text' value={finalPrice} name='finalPrice'
                           style={{width: '60%', pointerEvents: 'none', outline: 'none',textAlign:'right',paddingRight:'20px'}} readOnly/>

                    <select defaultValue={monetaryUnit} onChange={handleMonetaryUnitChange} name='monetaryUnit'>
                        <option value={0}>원</option>
                        <option value={1}>달러</option>
                        <option value={2}>엔</option>
                    </select>
                </td>
            </tr>

            <tr style={{fontSize: '23px'}}>
                <td rowSpan={details.length + 1}>내역</td>
                <td colSpan={3} style={{height: '50px'}}>지출내용</td>
                <td colSpan={3}>금액</td>
                <td colSpan={2}>비고
                    <button onClick={addDetail}>+</button>
                    <button onClick={removeLastDetail}>-</button>
                </td>
            </tr>
            {details.map((detail, index) => (

                <tr key={index} style={{fontSize: '23px',appearance:'none'}}>

                    <td colSpan={3} style={{ height: '65px' }}>
                        <input
                            type='text'
                            value={detail.content}
                            name={`content-${index}`}
                            style={{width:'100%'}}
                            onChange={(e) => handleDetailChange(index, 'content', e.target.value)}
                        />
                    </td>
                    <td colSpan={3}>
                        <input
                            type='text'
                            value={detail.price}
                            name={`price-${index}`}
                            style={{width:'100%',appearance:'none',textAlign:'right',paddingRight:'20px'}}
                            onChange={(e) => handleDetailChange(index, 'price', e.target.value)}
                        />
                    </td>
                    <td colSpan={2}>
                        <input
                            type='text'
                            value={detail.note}
                            name={`note-${index}`}
                            style={{width:'100%'}}
                            onChange={(e) => handleDetailChange(index, 'note', e.target.value)}
                        />
                    </td>
                </tr>
            ))}
        </>
    )
}

export default AppDocExpend;
