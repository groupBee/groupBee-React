import React, { useEffect, useState } from "react";
import {
    Box, FormControl, InputLabel, Select, MenuItem, Button, Typography,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
    Pagination
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [writer, setWriter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PageCount = 10;
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("모두보기");

    const getinfo = () => {
        axios.get("/api/elecapp/getinfo")
            .then(res => {
                setWriter(res.data.name);
            });
    };

    const getList = () => {
        axios.post("/api/elecapp/sentapp", { writer: writer })
            .then(res => {
                const sortedData = res.data.sort((a, b) => new Date(b.writeday) - new Date(a.writeday));
                setList(sortedData);
                applyFilter(activeFilter, sortedData);
            })
            .catch(err => {
                console.error('데이터를 가져오는 중 오류 발생:', err);
            });
    };

    useEffect(() => {
        getinfo();
    }, []);

    useEffect(() => {
        if (writer) {
            getList();
        }
    }, [writer]);

    const applyFilter = (filterType, data = list) => {
        let filteredData = data;
        if (filterType === "발신") {
            filteredData = data.filter(item => item.approveStatus !== 1);
        } else if (filterType === "임시저장") {
            filteredData = data.filter(item => item.approveStatus === 1);
        }
        setFilteredList(filteredData);
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        const filterType = event.target.value;
        setActiveFilter(filterType);
        applyFilter(filterType);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}시 ${minutes}분`;
        }
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };

    const moveDetail = (item) => {
        if (item.approveStatus === 1) {
            navigate("/write", {
                state: {
                    memberId: writer,
                    itemId: item.id
                }
            });
        } else {
            navigate("/detail", {
                state: {
                    memberId: writer,
                    itemId: item.id
                }
            });
        }
    };

    const indexOfLastItem = currentPage * PageCount;
    const indexOfFirstItem = indexOfLastItem - PageCount;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(filteredList.length / PageCount);

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
                    발신목록
                    <FormControl variant="outlined" size="small" style={{minWidth: 120}}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            value={activeFilter}
                            onChange={handleFilterChange}
                            label="상태"
                        >
                            <MenuItem value="모두보기">모두보기</MenuItem>
                            <MenuItem value="발신">발신</MenuItem>
                            <MenuItem value="임시저장">임시저장</MenuItem>
                        </Select>
                    </FormControl>
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold', height:'52px'}}>번호</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>종류</TableCell>
                            <TableCell style={{ textAlign: "center", width: '30%', fontSize: '0.9rem', fontWeight: 'bold' }}>제목</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성자</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>부서</TableCell>
                            <TableCell style={{ textAlign: "center", width: '20%', fontSize: '0.9rem', fontWeight: 'bold' }}>작성일</TableCell>
                            <TableCell style={{ textAlign: "center", width: '10%', fontSize: '0.9rem', fontWeight: 'bold' }}>상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((item, idx) => (
                            <TableRow
                                key={idx}
                                onClick={() => moveDetail(item)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                        '& *': { color: '#ffb121' },
                                    },
                                }}
                            >
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem', height:'74px'}}>{(currentPage - 1) * PageCount + idx + 1}</TableCell>
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem' }}>
                                    {item.appDocType === 0 ? '품의서' : item.appDocType === 1 ? '휴가신청서' : '지출보고서'}
                                </TableCell>
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem' }}>
                                    {item.appDocType === 1
                                        ? '휴가신청서'
                                        : item.additionalFields.title
                                            ? item.additionalFields.title
                                            : !item.additionalFields.title && item.appDocType === 0
                                                ? <span style={{ color: 'gray' }}>{item.writeday.substring(0, 10) + "_품의서"}</span>
                                                : !item.additionalFields.title && item.appDocType === 2
                                                    ? <span style={{ color: 'gray' }}>{item.writeday.substring(0, 10) + "_지출보고서"}</span>
                                                    : ''
                                    }
                                </TableCell>
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem' }}>{item.writer}</TableCell>
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem' }}>{item.department}</TableCell>
                                <TableCell style={{ textAlign: "center", fontSize: '0.9rem' }}>{formatDate(item.writeday)}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <span style={{
                                        color: item.approveType === 0 ? '#ff501c' : item.approveType === 1 ? '#ff8800' : item.approveType === 2 ? '#ff8800' : '#75d5b3',
                                        backgroundColor: item.approveType === 0 ? '#ffece6' : item.approveType === 1 ? '#ffefdf' : item.approveType === 2 ? '#ffefdf' : '#e7f9f1',
                                        padding: '3px 4px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {item.approveStatus === 1 ? '임시저장' : item.approveType === 0 ? '반려' : item.approveType === 1 ? '제출완료' : item.approveType === 2 ? '진행중' : '결재완료'}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Pagination
                    count={totalPage}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    siblingCount={2}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#000',
                            fontSize: '14px',
                            '&:hover': {
                                backgroundColor: '#ffb121',
                                color: 'white',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#ffb121',
                                color: 'white',
                            },
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: '#ffb121',
                        },
                        '& .MuiPaginationItem-icon': {
                            color: '#000',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default Invoices;