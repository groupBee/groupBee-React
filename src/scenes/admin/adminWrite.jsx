import React, {useEffect, useState} from 'react';
import {
    Box,
    FormControlLabel,
    IconButton,
    InputBase,
    MenuItem,
    Modal, Radio,
    RadioGroup,
    Select,
    Typography, useMediaQuery
} from "@mui/material";
import {MenuOutlined, SearchOutlined} from "@mui/icons-material";
import {Table} from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPaginate from 'react-paginate';

const AdminWrite = () => {
    const [sortOrder, setSortOrder] = useState('default');
    const isMdDevices = useMediaQuery("(max-width:768px)");
    const isXsDevices = useMediaQuery("(max-width:466px)");
    const [apiData, setApiData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // react-paginate는 0부터 시작
    const [itemsPerPage] = useState(12); // 페이지당 항목 수

    const fetchData = async () => {
        try {
            const response = await fetch('/api/admin/elecapp/list');
            const data = await response.json();  // 데이터를 JSON으로 변환
            console.log(data);
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

    const handleDelete = async (id) => {
        try {
            // GET 요청을 보내고, 쿼리 파라미터로 id를 전달합니다.
            const response = await fetch(`/api/admin/elecapp/delete?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 응답이 정상적으로 오면 API에서 항목을 삭제하고 상태를 업데이트합니다.
            if (response.ok) {
                // 삭제 성공 시 데이터 갱신
                setApiData(prevData => prevData.filter(item => item.id !== id));
                console.log(`Successfully deleted item with id: ${id}`);
            } else {
                console.error('Failed to delete item:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredData = apiData.filter(item => item.approveStatus === 0);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate();
        const hours = date.getHours();

        return `${year}년 ${month}월 ${day}일 ${hours}시`;
    };

    // 페이지네이션 관련 데이터 계산
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                        <th style={{textAlign: "center", width:'10%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>번호</th>
                        <th style={{textAlign: "center", width:'10%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>종류</th>
                        <th style={{textAlign: "center", width:'15%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>제목</th>
                        <th style={{textAlign: "center", width:'15%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>작성자</th>
                        <th style={{textAlign: "center", width:'15%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>부서</th>
                        <th style={{textAlign: "center", width:'15%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>작성일</th>
                        <th style={{textAlign: "center", width:'10%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>상태</th>
                        <th style={{textAlign: "center", width:'10%', fontSize:'16px', backgroundColor: '#ff7546', color: 'white'}}>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((elec, index) => (
                        <tr key={index}
                         >
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{index+1}</td>
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{elec.appDocType === 0 ? '품 의 서' : elec.appDocType === 1 ? '휴 가 신 청 서' : '지 출 보 고 서'}</td>
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{elec.additionalFields.title === '' ? '제목없음' : elec.additionalFields.title}</td>
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{elec.writer}</td>
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{elec.department}</td>
                            <td style={{textAlign: "center",  paddingTop: "15px"}}>{formatDate(elec.writeday)}</td>
                            <td style={{
                                textAlign: "center",
                                paddingTop: "15px",
                            }}>
                                   <span style={{
                                       color: elec.approveType === 0 ? '#ff501c' : elec.approveType === 1 ? '#ff8800' : elec.approveType === 2 ? '#ff8800' : '#75d5b3',
                                       backgroundColor: elec.approveType === 0 ? '#ffece6' : elec.approveType === 1 ? '#ffefdf' : elec.approveType === 2 ? '#ffefdf' : '#e7f9f1',
                                       padding: '3px 4px',
                                       borderRadius: '4px'
                                   }}>
                                {elec.approveType === 0 ? '반려' : elec.approveType === 1 ? '결재중' : elec.approveType === 2 ? '결재중' : '결재완료'}
                                   </span>
                            </td>
                            <td style={{textAlign: "center"}}>
                                <IconButton onClick={() => handleDelete(elec.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"이전"}
                    nextLabel={"다음"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </Box>
        </Box>
    );
};

export default AdminWrite;