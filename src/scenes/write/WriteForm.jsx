import {Box, Button, Typography} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AppDocVacation from "./AppDocVacation";
import AppDocExpend from "./AppDocExpend";
import AppDocIntent from "./AppDocIntent";
import './WriteForm.css';
import DatePicker from "react-datepicker";
import GroupModal from "../../components/groupModal.jsx";
import { useLocation, useNavigate } from "react-router-dom";

const WriteForm = ({ }) => {
    const [writerIdNumber, setWriterIdNumber] = useState('');
    const [writer, setWriter] = useState('');
    const [secondApprover, setSecondApprover] = useState('');
    const [firstApprover, setFirstApprover] = useState('');
    const [idNumber, serIdNumber] = useState('');
    const [thirdApprover, setThirdApprover] = useState('');
    const fileRef = useRef(null);
    const [originalFiles, setOriginalFiles] = useState([]);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [approveStatus, setApproveStatus] = useState(0);
    const [approveType, setApproveType] = useState(1);
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


    // 결재 문서 데이터를 가져오는 함수
    const getSignForm = () => {
        if (appId) {
            axios.get(`/api/elecapp/findById?elecAppId=${appId}`)
                .then(res => {
                    setList(res.data);
                    setAppDocType(res.data.appDocType);
                    setFirstApprover(res.data.firstApprover);
                    serIdNumber(res.data.idNumber);
                    setSecondApprover(res.data.secondApprover);
                    setThirdApprover(res.data.thirdApprover);
                    setWriterIdNumber(res.data.idNumber);
                    setWriter(res.data.writer);
                    setDepartment(res.data.department);
                    setPosition(res.data.position);
                    setAttachedFiles(res.data.attachedFiles || []);
                    setOriginalFiles(res.data.originalFiles || []);
                    setApproveDate(new Date(res.data.writeday));
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
                setFirstApprover(res.data.name);
                setWriter(res.data.name);
                serIdNumber(res.data.idNumber);
                setDepartment(res.data.department.departmentName);
                setPosition(res.data.position.rank);
                setWriterIdNumber(res.data.idNumber);
                setSecondApprover('');
                setThirdApprover('');
                setAttachedFiles([]);
                setOriginalFiles([]);
                setApproveDate(new Date());

                setAdditionalFields({});
                setApproveStatus(null);
            })
            .catch(err => {
                console.error("기본 정보 불러오기 실패:", err);
            });
    };

    // 파일 드래그 앤 드롭 처리
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true); 
    };

    const handleDragLeave = () => {
        setIsDragOver(false); 
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadPhotos(files);
        }
    };

    // 파일 업로드 처리 함수 (드래그 앤 드롭 및 버튼 첨부 공통 처리)
    const uploadPhotos = (uploadFiles) => {
        const uploadForm = new FormData();

        uploadFiles.forEach((file) => {
            uploadForm.append(`files`, file);
        });

        axios.post('/api/elecapp/uploadfile', uploadForm, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(res => {
                // 업로드된 파일 정보를 상태에 추가
                setOriginalFiles(prevFiles => [...prevFiles, ...uploadFiles.map(file => file.name)]);
                setAttachedFiles(prevFiles => [...prevFiles, ...res.data]);
            })
            .catch(err => {
                console.error('파일 업로드 중 오류 발생:', err);
            });
    };

    // 파일 제거 처리
    const handleRemoveFile = (index) => {
        setOriginalFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setAttachedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            uploadPhotos(files);
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


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createApp = (status) => {
        if(status!==1){
        if (!validateForm()) {
            alert("필수항목을 모두 입력하세요.");
            return;
        }
    }
        const transformedAdditionalFields = {};
        Object.keys(additionalFields).forEach(key => {
            const newKey = key.replace(/__/g, '.');
            transformedAdditionalFields[newKey] = additionalFields[key];
        });
        const postData = {
            writer,
            writerIdNumber,
            firstApprover,
            secondApprover,
            idNumber,
            thirdApprover,
            originalFiles, // 파일 이름 배열
            attachedFiles, // 서버에서 반환된 파일 경로 배열
            approveStatus: status,
            appDocType,
            approveType,
            position,
            department,
            additionalFields: transformedAdditionalFields
        };

        if (appId) {
            postData.id = appId;
        }

        axios.post('/api/elecapp/create', postData)
            .then(res => {
                console.log('성공:', res);
            })
            .catch(err => {
                console.error('오류:', err);
            })
            .then(res => {
                if (status === 1) {
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
        // 결재자가 1명 이상 선택된 경우 경고 메시지 출력
        if (value.length > 1) {
            alert('결재자는 한 명만 선택할 수 있습니다.');
            return;
        }
    
        // value가 배열로 온다고 가정하고, 첫 번째 항목만 사용
        const selectedPerson = value[0];
    
        // 본인 체크: 선택된 사람이 작성자(writer)와 같으면 경고 메시지를 띄움
        if (selectedPerson.name === writer) {
            alert('본인은 승인자로 지정할 수 없습니다.');
            return;
        }
    
        // 승인자 중복 체크: secondApprover와 thirdApprover가 같으면 경고
        if (currentApproverType === 'second' && selectedPerson.name === thirdApprover) {
            alert('중간 승인자와 최종 승인자는 같을 수 없습니다.');
            return;
        }
    
        if (currentApproverType === 'third' && selectedPerson.name === secondApprover) {
            alert('최종 승인자와 중간 승인자는 같을 수 없습니다.');
            return;
        }
    
        // 현재 승인자 타입에 따라 승인자 설정
        if (currentApproverType === 'second') {
            setSecondApprover(selectedPerson.name);
        } else if (currentApproverType === 'third') {
            setThirdApprover(selectedPerson.name);
        }
    };
    

    return (
        <Box m="20px">
            <Box
                sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    height: "100%"
                }}
            >
                <Box borderBottom={`2px solid #ffb121`} p="20px">
                    <Typography
                        color="black"
                        variant="h5"
                        fontWeight="600"
                        fontSize="30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    > 발신목록
                        <div style={{
                            display: 'flex',
                            gap: '8px'
                        }}>
                            <Button
                                onClick={() => changeAppDoc(0)}
                                style={{
                                    backgroundColor: appDocType === 0 ? '#ffb121' : '#fafaf0',
                                    fontSize: '15px',
                                    color: appDocType === 0 ? 'white' : '#ffb121',
                                    border: '1px solid #ffb121'
                                }}>
                                품의서
                            </Button>
                            <Button
                                onClick={() => changeAppDoc(1)}
                                style={{
                                    backgroundColor: appDocType === 1 ? '#ffb121' : '#fafaf0',
                                    fontSize: '15px',
                                    color: appDocType === 1 ? 'white' : '#ffb121',
                                    border: '1px solid #ffb121'
                                }}>
                                휴가신청서
                            </Button>
                            <Button
                                onClick={() => changeAppDoc(2)}
                                style={{
                                    backgroundColor: appDocType === 2 ? '#ffb121' : '#fafaf0',
                                    fontSize: '15px',
                                    color: appDocType === 2 ? 'white' : '#ffb121',
                                    border: '1px solid #ffb121'
                                }}>
                                지출보고서
                            </Button>
                        </div>
                    </Typography>
                </Box>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: 'scale(0.8)',
                }}>
                    <div style={{
                        backgroundColor: '#ffb121',
                        border: 'none',
                        borderRadius: '5px 5px 0 0',
                        height: '60px',
                        width: '96%',
                        alignItems: 'center',
                    }}></div>
                    <div style={{
                        border: 'none',
                        padding: '70px',
                        alignItems:'center',
                        display:'flex',
                        justifyContent:'center',
                        backgroundColor: '#fafaf0',
                        width: '96%',
                    }}>
                        <table
                            style={{
                                border: '3px solid black',
                                backgroundColor: "white",
                                color: 'black',
                                textAlign: 'center'
                            }}>
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
                                <input type="text" value={firstApprover} disabled
                                    style={{ width: '100%' }}
                                    onChange={(e) => setFirstApprover(e.target.value)} readOnly />

                            </td>
                            <td>
                                <input type="text" value={secondApprover} disabled
                                    onChange={(e) => setSecondApprover(e.target.value)}
                                    style={{ width: '100%' }} />
                                <Button variant="outlined" onClick={() => openModal('second')}>찾기</Button>
                                {errors.secondApprover && <div className="error">{errors.secondApprover}</div>}
                            </td>
                            <td>
                                <input type="text" value={thirdApprover} disabled onChange={(e) => setThirdApprover(e.target.value)}
                                    style={{ width: '100%' }} />
                                <Button variant="outlined" onClick={() => openModal('third')}>찾기</Button>
                                {errors.thirdApprover && <div className="error">{errors.thirdApprover}</div>}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ minWidth: '90px', fontSize: '23px' }}>성명</td>
                            <td><input type="text"
                                defaultValue={writer}
                                style={{ fontSize: '23px', width: '175px' }}
                                readOnly />
                            </td>
                            <td style={{ minWidth: '70px', fontSize: '23px' }}>부서</td>
                            <td><input type="text" defaultValue={department}
                                style={{ fontSize: '23px', width: '175px' }} readOnly />
                            </td>
                            <td></td>
                            <td  style={{ minWidth: '90px', fontSize: '23px' }}>직급</td>
                            <td colSpan={2}><input type="text" defaultValue={position}
                                style={{ fontSize: '23px', width: '175px' }} readOnly />
                            </td>

                       
                        </tr>
                        {appDocType === 0 &&
                            <AppDocIntent handleAdditionalFieldChange={handleAdditionalFieldChange} days={additionalFields.leaveDays} appId={appId} />}
                        {appDocType === 1 &&
                            <AppDocVacation handleAdditionalFieldChange={handleAdditionalFieldChange} appId={appId} />}
                        {appDocType === 2 &&
                            <AppDocExpend handleAdditionalFieldChange={handleAdditionalFieldChange} appId={appId} />}
                        <tr style={{ fontSize: '23px' }}>
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
                                        {originalFiles.length > 0 ? (
                                            <ul>
                                                {originalFiles.map((fileName, index) => (
                                                    <li key={index}>
                                                        {fileName}
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => handleRemoveFile(index)}
                                                            style={{ marginLeft: '10px' }}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>파일을 여기에 드래그하거나 클릭하여 업로드하세요.</p>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                            multiple // 여러 파일 선택 가능
                                        />
                                        <Button
                                            onClick={() => fileRef.current.click()}
                                            style={{ marginTop: '20px', backgroundColor: '#ffb121', color: 'white' }}
                                        >
                                            파일 선택
                                        </Button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr style={{ fontSize: '23px' }}>
                            <td colSpan={8}>
                                <DatePicker
                                    selected={approveDate}
                                    onChange={(data) => setApproveDate(data)}
                                    dateFormat="yyyy년 MM월 dd일"
                                    style={{ marginTop: '50px' }}
                                />
                            </td>
                        </tr>
                        <tr style={{ fontSize: '23px' }}>
                            <td colSpan={4} style={{ height: '50px' }}></td>
                            <td>서명</td>
                            <td>신청자 : {writer}</td>
                            <td></td>
                            <td>(인)</td>
                        </tr>
                        <tr>
                            <td colSpan={8}>
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => createApp(1)} 
                                >
                                    임시저장
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => createApp(0)} 
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
                width: '96%',
            }}></div>
            <GroupModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={handleModalSelect}
            />
        </div>
                </Box>
                </Box>
    );
}

export default WriteForm;
