import React, { useEffect, useState } from 'react';
import {
    Box,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    Typography,
    CircularProgress,
    useMediaQuery
} from "@mui/material";
import { MenuOutlined, SearchOutlined } from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';

const AdminEmail = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [email, setEmail] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        // 선택된 순서에 따른 데이터 정렬 또는 기타 작업을 여기에 추가
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://100.64.0.9/api/v1/get/mailbox/all/groupbee.co.kr', {
                method: 'GET',
                headers: {
                    'X-API-Key': 'E63DEF-77C26B-9A104F-C6AEBF-B2ED8D',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            const filteredData = data.map(item => ({
                name: item.name,
                username: item.username,
                active: item.active,
                quota: item.quota,
                messages: item.messages
            }));

            setEmail(filteredData);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const convertBytesToGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);
    const TOTAL_QUOTA_GB = 5;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: '20px'}}>
            <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton
                            sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
                        >
                            <MenuOutlined />
                        </IconButton>
                        <Box
                            display="flex"
                            alignItems="center"
                            bgcolor="white"
                            borderRadius="4px"
                            sx={{ display: `${isXsDevices ? "none" : "flex"}`, border: '1px solid #ddd' }}
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
                <Box>
                    {email.map((emailItem, index) => {
                        const usedQuotaGB = convertBytesToGB(emailItem.quota);
                        const totalQuotaGB = TOTAL_QUOTA_GB;
                        const quotaUsedPercent = (emailItem.quota / (totalQuotaGB * 1024 ** 3)) * 100;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    height: '150px',
                                    marginBottom: '15px',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    boxShadow: 1,
                                    overflow: 'hidden'
                                    , '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                {/* 왼쪽 박스 (70%) */}
                                <Box
                                    sx={{
                                        flex: 7,
                                        padding: '20px',
                                        borderLeft: '8px solid #09e3a9',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 2 }}>
                                            {emailItem.username}
                                        </Typography>
                                        <Typography variant="h6">
                                            <span style={{color:'white', backgroundColor:'#09e3a9', padding:'4px', borderRadius:'4px'}}>
                                                {emailItem.active === 1 ? '사용중' : '사용불가'}
                                            </span>
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <Typography variant="subtitle1" sx={{ color: '#6c6c6c', display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon sx={{ mr: 1 }} />
                                            {emailItem.name}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#6c6c6c', display: 'flex', alignItems: 'center', ml: 2 }}>
                                            <MailIcon sx={{ mr: 1 }} />
                                            {emailItem.messages}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 오른쪽 박스 (30%) */}
                                <Box
                                    sx={{
                                        flex: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={quotaUsedPercent}
                                        size={110}
                                        thickness={4}
                                        sx={{ color: '#09e3a9' }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="caption" component="div" color="textSecondary" sx={{ fontSize: '1rem' }}>
                                            {`${quotaUsedPercent.toFixed(1)}%`}
                                        </Typography>
                                        <Typography variant="caption" component="div" color="textSecondary" sx={{ fontSize: '0.9rem' }}>
                                            {`${usedQuotaGB} GB / ${totalQuotaGB} GB`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminEmail;
