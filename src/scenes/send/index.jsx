import { Box, Button, Typography, useTheme } from "@mui/material";
import { Header } from "../../components";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]); // 필터링된 리스트
    const [writer, setWriter] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태 추가
    const PageCount = 10; // 한 페이지에 표시할 항목 수
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("모두보기"); // 현재 필터 상태

    const getinfo = () => {
        axios.get("/api/elecapp/getinfo")
            .then(res => {
                setWriter(res.data.name);
            });
    };

    const getList = () => {
        axios.post("/api/elecapp/sentapp", { writer: writer })
            .then(res => {
                setList(res.data);
                applyFilter(activeFilter, res.data); // 현재 필터 적용
            })
            .catch(err => {
                console.error('데이터를 가져오는 중 오류 발생:', err);
            });
    };

    useEffect(() => {
        getinfo();
        getList();
    }, []);

    useEffect(() => {
        // writer가 업데이트된 후 목록을 다시 불러옵니다.
        getList();
    }, [writer]);

    // 필터링 로직
    const applyFilter = (filterType, data = list) => {
        let filteredData = data;
        if (filterType === "발신") {
            filteredData = data.filter(item => item.approveStatus !== 1); // 임시저장이 아닌 항목들
        } else if (filterType === "임시저장") {
            filteredData = data.filter(item => item.approveStatus === 1); // 임시저장 항목들
        }
        setFilteredList(filteredData);
        setCurrentPage(1); // 필터 적용 시 첫 페이지로 이동
    };

    // 버튼 클릭 핸들러
    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType); // 필터 상태 업데이트
        applyFilter(filterType); // 필터 적용
    };

    // 현재 페이지에 해당하는 데이터를 슬라이싱하여 가져오기
    const currentData = filteredList.slice((currentPage - 1) * PageCount, currentPage * PageCount);

    // 빈 행 추가를 위한 배열 생성
    const binpage = Array.from({ length: PageCount - currentData.length });

    // "다음" 버튼 클릭 핸들러
    const handleNextPage = () => {
        setCurrentPage((Page) => Math.min(Page + 1, totalPage)); // 마지막 페이지를 넘어가지 않도록 수정
    };

    // "이전" 버튼 클릭 핸들러
    const handlePrevPage = () => {
        setCurrentPage((Page) => Math.max(Page - 1, 1)); // 첫 페이지를 넘지 않도록 수정
    };

    // 총 페이지 수 계산
    const totalPage = Math.ceil(filteredList.length / PageCount);

    // 디테일 페이지 이동
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

    return (
        <Box m="20px">
            <Header title="발신목록" subtitle="List of Invoice Balances" />
            <Box mt="40px" height="75vh" maxWidth="100%">
                <Button onClick={() => handleFilterClick("모두보기")}>모두보기</Button>
                <Button onClick={() => handleFilterClick("발신")}>발신</Button>
                <Button onClick={() => handleFilterClick("임시저장")}>임시저장</Button>

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
                            <tr key={idx} style={{ lineHeight: '30px' }} onClick={() => moveDetail(item)}>
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
                                disabled={currentPage === totalPage} // 마지막 페이지에서 비활성화
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
