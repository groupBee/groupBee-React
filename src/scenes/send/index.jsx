import { Box, Button, Typography, useTheme } from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";

const Invoices = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [list, setList] = useState([]);
    const [writer, setWriter] = useState('김창인');
    const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태 추가
    const PageCount = 10; // 한 페이지에 표시할 항목 수

    const getinfo = () => {
        axios.get("/api/elecapp/getinfo")
            .then(res => {
                setWriter(res.data.name);
            });
    }

    useEffect(() => {
        getinfo();
        getList();
    }, []);

    const getList = () => {
        axios.post("/api/elecapp/sentapp", { writer: writer })
            .then(res => {
                setList(res.data);
             
            })
            .catch(err => {
                console.error('데이터를 가져오는 중 오류 발생:', err);
            });
    }

    useEffect(() => {
        getList();
    }, [writer, currentPage]);

    const fillterStatus = () => {
        const filteredList = list.filter(item => item.approveStatus === 1);
        setList(filteredList);
    }

    // 현재 페이지에 해당하는 데이터를 슬라이싱하여 가져오기
    const currentData = list.slice((currentPage - 1) * PageCount, currentPage * PageCount);

    // 빈 행 추가를 위한 배열 생성
    const binpage = Array.from({ length: PageCount - currentData.length });

    // "다음" 버튼 클릭 핸들러
    const handleNextPage = () => {
        setCurrentPage(Page => Page + 1);
    };

    // "이전" 버튼 클릭 핸들러
    const handlePrevPage = () => {
        setCurrentPage(Page => Page - 1);
    };

    // 총 페이지 수 계산
    const totalPage = Math.ceil(list.length / PageCount);

    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phone",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "cost",
            headerName: "Cost",
            flex: 1,
            renderCell: (params) => (
                <Typography color={colors.greenAccent[500]}>
                    ${params.row.cost}
                </Typography>
            ),
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        },
    ];
    
    return (
        <Box m="20px">
            <Header title="발신목록" subtitle="List of Invoice Balances" />
            <Box
                mt="40px" 
                height="75vh"
                maxWidth="100%"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        border: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.yellowAccent[1000],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.yellowAccent[1000],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-iconSeparator": {
                        color: colors.primary[100],
                    },
                }}
            >
                
                <Button onClick={getList} >발신</Button>
                <Button onClick={fillterStatus}>임시저장</Button>

                <table className="table table-bordered">
                    <caption></caption>
                    <thead>
                    <tr style={{ border: 'none', lineHeight: '30px' }}>
                        <td style={{
                            backgroundColor: '#ffb121',
                            border: 'none',
                            borderRadius: '5px 0 0 0',
                            width: '10%',
                            paddingLeft: '1.5%'
                        }}>번호
                        </td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '15%' }}>종류</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '30%' }}>제목</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '10%' }}>작성자</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '10%' }}>부서</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '15%' }}>작성일</td>
                        <td style={{
                            backgroundColor: '#ffb121',
                            border: 'none',
                            borderRadius: '0 5px 0 0',
                            width: '10%'
                        }}>상태
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {currentData &&
                        currentData.map((item, idx) => (
                            <tr key={idx} style={{ lineHeight: '30px' }}>
                                <td style={{ borderRight: 'none', borderLeft: 'none', paddingLeft: '1.5%' }}>{(currentPage - 1) * PageCount + idx + 1}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {item.appDocType === 0 ? '품의서' :
                                        item.appDocType === 1 ? '휴가신청서' :
                                            item.appDocType === 2 ? '지출보고서' : ''}
                                </td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {
                                        item.additionalFields.title ? item.additionalFields.title : '휴가신청서'
                                    }
                                </td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>{item.writer}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>{item.department}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {
                                        item.writeday.substring(0, 10)
                                    }
                                </td>
                                {/* 유효한 날짜 값이 없을 경우 'N/A' 표시 */}
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>{item.approveStatus === 1?'임시저장':item.approveType === 0 ? '반려' : item.approveType === 1 ? '제출완료' : item.approveType === 2 ? '진행중' : '결재완료'}</td>
                            </tr>
                        ))
                    }
                    {binpage.map((_, idx) => (
                        <tr key={`empty-${idx}`} style={{ lineHeight: '30px', border: 'none' }}>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                            <td style={{ border: 'none' }}>&nbsp;</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={7} style={{
                            border: 'none',
                            lineHeight: '30px',
                            backgroundColor: '#ffb121',
                            textAlign: 'right'
                        }}>
                            <span style={{ margin: '0 10px' }}>
                                {currentPage} / {totalPage}
                            </span>
                            <Button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1} // 첫 페이지에서는 비활성화
                            >
                                이전
                            </Button>
                            <Button
                                onClick={handleNextPage}
                                disabled={list.length <= currentPage * PageCount}
                            >
                                다음
                            </Button>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </Box>
        </Box>
    );
};

export default Invoices;
