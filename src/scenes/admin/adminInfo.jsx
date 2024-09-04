import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, IconButton, InputBase, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useMediaQuery } from "@mui/material";
import { MenuOutlined, SearchOutlined } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';

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

    // 부서정보 불러오기
    const getDepList = () => {
        axios.get("/api/department/all")
            .then(res => {
                setDepList(res.data);
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
            setDepartmentId(data.department.id);
            setIsAdmin(data.isAdmin);
            setDepartmentName(data.department.departmentName);
            setResidentRegistrationNumber(data.residentRegistrationNumber);
            setCompanyName(data.companyName);
            setFirstDay(data.firstDay);
            setIdNumber(data.idNumber);
            setFile(data.file);
            setId(data.id);
            setOriginalFile(data.profileFile);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setApiDetailData(null);
    };

    // 사원정보 전송
    const changeInfo = async () => {
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
                departmentId: departmentId,
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

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    //초기화 버튼
    const reset = async () => {
        const resetData = {
            data: "reset-password"  // 서버와의 약속된 문자열 또는 초기화 요청 값
        };

        try {
            const response = await axios.put('/api/employee/auth/reset', resetData);
            console.log('Password reset successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    };

    //동기화 버튼
    const synchronization = async (data) => {
        try {
            const response = await axios.put('/api/employee/sync', data);
            console.log('Data successfully sent:', response.data);
            return response.data; // 필요시 반환
        } catch (error) {
            console.error('Error sending data:', error);
            throw error; // 필요시 에러 재던짐
        }
    };


    return (
        <Box style={{ padding: '20px' }}>
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box display="flex" alignItems="" gap={2} >
                        <Button variant='contained' color='secondary' onClick={synchronization}>동기화</Button>
                    </Box>
                </Box>
                <Box borderBottom="1px solid #e0e0e0" />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor:'white'
                                }}>
                                <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem' }}>이름</TableCell>
                                <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem' }}>직책</TableCell>
                                <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem' }}>부서</TableCell>
                                <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem' }}>재직여부</TableCell>
                                <TableCell align="center" style={{ width: '20%',fontSize: '0.9rem' }}>전화번호</TableCell>
                                <TableCell align="center" style={{ width: '20%',fontSize: '0.9rem' }}>이메일</TableCell>
                                <TableCell align="center" style={{ width: '10%',fontSize: '0.9rem' }}>상세보기</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apiData.map((info, index) => (
                                <TableRow key={index}   sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5', // 호버 시 배경 색상
                                    }
                                }}>
                                    <TableCell align="center" style={{paddingTop: "15px", fontSize: '0.9rem'}}>
                                        <img
                                            src={info.profileFile}
                                            alt="Profile"
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                marginRight: '10px',
                                                border: '1px solid #f5f5f5',
                                                objectFit:'cover'
                                            }}
                                        />
                                        {info.name}</TableCell>
                                    <TableCell align="center" style={{
                                        paddingTop: "15px",
                                        fontSize: '0.9rem'
                                    }}>{info.position.rank}</TableCell>
                                    <TableCell align="center" style={{
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
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography id="modal-modal-title" variant="h3" component="h2" textAlign="center">
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
                                            <TableCell rowSpan={4} style={{ border: "1px solid grey", width: "150px" }}>
                                                {profileFile ? (
                                                    <img src={profileFile} alt="미리보기" style={{ width: '100%' }} />
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
                                                <Button variant='contained' color="secondary" onClick={handleButtonClick}>
                                                    사진 변경
                                                </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이름</TableCell>
                                            <TableCell>
                                                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>소속</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={departmentId}
                                                    onChange={(e) => setDepartmentId(e.target.value)}
                                                    sx={{ width: '100%' }}
                                                >
                                                    {depList.map((item, idx) => (
                                                        <MenuItem key={idx} value={item.id}>{item.departmentName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>포털 아이디</TableCell>
                                            <TableCell>
                                                <input type='text' value={potalId} onChange={(e) => setPotalId(e.target.value)} />
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>내선번호</TableCell>
                                            <TableCell>
                                                <input type='text' value={extensionCall} onChange={(e) => setExtensionCall(e.target.value)} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이메일</TableCell>
                                            <TableCell>
                                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>휴대전화번호</TableCell>
                                            <TableCell>
                                                <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>직위/직책</TableCell>
                                            <TableCell>
                                                <Select
                                                    value={position}
                                                    onChange={(e) => setPosition(e.target.value)}
                                                    sx={{ width: '100%' }}
                                                >
                                                    {positionList.map((item, idx) => (
                                                        <MenuItem key={idx} value={item.id}>{item.rank}</MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주소</TableCell>
                                            <TableCell>
                                                <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>재직여부</TableCell>
                                            <TableCell>
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
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주민등록번호</TableCell>
                                            <TableCell>
                                                <input type='text' value={residentRegistrationNumber} onChange={(e) => setResidentRegistrationNumber(e.target.value)} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={6} style={{ textAlign: 'center'}}>
                                                <Button variant='contained' color='secondary' onClick={changeInfo} >변경</Button>
                                                <Button variant='contained' color='secondary' onClick={reset}>비밀번호 초기화</Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default AdminInfo;