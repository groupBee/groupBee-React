import { Box, FormControl, InputLabel, Select, useTheme, MenuItem, Button } from "@mui/material";
import { Header } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../theme";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Detail from "./Detail.jsx";
import { each } from "jquery";


const List = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [memberId, setMemberId] = useState("");
    const [status, setStatus] = useState("all");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태 추가
    const PageCount = 10; // 한 페이지에 표시할 항목 수

    const moveDetail = (itemId) => {
        navigate("/detail", {
            state: {
                memberId: memberId,
                itemId: itemId
            }
        });
    };

    const getinfo = async () => {
        try {
            const res = await axios.get("/api/elecapp/getinfo");
            const fetchedMemberId = res.data.name;
            setMemberId(fetchedMemberId);
            getList(fetchedMemberId); // getList를 getinfo 호출 후에 호출
        } catch (err) {
            console.error("Error fetching info:", err);
        }
    };

    const getList = async (fetchedMemberId) => {
        // if (!fetchedMemberId) return; // memberId가 비어 있으면 실행하지 않음
        try {
            const res = await axios.get(`/api/elecapp/status?memberId=${fetchedMemberId}&status=${status}`);
            setFilteredData(res.data);
            console.log(res.data)
        } catch (err) {
            console.error("Error fetching list:", err);
        }
    };

    const handleChange = (e) => {
        setStatus(e);
        setCurrentPage(1); // 상태가 바뀔 때 페이지 번호 초기화
    };

    useEffect(() => {
        getinfo(); // 컴포넌트가 마운트될 때 한 번만 실행
    }, []);

    useEffect(() => {
        if (memberId) {
            getList(memberId); // memberId가 설정된 후에 getList 호출
        }
    }, [status, currentPage, memberId]);

    // 현재 페이지에 해당하는 데이터를 슬라이싱하여 가져오기
    const currentData = filteredData.slice((currentPage - 1) * PageCount, currentPage * PageCount);

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
    const totalPage = Math.ceil(filteredData.length / PageCount);
    // 날짜를 포맷팅하는 함수
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ''; // 유효하지 않은 날짜일 경우 빈 문자열 반환
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            // 오늘 날짜일 경우 시간 정보를 "시:분"으로 출력
            const hours = date.getHours().toString().padStart(2, '0');  // 시를 두 자리로 맞춤
            const minutes = date.getMinutes().toString().padStart(2, '0');  // 분을 두 자리로 맞춤
            return `${hours}시 ${minutes}분`;
        }
        // 기타 날짜일 경우 "YYYY-MM-DD" 형식으로 출력
        const year = date.getFullYear();  // 년도
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // 월 (0부터 시작하므로 +1)
        const day = date.getDate().toString().padStart(2, '0');  // 일
        return `${year}년 ${month}월 ${day}일`;
    };


    return (
        <Box m="20px">
            <Header title="결재현황" subtitle="List of Contacts for Future Reference" />
            <Box mb="20px" display="flex" justifyContent="center">
                <div >
                    <Button variant="outlined" color='warning' onClick={(e) => handleChange("all")}>모두 보기</Button>
                    <Button variant="outlined" color='warning' onClick={(e) => handleChange("rejected")}>반려 </Button>
                    <Button variant="outlined" color='warning' onClick={(e) => handleChange("ready")}>결재 대기</Button>
                    <Button variant="outlined" color='warning' onClick={(e) => handleChange("ing")}>결재 중</Button>
                    <Button variant="outlined" color='warning' onClick={(e) => handleChange("done")}>결재 완료</Button>
                </div>

            </Box>

            <table className="table table-bordered">
                <thead>
                    <tr style={{ border: 'none', lineHeight: '30px' }}>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', borderRadius: '5px 0 0 0', width: '10%', paddingLeft: '1.5%' }}>번호</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '15%' }}>종류</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '30%' }}>제목</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '10%' }}>작성자</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '10%' }}>부서</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', width: '15%' }}>작성일</td>
                        <td style={{ backgroundColor: '#ffb121', border: 'none', borderRadius: '0 5px 0 0', width: '10%' }}>상태</td>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((item, idx) => (
                            <tr key={idx} style={{ lineHeight: '30px', cursor: 'pointer' }}
                                onMouseOver={(e) => {
                                    const tds = e.currentTarget.querySelectorAll('td');
                                    tds.forEach(td => td.style.color = "#ffb121"); // 모든 td 색상 변경
                                }}
                                onMouseOut={(e) => {
                                    const tds = e.currentTarget.querySelectorAll('td');
                                    tds.forEach(td => td.style.color = "inherit"); // 색상 원래대로 복원
                                }}
                                onClick={() => moveDetail(item.id)} // 행을 클릭했을 때 상세 페이지로 이동
                            >
                                <td style={{ borderRight: 'none', borderLeft: 'none', paddingLeft: '1.5%' }}>{(currentPage - 1) * PageCount + idx + 1}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {item.appDocType === 0 ? '품의서' :
                                        item.appDocType === 1 ? '휴가신청서' :
                                            item.appDocType === 2 ? '지출보고서' : ''}
                                </td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {item.additionalFields.title ? item.additionalFields.title : '휴가신청서'}
                                </td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>{item.writer}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>{item.department}</td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {
                                        formatDate(item.writeday)
                                    }
                                </td>
                                <td style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    {item.additionalFields.status}
                                </td>
                            </tr>
                        ))
                    ) : (

                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>없습니다</td>
                        </tr>

                    )}
                    {binpage.length > 0 && currentData.length > 0 && binpage.map((_, idx) => (
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
                                disabled={filteredData.length <= currentPage * PageCount}
                            >
                                다음
                            </Button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </Box>
    );
};

export default List;