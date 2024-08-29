import React, { useEffect, useState } from 'react';
import { Box, Button, FormControlLabel, IconButton, InputBase, MenuItem, Modal, Radio, RadioGroup, Select, Table, Typography, useMediaQuery } from "@mui/material";
import { MenuOutlined, SearchOutlined, TableBarOutlined } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


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
    const [phoneNumber,setPhoneNumber]=useState('');
    const [name,setName]=useState('');
    const [profileFile,setProfileFile]=useState('');
    const [potalId,setPotalId]=useState('');
    const [extensionCall,setExtensionCall]=useState('');
    const [email,setEmail]=useState('')
    const [position,setPosition]=useState([]);
    const [membershipStatus,setMembershipStatus]=useState('');
    const [isAdmin,setIsAdmin]=useState('');
    const [residentRegistrationNumber,setResidentRegistrationNumber]=useState('');
    const [companyName,setCompanyName]=useState('')

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
            setPotalId(data.potalId);
            setExtensionCall(data.extensionCall);
            setEmail(data.email);
            setPosition(data.position.rank);
            setMembershipStatus(data.membershipStatus);
            setIsAdmin(data.isAdmin);
            setResidentRegistrationNumber(data.residentRegistrationNumber)
            setCompanyName(data.companyName);
            console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setApiDetailData(null);

    };

    const changeInfo=()=>{
        //변경사항 적용
    }

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
                        <th style={{textAlign: "center", width: '10%'}}>이름</th>
                        <th style={{textAlign: "center", width: '10%'}}>직책</th>
                        <th style={{textAlign: "center", width: '10%'}}>부서</th>
                        <th style={{textAlign: "center", width: '10%'}}>재직여부</th>
                        <th style={{textAlign: "center", width: '20%'}}>전화번호</th>
                        <th style={{textAlign: "center", width: '20%'}}>이메일</th>
                        <th style={{textAlign: "center", width: '10%'}}>상세보기</th>
                    </tr>
                    </thead>
                    <tbody>
                        {apiData.map((info, index) => (
                            <tr key={index}>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>{info.name}</td>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>{info.position.rank}</td>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>{info.department.departmentName}</td>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>
                                    <span style={{
                                        color: info.membershipStatus ? '#7bd3b5' : 'red',
                                        backgroundColor: info.membershipStatus ? '#e7f9f1' : 'pink',
                                        padding: '3px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        {info.membershipStatus ? '재직중' : '퇴직'}
                                    </span>
                                </td>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>{info.phoneNumber}</td>
                                <td style={{textAlign: "center", paddingTop: "15px"}}>{info.email}</td>
                                <td style={{textAlign: "center",}}>
                                    <IconButton onClick={() => handleOpen(info.id)}>
                                        <MoreHorizIcon/>
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
                            상세정보
                        </Typography>
                        
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <Table style={{ width: "900px" }}>
                                    <tbody >
                                        <tr style={{ height: "60px" }}>
                                            <td rowSpan={4} style={{ border: "1px solid grey", width: "150px" }}>
                                                <img src={profileFile} style={{width:'100%'}} />
                                                <input type='file'/>
                                                <Button variant='contained' coloer="secondary">사진 변경</Button>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이름</td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>소속</td>
                                            <td colSpan={3} style={{ border: "1px solid grey" }}>
                                                <input type='text' value={companyName} onChange={(e)=>setCompanyName(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td rowSpan={3} style={{ border: "1px solid grey" }}>
                                                <input type='text' value={name} onChange={(e)=>setName(e.target.value)} />
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>포털 아이디</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={potalId} onChange={(e)=>setPotalId(e.target.value)}/>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>내선번호</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={extensionCall} onChange={(e)=>setExtensionCall(e.target.value)}/>
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이메일</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>휴대전화번호</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={phoneNumber} onChange={(e)=>setPhoneNumber((e.target.value))} />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>직위/직책</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <select>
                                                    {/*<option>{apiDetailData.position.rank}</option>*/}
                                                    <option>사장</option>
                                                    <option>어쩌고</option>
                                                    <option>대리</option>
                                                </select>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>대표전화</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={extensionCall} onChange={(e)=>setExtensionCall(e.target.value)}/>
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>재직여부</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultChecked={membershipStatus}
                                                    name="radio-buttons-group"
                                                >
                                                    <FormControlLabel value="true" control={<Radio />} label="재직중" />
                                                    <FormControlLabel value="false" control={<Radio />} label="퇴사" />
                                                </RadioGroup>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>관리자여부</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue={isAdmin}
                                                    name="radio-buttons-group"
                                                >
                                                    <FormControlLabel value="true" control={<Radio />} label="O" />
                                                    <FormControlLabel value="false" control={<Radio />} label="X" />
                                                </RadioGroup>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주민등록번호</td>
                                            <td style={{ border: "1px solid grey" }}>{residentRegistrationNumber}</td>
                                        </tr>
                                        <tr>
                                            <Button variant='contained' color='secondary' onClick={changeInfo()}>변경</Button>
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
