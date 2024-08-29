import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, IconButton, InputBase, MenuItem, Modal, Radio, RadioGroup, Select, Table, Typography, useMediaQuery } from "@mui/material";
import { MenuOutlined, SearchOutlined, TableBarOutlined } from "@mui/icons-material";
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
    const [email, setEmail] = useState('')
    const [position, setPosition] = useState([]);
    const [membershipStatus, setMembershipStatus] = useState('');
    const [isAdmin, setIsAdmin] = useState('');
    const [residentRegistrationNumber, setResidentRegistrationNumber] = useState('');
    const [companyName, setCompanyName] = useState('')
    const [departmentId, setDepartmentId] = useState('');
    const [positionList, setPositionList] = useState(['사장', '뭐', '어쩌고']);
    const [depList, setDepList] = useState([]);
    const [address, setAddress] = useState('')
    const [id, setId] = useState('')
    const [firstDay, setFirstDay] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState('');
    const [originalFIle, setOriginalFile] = useState('');
    //부서정보 불러오기
    const getDepList = () => {
        axios.get("/api/department/all")
            .then(res => {
                setDepList(res.data);
            })
    }
    //직급 불러오기
    const getPosition = () => {
        axios.get("/api/rank/all")
            .then(res => {
                setPositionList(res.data);
            })
    }
    useEffect(() => {
        getDepList();
        getPosition();
    }, []);


    //사진 변경
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        // 버튼 클릭 시 file input 클릭을 트리거
        fileInputRef.current.click();
    };
    //사진미리보기
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
    }

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
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const handleOpen = async (id) => {
        console.log(id)
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
            setResidentRegistrationNumber(data.residentRegistrationNumber)
            setCompanyName(data.companyName);
            setFirstDay(data.firstDay)
            setDepartmentId(data.department.id);
            setIdNumber(data.idNumber);
            setFile(data.file);
            setId(data.id);
            setOriginalFile(data.profileFile);

            console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setApiDetailData(null);

    };
    //사원정보 전송

    const changeInfo = async () => {

            const formData = new FormData();
    
            // JSON 데이터 추가
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
            alert(response.data.message);
            setOpen(false);
            fetchData();
       
    };
    


    return (
        <Box style={{ padding: '10px' }}>
            <Box bgcolor="" p={2} height="280px" padding='0px'>
                <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton
                            sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
                            onClick={() => setToggled(!toggled)}
                        >
                            <MenuOutlined />
                        </IconButton>
                        <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="white"
                            borderRadius="3px"
                            sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
                        >
                            <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
                            <IconButton type="button" sx={{ p: 1 }}>
                                <SearchOutlined />
                            </IconButton>
                        </Box>
                    </Box>
                    <Select
                        value={sortOrder}
                        onChange={handleSortChange}
                        size="small"
                        sx={{
                            minWidth: 120,
                        }}
                    >
                        <MenuItem value="default">기본 순서</MenuItem>
                        <MenuItem value="ascending">오름차순</MenuItem>
                        <MenuItem value="descending">내림차순</MenuItem>
                        <MenuItem value="date">날짜순</MenuItem>
                    </Select>
                </Box>
                <Box borderBottom="1px solid #e0e0e0" />
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center", width: '10%' }}>이름</th>
                            <th style={{ textAlign: "center", width: '10%' }}>직책</th>
                            <th style={{ textAlign: "center", width: '10%' }}>부서</th>
                            <th style={{ textAlign: "center", width: '10%' }}>재직여부</th>
                            <th style={{ textAlign: "center", width: '20%' }}>전화번호</th>
                            <th style={{ textAlign: "center", width: '20%' }}>이메일</th>
                            <th style={{ textAlign: "center", width: '10%' }}>상세보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiData.map((info, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>{info.name}</td>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>{info.position.rank}</td>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>{info.department.departmentName}</td>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>
                                    <span style={{
                                        color: info.membershipStatus ? '#7bd3b5' : 'red',
                                        backgroundColor: info.membershipStatus ? '#e7f9f1' : 'pink',
                                        padding: '3px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        {info.membershipStatus ? '재직중' : '퇴직'}
                                    </span>
                                </td>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>{info.phoneNumber}</td>
                                <td style={{ textAlign: "center", paddingTop: "15px" }}>{info.email}</td>
                                <td style={{ textAlign: "center", }}>
                                    <IconButton onClick={() => handleOpen(info.id)}>
                                        <MoreHorizIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"

                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            상세정보<b style={{ float: 'right' }}>
                                사번 : <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                            </b>
                        </Typography>

                        <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                            <Table style={{ width: "900px" }}>
                                <caption style={{ align: 'top' }}>

                                </caption>
                                <tbody >
                                    <tr style={{ height: "60px" }}>
                                        <td rowSpan={4} style={{ border: "1px solid grey", width: "150px" }}>
                                            {/* 미리보기 이미지 */}
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
                                                style={{ display: 'none' }} // input을 숨김
                                                onChange={handleFileChange} // 파일이 선택되었을 때 이벤트 핸들러
                                            />
                                            {/* 버튼 클릭 시 숨겨진 input을 클릭하는 이벤트를 트리거 */}
                                            <Button variant='contained' color="secondary" onClick={handleButtonClick}>
                                                사진 변경
                                            </Button>
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이름</td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>소속</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                                                {
                                                    depList &&
                                                    depList.map((item, idx) => (
                                                        <option key={idx} value={item.id}>{item.departmentName}</option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>입사일</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='date' value={firstDay} onChange={(e) => setFirstDay(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr style={{ height: "40px" }}>
                                        <td rowSpan={3} style={{ border: "1px solid grey" }}>
                                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>포털 아이디</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='text' value={potalId} onChange={(e) => setPotalId(e.target.value)} />
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>내선번호</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='text' value={extensionCall} onChange={(e) => setExtensionCall(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr style={{ height: "40px" }}>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이메일</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>휴대전화번호</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr style={{ height: "40px" }}>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>직위/직책</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <select value={position} onChange={(e) => setPosition(e.target.value)}>
                                                {
                                                    positionList &&
                                                    positionList.map((item, idx) => (
                                                        <option key={idx} value={item.id}>{item.rank}</option>
                                                    ))
                                                }
                                            </select>
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주소</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr style={{ height: "40px" }}>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>재직여부</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={membershipStatus} // 현재 선택된 값
                                                name="radio-buttons-group"
                                                onChange={membershipHandleChange} // 변경 시 호출되는 핸들러
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="재직중" />
                                                <FormControlLabel value={false} control={<Radio />} label="퇴사" />
                                            </RadioGroup>
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>관리자여부</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                value={isAdmin}
                                                name="radio-buttons-group1"
                                                onChange={adminHandleChange}
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="O" />
                                                <FormControlLabel value={false} control={<Radio />} label="X" />
                                            </RadioGroup>
                                        </td>
                                        <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주민등록번호</td>
                                        <td style={{ border: "1px solid grey" }}>
                                            <input type='text' value={residentRegistrationNumber} onChange={(e) => setResidentRegistrationNumber(e.target.value)} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>
                                            <Button variant='contained' color='secondary' onClick={changeInfo}>변경</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Typography>


                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default AdminInfo;
