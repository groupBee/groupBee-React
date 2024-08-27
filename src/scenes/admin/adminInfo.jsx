import React, {useEffect, useState} from 'react';
import {Box, IconButton, InputBase, MenuItem, Select, Typography, useMediaQuery} from "@mui/material";
import {Table} from "react-bootstrap";
import EditIcon from '@mui/icons-material/Edit';
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";

const AdminInfo = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [apiData, setApiData]=useState([]);


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

    return (
        <Box style={{padding:'10px'}}>
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

                    size="small" // Select 컴포넌트의 크기 조절
                    sx={{
                        minWidth: 120, // 셀렉트의 최소 너비 설정
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
                    <th style={{textAlign: "left", paddingLeft: "40px"}}>이름</th>
                    <th style={{textAlign: "left", paddingLeft: "40px"}}>직책</th>
                    <th style={{textAlign: "left", paddingLeft: "40px"}}>부서</th>
                    <th style={{textAlign: "left", paddingLeft: "40px"}}>정보</th>
                </tr>
                </thead>
                <tbody>
                {apiData.map((employee,index) => (
                    <tr key={index}>
                        <td style={{ textAlign: "left", paddingLeft: "40px" }}>{employee.name}</td>
                        <td style={{ textAlign: "left", paddingLeft: "40px" }}>{employee.position}</td>
                        <td style={{ textAlign: "left", paddingLeft: "40px" }}>{employee.departmentName}</td>
                        <td style={{ textAlign: "left", paddingLeft: "40px" }}>
                            <EditIcon style={{ cursor: 'pointer' }} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Box>
        </Box>
    );
};

export default AdminInfo;