import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, IconButton, InputBase, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useMediaQuery } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
import Swal from 'sweetalert2';
import CloseIcon from "@mui/icons-material/Close";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1000px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AdminInfo = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [apiData, setApiData] = useState([]);
    const [apiDetailData, setApiDetailData] = useState(null);
    const [open, setOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [profileFile, setProfileFile] = useState('');
    const [potalId, setPotalId] = useState('');
    const [extensionCall, setExtensionCall] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState([]);
    const [membershipStatus, setMembershipStatus] = useState('');
    const [isAdmin, setIsAdmin] = useState('');
    const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [positionList, setPositionList] = useState(['사장', '뭐', '어쩌고']);
    const [depList, setDepList] = useState([]);
    const [address, setAddress] = useState('');
    const [id, setId] = useState('');
    const [firstDay, setFirstDay] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState('');
    const [originalFile, setOriginalFile] = useState('');
    const [passModalOpen, setPassMadalOpen] = useState(false);
    const [top, setTop] = useState([]);
    const [mid, setMid] = useState([]);
    const [sub, setSub] = useState([]);
    const [selectedTop, setSelectedTop] = useState('');
    const [selectedMid, setSelectedMid] = useState('');
    const [selectedSub, setSelectedSub] = useState('');

    // 부서정보 불러오기
    const getDepList = () => {
        axios.get("/api/department/all")
            .then(res => {
                console.log("API 응답 데이터:", res.data);
                const departments = res.data;
                if (Array.isArray(departments) && departments.length > 0) {
                    const topDeps = {};
                    const midDeps = {};
                    const subDeps = {};

                    departments.forEach(dep => {
                        const topId = Math.floor(dep.id / 100) * 100;
                        const midId = Math.floor(dep.id / 10) * 10;
                        const subId = dep.id;

                        if (dep.id === topId) {
                            topDeps[topId] = { id: topId.toString(), name: dep.departmentName, children: {} };
                        } else if (dep.id === midId) {
                            if (!midDeps[topId]) midDeps[topId] = {};
                            midDeps[topId][midId] = { id: midId.toString(), name: dep.departmentName, children: {} };
                            if (topDeps[topId]) topDeps[topId].children[midId] = midDeps[topId][midId];
                        } else {
                            if (!subDeps[midId]) subDeps[midId] = {};
                            subDeps[midId][subId] = { id: subId.toString(), name: dep.departmentName };
                            if (midDeps[topId] && midDeps[topId][midId]) {
                                midDeps[topId][midId].children[subId] = subDeps[midId][subId];
                            }
                        }
                    });

                    setTop(Object.values(topDeps));
                    setMid(midDeps);
                    setSub(subDeps);

                    console.log("처리된 top 데이터:", Object.values(topDeps));
                    console.log("처리된 mid 데이터:", midDeps);
                    console.log("처리된 sub 데이터:", subDeps);
                } else {
                    console.error('부서 데이터가 올바르지 않습니다:', departments);
                    setTop([]);
                    setMid({});
                    setSub({});
                }
            })
            .catch(error => {
                console.error('부서 데이터를 가져오는 중 오류 발생:', error);
                setTop([]);
                setMid({});
                setSub({});
            });
    };

    // 직급 불러오기
    const getPosition = () => {
        axios.get("/api/rank/all")
            .then(res => {
                setPositionList(res.data);
            });
    };

    useEffect(() => {
        getDepList();
        getPosition();
    }, []);

    // 사진 변경
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // 사진 미리보기
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const membershipHandleChange = (event) => {
        setMembershipStatus(event.target.value === 'true');
    };

    const adminHandleChange = (event) => {
        setIsAdmin(event.target.value === 'true');
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employee/list');
            const data = await response.json();
            setApiData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // departmentId를 top, mid, sub로 분리하는 함수
    const splitDepartmentId = (id) => {
        const topId = Math.floor(id / 100) * 100;
        const midId = Math.floor((id % 100) / 10) * 10;
        const subId = id % 10;
        return { topId, midId, subId };
    };

    // top, mid, sub를 합쳐서 departmentId를 만드는 함수
    const combineDepartmentId = (selectedTop, selectedMid, selectedSub) => {
        if (selectedTop && selectedMid && selectedSub) {
            return (parseInt(selectedTop) + parseInt(selectedMid) + parseInt(selectedSub)).toString();
        }
        return '';
    };

    const handleOpen = async (id) => {
        setOpen(true);

        try {
            const response = await fetch(`/api/employee/detail?id=${id}`);
            const data = await response.json();
            setName(data.name);
            setPhoneNumber(data.phoneNumber);
            setProfileFile(data.profileFile);
            setAddress(data.address);
            setPotalId(data.potalId);
            setExtensionCall(data.extensionCall);
            setEmail(data.email);
            setPosition(data.position.id);
            setMembershipStatus(data.membershipStatus);
            setIsAdmin(data.isAdmin);
            setDepartmentName(data.department.departmentName);
            setResidentRegistrationNumber(data.residentRegistrationNumber);
            setCompanyName(data.companyName);
            setFirstDay(data.firstDay);
            setIdNumber(data.idNumber);
            setFile(data.file);
            setId(data.id);
            setOriginalFile(data.profileFile);

// 부서 정보 설정
            const departmentId = data.department.id;
            const topId = Math.floor(departmentId / 100) * 100;
            const midId = Math.floor(departmentId / 10) * 10;
            const subId = departmentId;

            setSelectedTop(topId.toString());
            setSelectedMid(midId.toString());
            setSelectedSub(subId.toString());

            // mid와 sub 옵션 업데이트
            if (mid[topId]) {
                setMid(prevMid => ({...prevMid, [topId]: mid[topId]}));
            }
            if (sub[midId]) {
                setSub(prevSub => ({...prevSub, [midId]: sub[midId]}));
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const hasDataChanged = () => {
        return (
            name !== '' ||
            phoneNumber !== '' ||
            profileFile !== originalFile ||
            potalId !== '' ||
            extensionCall !== '' ||
            email !== '' ||
            position !== '' ||
            membershipStatus !== '' ||
            departmentId !== '' ||
            address !== '' ||
            companyName !== '' ||
            isAdmin !== '' ||
            idNumber !== '' ||
            firstDay !== ''
        );
    };

    const handleClose = () => {
        setOpen(false);
        setApiDetailData(null);
    };

    // 사원정보 전송
    const changeInfo = async () => {
        if (!hasDataChanged()) {
            handleClose();
            Swal.fire({
                icon: 'warning',
                title: '변경된 내용이 없습니다.',
                text: '내용을 수정한 후 변경 버튼을 눌러주세요.',
            });
            return;
        }

        try {
            const formData = new FormData();

            const jsonData = {
                id: id,
                potalId: potalId,
                name: name,
                residentRegistrationNumber: residentRegistrationNumber,
                position: position,
                email: email,
                extensionCall: extensionCall,
                phoneNumber: phoneNumber,
                address: address,
                membershipStatus: membershipStatus,
                departmentId: selectedSub || selectedMid || selectedTop, // 가장 하위 부서 ID 사용
                profileFile: profileFile,
                companyName: companyName,
                isAdmin: isAdmin,
                idNumber: idNumber,
                firstDay: firstDay
            };

            formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

            if (fileInputRef.current && fileInputRef.current.files[0]) {
                formData.append('file', fileInputRef.current.files[0]);
            }

            const response = await axios.patch('/api/employee/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            handleClose();
            await fetchData();

            Swal.fire({
                icon: 'success',
                title: '변경 완료',
                text: '사원 정보가 성공적으로 변경되었습니다.',
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending data:', error);

            handleClose();
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '사원 정보 변경 중 오류가 발생했습니다.',
            });
        }
    };

    //초기화 버튼
    const reset = async (potalId) => {
        try {
            const json = JSON.stringify({ potalId });
            const blob = new Blob([json], { type: 'application/json' });
            const data = new FormData();
            data.append('data', blob);

            const response = await axios({
                method: 'put',
                url: '/api/employee/auth/reset',
                data: data,
            });

            alert('초기화되었습니다.');
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    };

    //동기화 버튼
    const synchronization = async () => {
        try {
            const response = await axios.put('/api/employee/sync');
            alert('동기화 완료')
        } catch (error) {
            console.error('Error sending data:', error);
            alert('동기화 실패')
            throw error;
        }
    };

    const handlePassModalClose = () => {
        setPassMadalOpen(false);
    };

    return (
        <Box
            gridRow="span 3"
            sx={{
                borderRadius: "8px",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                maxWidth: '1400px',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto'
            }}
        >
            <Box borderBottom={`2px solid #ffb121`} p="16px">
                <Typography
                    variant="h4"
                    fontWeight="700"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    인사관리
                    <Button  sx={{
                        border: '1px solid #ffb121',
                        color: '#ffb121',
                        fontSize: '14px',
                        borderRadius: "8px",
                        fontWeight: 'bold'
                    }} variant="h4" onClick={synchronization}>동기화</Button>
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>이름</TableCell>
                            <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>직책</TableCell>
                            <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>부서</TableCell>
                            <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold' }}>재직여부</TableCell>
                            <TableCell align="center" style={{ width: '20%',fontSize: '0.9rem', fontWeight:'bold' }}>전화번호</TableCell>
                            <TableCell align="center" style={{ width: '20%',fontSize: '0.9rem', fontWeight:'bold'}}>이메일</TableCell>
                            <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem', fontWeight:'bold'}}>상세보기</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData.map((info, index) => (
                            <TableRow key={index}
                                      sx={{
                                          '&:hover': {
                                              backgroundColor: '#f5f5f5',
                                              '& *': {
                                                  color: '#ffb121',
                                              },
                                          },
                                      }}>
                                <TableCell align="center" style={{paddingTop: "15px", fontSize: '0.9rem'}}>
                                    <img
                                        src={info.profileFile}
                                        alt="Profile"
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            marginRight: '10px',
                                            border: '1px solid #ffb121',
                                            objectFit:'cover',
                                        }}
                                    />
                                    {info.name}</TableCell>
                                <TableCell align="center" style={{
                                    paddingTop: "15px",
                                    fontSize: '0.9rem'
                                }}>{info.position.rank}</TableCell>
                                <TableCell align="center"
                                           style={{
                                               paddingTop: "15px",
                                               fontSize: '0.9rem'
                                           }}>{info.department.departmentName}</TableCell>
                                <TableCell align="center" style={{ paddingTop: "15px" ,fontSize: '0.9rem' }}>
                                    <span style={{
                                        color: info.membershipStatus ? '#7bd3b5' : 'red',
                                        backgroundColor: info.membershipStatus ? '#e7f9f1' : 'pink',
                                        padding: '3px 4px',
                                        borderRadius: '4px'
                                        ,fontSize: '0.9rem'
                                    }}>
                                        {info.membershipStatus ? '재직중' : '퇴직'}
                                    </span>
                                </TableCell>
                                <TableCell align="center" style={{ paddingTop: "15px",fontSize: '0.9rem'  }}>{info.phoneNumber}</TableCell>
                                <TableCell align="center" style={{ paddingTop: "15px",fontSize: '0.9rem'  }}>{info.email}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleOpen(info.id)}>
                                        <MoreHorizIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box display="flex" justifyContent="space-between">
                        <Typography id="modal-modal-title" variant="h2" component="h2" fontWeight='normal' textAlign="center">
                            상세정보
                        </Typography>
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            사번 : <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={3} rowSpan={4} style={{ border: "1px solid grey", width: "30%",}}>
                                            {profileFile ? (
                                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
                                                    <img src={profileFile} alt="미리보기" style={{width: '100px', height: '100px', border: '1px solid #ffb121', borderRadius: '50%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid grey' }}>
                                                    사진 없음
                                                </div>
                                            )}
                                            <input
                                                type='file'
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px'}}>
                                                <Button sx={{
                                                    backgroundColor: '#ffb121',
                                                    color: 'white',
                                                    fontSize: '15px'
                                                }} onClick={handleButtonClick}>
                                                    사진 변경
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC", width:'10%'}}>이름</TableCell>
                                        <TableCell style={{width:'20%'}}>
                                            <input type='text' style={{width:'100%'}} value={name} onChange={(e) => setName(e.target.value)} />
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC", width:'10%'}}>부서</TableCell>
                                        <TableCell style={{width:'20%'}}>
                                            <Select
                                                value={selectedTop}
                                                onChange={(e) => {
                                                    setSelectedTop(e.target.value);
                                                    setSelectedMid('');
                                                    setSelectedSub('');
                                                }}
                                                sx={{ width: '100%' }}
                                                displayEmpty
                                            >
                                                <MenuItem value="">선택하세요</MenuItem>
                                                {top.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>포털 아이디</TableCell>
                                        <TableCell>
                                            <input type='text' style={{width:'100%'}} value={potalId} onChange={(e) => setPotalId(e.target.value)} />
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>팀</TableCell>
                                        <TableCell>
                                            <Select
                                                value={selectedMid}
                                                onChange={(e) => {
                                                    setSelectedMid(e.target.value);
                                                    setSelectedSub('');
                                                }}
                                                sx={{ width: '100%' }}
                                                displayEmpty
                                                disabled={!selectedTop}
                                            >
                                                <MenuItem value="">선택하세요</MenuItem>
                                                {selectedTop && mid[selectedTop] && Object.values(mid[selectedTop]).map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이메일</TableCell>
                                        <TableCell>
                                            <input type="text"  style={{width:'100%'}} value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>팀별</TableCell>
                                        <TableCell>
                                            <Select
                                                value={selectedSub}
                                                onChange={(e) => setSelectedSub(e.target.value)}
                                                sx={{ width: '100%' }}
                                                displayEmpty
                                                disabled={!selectedMid}
                                            >
                                                {sub.length === 0 ? <MenuItem value="">선택하세요</MenuItem> : <MenuItem value="">팀이 없습니다</MenuItem>}
                                                {selectedMid && sub[selectedMid] && Object.values(sub[selectedMid]).map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>직위/직책</TableCell>
                                        <TableCell>
                                            <Select
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                                sx={{ width: '100%' }}>
                                                {positionList.map((item, idx) => (
                                                    <MenuItem key={idx} value={item.id}>{item.rank}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>내선번호</TableCell>
                                        <TableCell>
                                            <input type='text' style={{width:'100%'}} value={extensionCall} onChange={(e) => setExtensionCall(e.target.value)} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>재직여부</TableCell>
                                        <TableCell colSpan={2}>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={membershipStatus}
                                                name="radio-buttons-group"
                                                onChange={membershipHandleChange}
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="재직중" />
                                                <FormControlLabel value={false} control={<Radio />} label="퇴사" />
                                            </RadioGroup>
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>관리자여부</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={isAdmin}
                                                name="radio-buttons-group1"
                                                onChange={adminHandleChange}
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="O" />
                                                <FormControlLabel value={false} control={<Radio />} label="X" />
                                            </RadioGroup>
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>휴대전화번호</TableCell>
                                        <TableCell>
                                            <input type='text' style={{width:'100%'}} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주민등록번호</TableCell>
                                        <TableCell colSpan={2}>
                                            <input type='text' style={{width:'100%'}} value={residentRegistrationNumber} onChange={(e) => setResidentRegistrationNumber(e.target.value)} />
                                        </TableCell>
                                        <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주소</TableCell>
                                        <TableCell colSpan={3}>
                                            <input type='text' style={{width:'100%'}} value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ textAlign: 'center'}}>
                                            <Button sx={{
                                                backgroundColor: '#ffb121',
                                                color: 'white',
                                                fontSize: '15px',
                                                marginRight: '10px'
                                            }} onClick={changeInfo} >변경</Button>

                                            <Button sx={{
                                                backgroundColor: '#ffb121',
                                                color: 'white',
                                                fontSize: '15px'
                                            }} onClick={() => reset(potalId)}>비밀번호 초기화</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default AdminInfo;