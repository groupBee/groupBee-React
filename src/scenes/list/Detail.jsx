import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../write/WriteForm.css';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import DatePicker from "react-datepicker";


const Detail = () => {
    const location = useLocation();
    const { memberId, itemId } = location.state || {}; // state에서 memberId와 itemId 추출
    const [rejectionReason, setRejectionReason] = useState('');
    const [list, setList] = useState({});
    const [details, setDetails] = useState(Array(9).fill(null).map(() => ({ content: '', price: '0', note: '' })));
    const [open, setOpen] = useState(false);
    const navi = useNavigate();
    const [appId, setAppId] = useState(itemId); // appId를 itemId로 초기화
    const [appDocType, setAppDocType] = useState(null); // appDocType 상태 추가
    const [approvalStatus, setApprovalStatus] = useState('');
    const [imageSrc, setImageSrc] = useState(null); // 추가된 이미지 상태
    const [openRejectionDetail, setOpenRejectionDetail] = useState(false);
    const [originalFiles, setOriginalFiles] = useState([]);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [rejectedPerson, setRejectedPerson] = useState('')
    // 결재 문서 데이터를 가져오는 함수
    const getSignForm = useCallback(() => {
        axios.get(`/api/elecapp/findById?elecAppId=${appId}`)
            .then(res => {
                setList(res.data);
                setOriginalFiles(res.data.additionalFields.originalFiles);
                setAttachedFiles(res.data.additionalFields.attachedFiles);
                setAppDocType(res.data.appDocType);
                if (res.data.approveType === 0) {
                    setRejectedPerson(res.data.rejectedPerson);
                }

                console.log(res.data);
            })
            .catch(err => {
                console.error("문서 불러오기 실패:", err);
            });
    }, [appId]);


    const getMinioFileUrl = (fileName) => {
        if (!fileName) return '';
        return `https://minio.bmops.kro.kr/groupbee/elec_app/${fileName}`;
    };

    const approveimg = () => {
        return `https://minio.bmops.kro.kr/groupbee/elec_app/d97c5383-9fff-483c-9cda-37bbf92e5bea`;
    }

    const approveimg2 = () => {
        return `https://minio.bmops.kro.kr/groupbee/elec_app/599eea51-7f30-4356-9b6f-89f208aac46c`;
    }

    // 첨부파일 다운로드 함수 추가
    const onClickImgLink = useCallback((srcUrl, name) => {
        fetch(getMinioFileUrl(srcUrl), { method: 'GET' }) // 여기서 getMinioFileUrl(list.attachedFile)을 사용
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; // Blob URL을 사용
                a.download = name; // 파일의 이름 설정
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url); // URL 해제
                }, 1000);
                a.remove(); // a 태그 제거
            })
            .catch(err => {
                console.error('파일 다운로드 실패:', err);
            });
    }, []);

    useEffect(() => {
        if (memberId && appId) {
            getSignForm();
        }
    }, [memberId, appId]);

    // "yyyy년 MM월 dd일" 형식으로 날짜를 포맷하는 함수
    const formatDateToKorean = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };

    const handleRejectionOpen = () => {
        setOpen(true);
    };

    const handleRejectionClose = () => {
        setOpen(false);
    };

    const handleRejectionSubmit = () => {
        console.log("Rejection Reason:", rejectionReason);
        axios.post('/api/elecapp/rejection', null, {
            params: {
                elecAppId: appId,
                rejectionReason: rejectionReason,
                rejectedPerson: memberId
            }
        })
            .then(res => {
                setOpen(false);
                alert('반려되었습니다.');
                navi('/list'); // 반려 후 메인 페이지로 이동
            })
            .catch(err => {
                console.error("Rejection failed:", err);
            });
    };
    // 반려 사유 버튼 클릭 시 사유를 설정하고 다이얼로그 열기
    const handleRejectionDetailOpen = () => {
        // setRejectionDetail(rejectionReasonMap[approverType] || '반려 사유가 없습니다.');
        setOpenRejectionDetail(true);
    };

    const handleRejectionDetailClose = () => {
        setOpenRejectionDetail(false);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 승인 클릭
    const acception = () => {
        let a = window.confirm('결재를 승인하시겠습니까?');
        if (a) {
            axios.post('/api/elecapp/chageAppType', { elecAppId: appId })
                .then(res => {
                    alert('승인되었습니다.');
                    getSignForm();
                    navi('/list');
                })
                .catch(err => {
                    console.error("Approval failed:", err);
                });
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
                backgroundColor: '#ffb121',
                border: 'none',
                borderRadius: '5px 5px 0 0',
                height: '60px',
                width: '1400px',
            }}></div>
            <div style={{
                border: 'none',
                padding: '100px 100px 100px 100px',
                backgroundColor: '#fafaf0',
                width: '1400px',
            }}>
                <table style={{ border: '3px solid black', backgroundColor: "white", color: 'black', textAlign: 'center' }}>
                    <tbody className='tableborder'>
                        <tr>
                            <td colSpan={4} rowSpan={3} style={{ fontSize: '60px' }}>
                                {appDocType === 0 ? '품 의 서' : appDocType === 1 ? '휴 가 신 청 서' : '지 출 보 고 서'}
                            </td>
                            <td rowSpan={3} style={{ fontSize: '23px' }}>결제</td>
                            <td className="fixed-size" style={{ height: '50px' }}>최초승인자</td>
                            <td className="fixed-size">중간승인자</td>
                            <td className="fixed-size" style={{ maxWidth: '200px' }}>최종승인자</td>
                        </tr>
                        <tr>
                            <td style={{ height: '150px' }}>
                                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                    {list.approveStatus === 0 ? (<img src={approveimg()} style={{ width: '100px', height: '100px' }} />) : ''}
                                </div>
                            </td>
                            <td>

                                {
                                    list.approveType === 0 && list.secondApprover != rejectedPerson ?
                                        (
                                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                                <img src={approveimg()} style={{ width: '100px', height: '100px' }} />
                                            </div>
                                        ) :
                                        list.approveType === 0 && list.secondApprover == rejectedPerson ? (
                                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                                <img src={approveimg2()} style={{ width: '100px', height: '100px' }} />
                                                <Button variant='outlined' color='warning' onClick={() => handleRejectionDetailOpen('second')}>
                                                    중간 승인자 반려 사유
                                                </Button>
                                            </div>
                                        ) :
                                            list.approveType > 1 ? (
                                                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                                    <img src={approveimg()} style={{ width: '100px', height: '100px' }} />
                                                </div>
                                            ) :
                                                list.approveType === 1 && memberId === list.secondApprover ? (
                                                    <>
                                                        <Button variant='outlined' color='warning' onClick={acception}>승인</Button>
                                                        <Button variant='outlined' color='warning' onClick={handleRejectionOpen}>반려</Button>
                                                    </>
                                                ) : ''
                                }

                            </td>
                            <td>
                                {
                                    list.approveType === 0 && list.thirdApprover == rejectedPerson ? (
                                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                            <img src={approveimg2()} style={{ width: '100px', height: '100px' }} />
                                            <Button variant='outlined' color='warning' onClick={() => handleRejectionDetailOpen('second')}>
                                                중간 승인자 반려 사유
                                            </Button>
                                        </div>
                                    ) :
                                        list.approveType > 2 ? (
                                            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                                                <img src={approveimg()} style={{ width: '100px', height: '100px' }} />
                                            </div>
                                        ) :
                                            list.approveType === 2 && memberId === list.thirdApprover ? (
                                                <>
                                                    <Button variant='outlined' color='warning' onClick={acception}>승인</Button>
                                                    <Button variant='outlined' color='warning' onClick={handleRejectionOpen}>반려</Button>
                                                </>
                                            ) :
                                                list.approveType === 0 && list.thirdApprover != rejectedPerson ?
                                                    (
                                                        ''
                                                    ) : ''

                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="stampFirst" style={{ fontSize: '23px', height: '50px' }}>{list.firstApprover}</td>
                            <td className="stampSecond" style={{ fontSize: '23px' }}>{list.secondApprover}</td>
                            <td className="stampThird" style={{ fontSize: '23px' }}>{list.thirdApprover}</td>
                        </tr>
                        <tr>
                            <td style={{ minWidth: '90px', fontSize: '23px' }}>성명</td>
                            <td style={{ fontSize: '23px', width: '175px', outline: 'none', height: '50px' }}>{list.writer}</td>
                            <td style={{ minWidth: '70px', fontSize: '23px' }}>부서</td>
                            <td style={{ fontSize: '23px', width: '175px', outline: 'none' }}>{list.department}</td>
                            <td style={{ minWidth: '90px', fontSize: '23px' }}>직급</td>
                            <td style={{ fontSize: '23px', width: '175px', outline: 'none' }}>{list.position}</td>
                    
                        </tr>
                        {/* 문서 유형에 따른 상세 내용 */}
                        {
                            appDocType === 0 ? (
                                <>
                                    <tr>
                                        <td style={{ fontSize: '23px' }}>제목</td>
                                        <td colSpan={7} style={{ height: '50px', textAlign: 'left', paddingLeft: '20px', fontSize: '23px' }}>
                                            {list.additionalFields?.title || ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} style={{ height: '50px', fontSize: '23px' }}>품의내용</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8}>
                                            <textarea value={list.additionalFields?.content || ''}
                                                style={{ height: '650px', width: '100%', fontSize: '23px', border: 'none', resize: 'none', outline: 'none' }} readOnly />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={8} style={{ height: '50px', fontSize: '23px' }}>
                                            위와 같이 품의사유로 검토 후 결제 바랍니다.
                                        </td>
                                    </tr>
                                </>
                            ) : appDocType === 1 ? (
                                <>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td colSpan={2}>휴가 종류</td>
                                        <td colSpan={6}>
                                            <input type="radio" value="반차" checked={list.additionalFields?.type === "반차"}
                                                style={{ width: '20px' }} readOnly />반차
                                            <input type="radio" value="월차" checked={list.additionalFields?.type === "월차"}
                                                style={{ width: '20px' }} readOnly />월차
                                            <input type="radio" value="병가" checked={list.additionalFields?.type === "병가"}
                                                style={{ width: '20px' }} readOnly />병가
                                            <input type="radio" value="기타" checked={list.additionalFields?.type === "기타"}
                                                style={{ width: '20px' }} readOnly />기타
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td colSpan={2}>휴가 기간</td>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', width: '100%' }}>
                                                <DatePicker
                                                    value={formatDateToKorean(list.additionalFields?.start) || ''}
                                                    dateFormat="yyyy년 MM월 dd일"
                                                    className="custom-datepickerstart"
                                                    readOnly
                                                />
                                                <span style={{ marginRight: '-115px' }}>~</span>
                                                <DatePicker
                                                    value={formatDateToKorean(list.additionalFields?.end) || ''}
                                                    dateFormat="yyyy년 MM월 dd일"
                                                    className="custom-datepickerstart"
                                                    readOnly
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td colSpan={8} style={{ height: '50px' }}>내 용</td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td colSpan={8}>
                                            <textarea value={list.additionalFields?.detail || ''}
                                                style={{ height: '600px', width: '100%', border: 'none', resize: 'none' }} readOnly />
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td colSpan={8} style={{ height: '50px' }}>
                                            위와 같이 휴가을 신청하오니 허락해주시기 바랍니다.
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td>요청일자</td>
                                        <td colSpan={3}>
                                            <DatePicker
                                                value={formatDateToKorean(list.additionalFields?.requestDate) || ''}
                                                dateFormat="yyyy년 MM월 dd일"
                                                readOnly />
                                        </td>
                                        <td>지출유형</td>
                                        <td colSpan={3}>
                                            <select defaultValue={list.additionalFields?.expendType || ''} disabled>
                                                <option value={0}>자재비</option>
                                                <option value={1}>배송비</option>
                                                <option value={2}>교육비</option>
                                                <option value={4}>식대</option>
                                                <option value={5}>출장</option>
                                                <option value={6}>마일리지</option>
                                                <option value={7}>선물</option>
                                                <option value={3}>기타</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td>제목</td>
                                        <td colSpan={7} style={{ height: '50px', textAlign: 'left', paddingLeft: '20px' }}>
                                            {list.additionalFields?.title || ''}
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px', appearance: 'none' }}>
                                        <td>최종금액</td>
                                        <td colSpan={7}>
                                            <input type='text' value={list.additionalFields?.finalPrice || ''} readOnly
                                                style={{ width: '70px' }} />
                                            <select defaultValue={list.additionalFields?.monetaryUnit || ''} disabled>
                                                <option value={0}>원</option>
                                                <option value={1}>달러</option>
                                                <option value={2}>엔</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr style={{ fontSize: '23px' }}>
                                        <td rowSpan={details.length + 1}>내역</td>
                                        <td colSpan={3} style={{ height: '50px' }}>지출내용</td>
                                        <td colSpan={3}>금액</td>
                                        <td colSpan={2}>비고</td>
                                    </tr>
                                    {details.map((detail, index) => (
                                        <tr key={index}>
                                            <td colSpan={3} style={{ height: '65px', fontSize: '23px' }}>
                                                {list.additionalFields?.[`details_${index}_content`] || ''}
                                            </td>
                                            <td colSpan={3} style={{ fontSize: '23px', textAlign: 'right', paddingRight: '20px' }}>
                                                {list.additionalFields?.[`details_${index}_price`] || ''}
                                            </td>
                                            <td colSpan={2} style={{ fontSize: '23px' }}>
                                                {list.additionalFields?.[`details_${index}_note`] || ''}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={8} style={{ height: '50px', fontSize: '23px' }}>위 금액을 청구하오니 결재바랍니다.</td>
                                    </tr>
                                </>
                            )
                        }
                        <tr>
                            <td style={{ fontSize: '23px' }} colSpan={2}>첨부파일</td>
                            <td style={{ fontSize: '20px', height: '200px' }} colSpan={6}>
                                {list.originalFiles && list.originalFiles.length > 0 ? (
                                    list.originalFiles.map((originalFile, idx) => (
                                        <div key={idx}>
                                            <a
                                                onClick={() => onClickImgLink(list.attachedFiles[idx], originalFile)} // attachedFiles에서 해당 인덱스의 파일을 전달
                                                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }} // 클릭 가능한 스타일 추가
                                            >
                                                {originalFile} {/* 파일 이름을 텍스트로 표시 */}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <span>첨부파일이 없습니다.</span>
                                )}

                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr style={{ fontSize: '23px' }}>
                            <td colSpan={8}>
                                <DatePicker
                                    value={formatDateToKorean(list.writeday) || ''}
                                    dateFormat="yyyy년 MM월 dd일"
                                    style={{ marginTop: '50px', outline: 'none' }}
                                    readOnly />
                            </td>
                        </tr>
                        <tr style={{ fontSize: '23px' }}>
                            <td colSpan={4} style={{ height: '50px' }}></td>
                            <td>서명</td>
                            <td>신청자 : {list.writer}</td>
                            <td></td>
                            <td>(인)</td>
                        </tr>

                    </tbody>
                </table>

                <Dialog open={openRejectionDetail} onClose={handleRejectionDetailClose}>
                    <DialogTitle>반려 사유</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ width: '500px' }}>
                            {list.rejectionReason}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRejectionDetailClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={open} onClose={handleRejectionClose}>
                    <DialogTitle>반려 사유 입력</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            반려 사유를 입력하세요:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="반려 사유"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRejectionClose}>취소</Button>
                        <Button onClick={handleRejectionSubmit}>확인</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div style={{
                backgroundColor: '#ffb121',
                border: 'none',
                borderRadius: '0 0 5px 5px',
                height: '60px',
                width: '1400px',
            }}></div>
        </div>
    );
};

export default Detail;
