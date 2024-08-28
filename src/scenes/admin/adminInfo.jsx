import React, { useEffect, useState } from 'react';
import { Box, FormControlLabel, IconButton, InputBase, MenuItem, Modal, Radio, RadioGroup, Select, Typography, useMediaQuery } from "@mui/material";
import { Table } from "react-bootstrap";
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
    const [open, setOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null); // 모달에서 사용할 데이터를 저장할 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/employee/list');
                const result = await response.json();

                if (result.status === "OK") {
                    setApiData(result.data);
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const handleOpen = (info) => {
        setSelectedInfo(info); // 클릭한 행의 데이터를 저장
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedInfo(null); // 모달을 닫을 때 데이터 초기화
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
                <Table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", paddingLeft: "40px" }}>이름</th>
                            <th style={{ textAlign: "left", paddingLeft: "40px" }}>직책</th>
                            <th style={{ textAlign: "left", paddingLeft: "40px" }}>부서</th>
                            <th style={{ textAlign: "left", paddingLeft: "40px" }}>재직여부</th>
                            <th style={{ textAlign: "left", paddingLeft: "80px" }}>이메일</th>
                            <th style={{ textAlign: "left", paddingLeft: "30px" }}>상세보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiData.map((info, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>{info.name}</td>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>{info.position}</td>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>{info.departmentName}</td>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>
                                    <span style={{
                                        color: info.membershipStatus ? '#7bd3b5' : 'red',
                                        backgroundColor: info.membershipStatus ? '#e7f9f1' : 'pink',
                                        padding: '2px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        {info.membershipStatus ? '재직중' : '퇴직'}
                                    </span>
                                </td>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>{info.email}</td>
                                <td style={{ textAlign: "left", paddingLeft: "40px" }}>
                                    <IconButton onClick={() => handleOpen(info)}>
                                        <MoreHorizIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
                        {selectedInfo && (
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <table style={{ width: "900px" }}>
                                    <tbody >
                                        <tr style={{ height: "60px" }}>
                                            <td rowSpan={4} style={{ border: "1px solid grey", width: "150px" }}><img src={selectedInfo.photo} /></td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이름</td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>소속</td>
                                            <td colSpan={3} style={{ border: "1px solid grey" }}>
                                                <input type='text' value={selectedInfo.companyName} />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td rowSpan={3} style={{ border: "1px solid grey" }}>
                                                <input type='text' value={selectedInfo.name} />
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>포털 아이디</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={selectedInfo.potalId} />
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>내선번호</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={selectedInfo.extensionCall} />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>이메일</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type="text" value={selectedInfo.email} />
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>휴대전화번호</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value={selectedInfo.phoneNumber} />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>직위/직책</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <select>
                                                    <option>{selectedInfo.position}</option>
                                                    <option>사장</option>
                                                    <option>어쩌고</option>
                                                    <option>대리</option>
                                                </select>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>대표전화</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <input type='text' value="0000-0000" />
                                            </td>
                                        </tr>
                                        <tr style={{ height: "40px" }}>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>재직여부</td>
                                            <td style={{ border: "1px solid grey" }}>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultChecked={selectedInfo.membershipStatus}
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
                                                    defaultValue={selectedInfo.Isadmin}
                                                    name="radio-buttons-group"
                                                >
                                                    <FormControlLabel value="true" control={<Radio />} label="O" />
                                                    <FormControlLabel value="false" control={<Radio />} label="X" />
                                                </RadioGroup>
                                            </td>
                                            <td style={{ border: "1px solid grey", backgroundColor: "#DCDCDC" }}>주민등록번호</td>
                                            <td style={{ border: "1px solid grey" }}>{selectedInfo.residentRegistrationNumber}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Typography>
                        )}
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
};

export default AdminInfo;
