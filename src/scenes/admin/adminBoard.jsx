import React, {useState} from 'react';
import {Box, IconButton, InputBase, MenuItem, Select, useMediaQuery} from "@mui/material";
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";
import {Table} from "react-bootstrap";

const AdminBoard = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };
    return (
        <Box style={{padding:'20px'}}>
            <Box p={2}>
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
                </Table>
            </Box>
            </Box>
    );
};

export default AdminBoard;