import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AppDocVacation from "./AppDocVacation";
import AppDocExpend from "./AppDocExpend";
import AppDocIntent from "./AppDocIntent";
import './WriteForm.css';
import DatePicker from "react-datepicker";
import GroupModal from "../../components/groupModal.jsx";
import {useLocation, useNavigate} from "react-router-dom";

const WriteForm = ({}) => {
    const [writer, setWriter] = useState('');
    const [secondApprover, setSecondApprover] = useState('');
    const [firstApprover, setFirstApprover] = useState('');
    const [idNumber,serIdNumber]=useState('');
    const [thirdApprover, setThirdApprover] = useState('');
    const fileRef = useRef(null);
    const [originalFile, setOriginalFile] = useState(null);
    const [attachedFile, setAttachedFile] = useState('');
    const [approveStatus, setApproveStatus] = useState(0);
    const [approveType, setApproveType] = useState(1);
    const [level, setLevel] = useState(0);
    const [approveDate, setApproveDate] = useState(new Date());
    const [appDocType, setAppDocType] = useState(0);
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');
    const [additionalFields, setAdditionalFields] = useState({});
    const [errors, setErrors] = useState({});
    const [intentValidator, setIntentValidator] = useState(null);
    const [list, setList] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const appId = location.state?.itemId || ''; // 기본값 설정

    // 드래그 상태 관리
    const [isDragOver, setIsDragOver] = useState(false);

    // 모달 상태
    const [modalOpen, setModalOpen] = useState(false);
    const [currentApproverType, setCurrentApproverType] = useState(null);
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false); // 문서 로드 여부 체크

    useEffect(() => {
        if (appId) {
            getSignForm();
        } else {
            getinfo();

        }
    }, [appId]);

    useEffect(() => {
        console.log("appDocType 숫자 :", appDocType);  // appDocType이 업데이트될 때 로그 확인
    }, [appDocType]);

    // 결재 문서 데이터를 가져오는 함수
    const getSignForm = () => {
        console.log("Fetching data for appId:", appId); // 디버깅을 위한 로그
        if (appId) {
            axios.get(`/api/elecapp/findById?elecAppId=${appId}`)
                .then(res => {
                    console.log("Data fetched successfully:", res.data); // 성공적인 데이터 가져오기
                    // 날짜 필드가 유효한지 확인
                    if (isNaN(new Date(res.data.vacationStartDate)) || isNaN(new Date(res.data.vacationEndDate))) {
                        console.error("Invalid date in response data");
                    }
                    setList(res.data);
                    setAppDocType(res.data.appDocType);
                    setFirstApprover(res.data.firstApprover);
                    serIdNumber(res.data.idNumber);
                    setSecondApprover(res.data.secondApprover);
                    setThirdApprover(res.data.thirdApprover);
                    setWriter(res.data.writer);
                    setDepartment(res.data.department);
                    setPosition(res.data.position);
                    setAttachedFile(res.data.attachedFile);
                    setApproveDate(new Date(res.data.writeday));
                    setLevel(res.data.level);
                    setOriginalFile(res.data.originalFile ? { name: res.data.originalFile } : null);
                    setAdditionalFields(res.data.additionalFields || {});
                    setApproveStatus(res.data.approveStatus);
                    setIsDocumentLoaded(true); // 문서가 로드되었음을 명시
                })
                .catch(err => {
                    console.error("문서 불러오기 실패:", err); // 에러 로그
                });
        }
    };


// 기본 정보 가져오는 함수 (새 문서)
    const getinfo = () => {
        axios.get("/api/elecapp/getinfo")
            .then(res => {
                console.log(res.data)
                // 기본 사용자 정보 세팅
                setFirstApprover(res.data.name);
                setWriter(res.data.name);
                serIdNumber(res.data.idNumber);
                setDepartment(res.data.department.departmentName);
                setPosition(res.data.position.rank);

                // 빈 값으로 초기화
                setSecondApprover('');
                setThirdApprover('');
                setAttachedFile('');
                setApproveDate(new Date()); // 현재 날짜로 초기화
                setLevel(0);
                setAdditionalFields({});
                setOriginalFile('');
                setApproveStatus(null); // 새 문서는 approveStatus를 null로 설정
            })
            .catch(err => {
                console.error("기본 정보 불러오기 실패:", err);
            });
    };

    // 파일 드래그 앤 드롭 처리
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);  // 드래그 중임을 표시
    };

    const handleDragLeave = () => {
        setIsDragOver(false); // 드래그 상태 해제
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const uploadFile = e.dataTransfer.files[0];
        if (uploadFile) {
            uploadPhoto(uploadFile);
        }
    };

    // 파일 업로드 처리 함수 (드래그 앤 드롭 및 버튼 첨부 공통 처리)
    const uploadPhoto = (uploadFile) => {
        setOriginalFile(uploadFile);
        const uploadForm = new FormData();
        uploadForm.append("file", uploadFile);

        axios.post('/api/elecapp/uploadfile', uploadForm, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                setAttachedFile(res.data);
            })
            .catch(err => {
                console.error('파일 업로드 중 오류 발생:', err);
            });
    };

    // 기존 파일 첨부 버튼 클릭 처리
    const handleFileChange = (e) => {
        const uploadFile = e.target.files[0];
        if (uploadFile) {
            uploadPhoto(uploadFile);
        }
    };

    const changeAppDoc = (value) => {
        setAppDocType(value);
    }

    const handleAdditionalFieldChange = (key, value) => {
        setAdditionalFields(prevFields => ({
            ...prevFields,
            [key]: value
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!secondApprover) newErrors.secondApprover = "중간승인자를 입력하세요.";
        if (!thirdApprover) newErrors.thirdApprover = "최종승인자를 입력하세요.";
        if (!level) newErrors.level = "보안등급을 입력하세요.";

        // if (appDocType === 0 && intentValidator && !intentValidator()) {
        //     newErrors.intent = "품의서의 필수 항목을 모두 입력하세요.";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const createApp = (status) => {
        if (!validateForm()) {
            alert("필수항목을 모두 입력하세요.");
            return;
        }

        const originalFileName = originalFile ? originalFile.name : '';
        const transformedAdditionalFields = {};
        Object.keys(additionalFields).forEach(key => {
            const newKey = key.replace(/__/g, '.');
            transformedAdditionalFields[newKey] = additionalFields[key];
        });

        // 상태를 기반으로 요청 전송
        const postData = {
            writer,
            firstApprover,
            secondApprover,
            idNumber,
            thirdApprover,
            originalFile: originalFileName,
            attachedFile,
            approveStatus: status,
            appDocType,
            level,
            approveType,
            position,
            department,
            additionalFields: transformedAdditionalFields
        };

// appId가 있으면 postData에 appId를 추가
        if (appId) {
            postData.id = appId;
        }

// axios.post 호출
        axios.post('/api/elecapp/create', postData)
            .then(res => {
                console.log('성공:', res);
            })
            .catch(err => {
                console.error('오류:', err);
            })
            .then(res => {
                if(status === 1) {
                    alert("전자결재가 임시저장되었습니다.");
                } else if (status === 0) {
                    alert("전자결제가 등록되었습니다.");
                }
                navigate('/send');
            })
            .catch(err => {
                console.error('데이터 전송 중 오류 발생:', err);
            });
    }


    const openModal = (approverType) => {
        setCurrentApproverType(approverType);
        setModalOpen(true);
    };

    const handleModalSelect = (value) => {
        if (currentApproverType === 'second') {
            setSecondApprover(value.name);
        } else if (currentApproverType === 'third') {
            setThirdApprover(value.name);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'top ',
            transform: 'scale(0.8)',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '10px',
                marginBottom: '20px',
                width: '100%',
                paddingLeft: '125px',
                fontSize: '23px'
            }}>
                <Button
                    onClick={() => changeAppDoc(0)}
                    style={{
                        backgroundColor: appDocType === 0 ? '#ffb121' : '#fafaf0',
                        fontSize: '20px',
                        color: appDocType === 0 ? 'white' : '#ffb121',
                        border: '1px solid #ffb121'
                    }}>
                    품의서
                </Button>
                <Button
                    onClick={() => changeAppDoc(1)}
                    style={{
                        backgroundColor: appDocType === 1 ? '#ffb121' : '#fafaf0',
                        fontSize: '20px',
                        color: appDocType === 1 ? 'white' : '#ffb121',
                        border: '1px solid #ffb121'
                    }}>
                    휴가신청서
                </Button>
                <Button
                    onClick={() => changeAppDoc(2)}
                    style={{
                        backgroundColor: appDocType === 2 ? '#ffb121' : '#fafaf0',
                        fontSize: '20px',
                        color: appDocType === 2 ? 'white' : '#ffb121',
                        border: '1px solid #ffb121'
                    }}>
                    지출보고서
                </Button>
            </div>
            <div style={{
                backgroundColor: '#ffb121',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                height: '60px',
                width: '1400px',
                alignItems: 'center',
            }}></div>
            <div style={{
                border: 'none',
                padding: '100px 100px 100px 100px',
                backgroundColor: '#fafaf0',
                width: '1400px',
            }}>
                <table
                    style={{border: '3px solid black', backgroundColor: "white", color: 'black', textAlign: 'center'}}>
                    <tbody className='tableborder'>
                    <tr>
                        <td colSpan={4} rowSpan={3}
                            style={{fontSize: '60px'}}>{appDocType === 0 ? '품 의 서' : appDocType === 1 ? '휴 가 신 청 서' : '지 출 보 고 서'}</td>
                        <td rowSpan={3} style={{fontSize: '23px'}}>결제</td>
                        <td className="fixed-size" style={{height: '50px'}}>최초승인자</td>
                        <td className="fixed-size">중간승인자</td>
                        <td className="fixed-size">최종승인자</td>
                    </tr>
                    <tr>
                        <td className="fixed-size" style={{height: '150px'}}></td>
                        <td className="fixed-size"></td>
                        <td className="fixed-size"></td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" value={firstApprover}
                                   style={{width: '100%'}}
                                   onChange={(e) => setFirstApprover(e.target.value)} readOnly/>

                        </td>
                        <td>
                            <input type="text" value={secondApprover}
                                   onChange={(e) => setSecondApprover(e.target.value)}
                                   style={{width: '100%'}}/>
                            <Button variant="outlined" onClick={() => openModal('second')}>찾기</Button>
                            {errors.secondApprover && <div className="error">{errors.secondApprover}</div>}
                        </td>
                        <td>
                            <input type="text" value={thirdApprover} onChange={(e) => setThirdApprover(e.target.value)}
                                   style={{width: '100%'}}/>
                            <Button variant="outlined" onClick={() => openModal('third')}>찾기</Button>
                            {errors.thirdApprover && <div className="error">{errors.thirdApprover}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{minWidth: '90px', fontSize: '23px'}}>성명</td>
                        <td><input type="text"
                                   defaultValue={writer}
                                   style={{fontSize: '23px', width: '175px'}}
                                   readOnly/>
                        </td>
                        <td style={{minWidth: '70px', fontSize: '23px'}}>부서</td>
                        <td><input type="text" defaultValue={department}
                                   style={{fontSize: '23px', width: '175px'}} readOnly/>
                        </td>
                        <td style={{minWidth: '90px', fontSize: '23px'}}>직급</td>
                        <td><input type="text" defaultValue={position}
                                   style={{fontSize: '23px', width: '175px'}} readOnly/>
                        </td>
                        <td style={{minWidth: '70px', fontSize: '23px'}}>보안등급</td>
                        <td><input type="number" value={level} onChange={(e) => setLevel(e.target.value)}
                                   style={{fontSize: '23px', width: '175px'}}/>
                            {errors.level && <div className="error">{errors.level}</div>}</td>
                    </tr>
                    {appDocType === 0 &&
                        <AppDocIntent handleAdditionalFieldChange={handleAdditionalFieldChange} appId={appId}/>}
                    {appDocType === 1 &&
                        <AppDocVacation handleAdditionalFieldChange={handleAdditionalFieldChange} appId={appId}/>}
                    {appDocType === 2 &&
                        <AppDocExpend handleAdditionalFieldChange={handleAdditionalFieldChange} appId={appId}/>}
                    <tr style={{fontSize: '23px'}}>
                        <td colSpan={2}>첨부파일</td>
                        <td colSpan={6}>

                            <div
                                style={{
                                    border: 'none', padding: '10px', width: '900px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                                }}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragLeave={handleDragLeave}
                            >
                                <div
                                    style={{
                                        border: isDragOver ? '2px dashed #ffb121' : '2px dashed #ccc',
                                        padding: '10px',
                                        textAlign: 'center',
                                        color: '#888'
                                    }}
                                >
                                    {originalFile ? (
                                        <p>첨부된 파일: {originalFile.name}</p>
                                    ) : (
                                        <p>파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileRef}
                                        style={{display: 'none'}}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        onClick={() => fileRef.current.click()}
                                        style={{marginTop: '20px', backgroundColor: '#ffb121', color: 'white'}}
                                    >
                                        파일 선택
                                    </Button>
                                </div>
                            </div>
                            <input type="file" ref={fileRef} onChange={uploadPhoto} style={{display: 'none'}}/>
                        </td>
                    </tr>
                    </tbody>
                    <tbody>
                    <tr style={{fontSize: '23px'}}>
                        <td colSpan={8}>
                            <DatePicker
                                selected={approveDate}
                                onChange={(data) => setApproveDate(data)}
                                dateFormat="yyyy년 MM월 dd일"
                                style={{marginTop: '50px'}}
                            />
                        </td>
                    </tr>
                    <tr style={{fontSize: '23px'}}>
                        <td colSpan={4} style={{height: '50px'}}></td>
                        <td>서명</td>
                        <td>신청자 : {writer}</td>
                        <td></td>
                        <td>(인)</td>
                    </tr>
                    <tr>
                        <td colSpan={8}>
                            {/* 임시저장 버튼 클릭 시 approveStatus를 1로 설정 */}
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => createApp(1)} // 임시저장 시 approveStatus를 1로 설정
                            >
                                임시저장
                            </Button>

                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => createApp(0)} // 작성완료 시 approveStatus를 0으로 설정
                            >
                                작성완료
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style={{
                backgroundColor: '#ffb121',
                border: 'none',
                borderRadius: '0 0 5px 5px',
                height: '60px',
                width: '1400px',
            }}></div>
            <GroupModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleModalSelect}
            />
        </div>
    );
}

export default WriteForm;