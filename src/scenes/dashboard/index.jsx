import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");
    const [filteredData, setFilteredData] = useState([]);
    const [memberId, setMemberId] = useState("");
    const [status, setStatus] = useState("all"); // 기본 상태는 'all'
    const navigate = useNavigate(); // navigate 함수 생성

    const handleBoard = () => {
        navigate("/board");
    };

    const handleCalendar = () => {
        navigate("/calendar");
    };

    // 이메일 리스트를 보여주는 버튼
    const handleEmailList = () => {
        navigate("/email", { state: { view: "list" } });
    };

    // 이메일 쓰기 화면을 보여주는 버튼
    const handleEmailWrite = () => {
        navigate("/email", { state: { view: "send" } });
    };

    const handleList = () => {
        navigate("/list");
    };

    const handleBook = () => {
        navigate("/book/booklist");
    };

    const handleCarBook = () => {
        navigate("/book/carbook");
    };

    const getinfo = async () => {
        try {
            const res = await axios.get("/api/elecapp/getinfo");
            const fetchedMemberId = res.data.name;
            setMemberId(fetchedMemberId);
            getList(fetchedMemberId); // getinfo 호출 후 getList 호출
        } catch (err) {
            console.error("Error fetching info:", err);
        }
    };

    const getList = async (fetchedMemberId) => {
        if (!fetchedMemberId) return; // memberId가 비어 있으면 실행하지 않음
        try {
            const res = await axios.get(`/api/elecapp/status?memberId=${fetchedMemberId}&status=${status}`);
            setFilteredData(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Error fetching list:", err);
        }
    };


    // 상태 변경 시 getList 호출
    useEffect(() => {
        if (memberId) {
            getList(memberId);
        }
    }, [status, memberId]);

    // 컴포넌트가 마운트될 때 getinfo 호출
    useEffect(() => {
        getinfo();
    }, []);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="flex-end" mb="20px">
                <Button style={{ marginRight: '10px' }} onClick={handleCarBook}>예약하기</Button>
                <Button onClick={handleEmailWrite}>메일보내기</Button>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns={
                    isXlDevices
                        ? "repeat(12, 1fr)"
                        : isMdDevices
                            ? "repeat(6, 1fr)"
                            : "repeat(3, 1fr)"
                }
                gridAutoRows="140px"
                gap="20px"
            >
                {/* ---------------- Row 2 ---------------- */}

                {/* Line Chart */}
                <Box
                    gridColumn={
                        isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
                    }
                    gridRow="span 3"
                    bgcolor={colors.primary[400]}
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            공지사항
                            <IconButton onClick={handleBoard}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>

                {/* Transaction Data */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 3"
                    bgcolor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            캘린더
                            <IconButton onClick={handleCalendar}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>

                {/* Revenue Details */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            이메일
                            <IconButton onClick={handleEmailList}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>

                {/* Bar Chart */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="hidden" // 스크롤을 추가할 박스 아래쪽
                    display="flex"
                    flexDirection="column"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px" flexShrink={0}>
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            결제현황
                            <IconButton onClick={handleList}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box p="15px" flexGrow={1} overflow="auto">
                        {/* 결제 상태 필터 버튼 */}
                        <Box display="flex" justifyContent="space-around" mb="10px">
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("rejected")}>반려</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ready")}>결재 대기</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("ing")}>결재 중</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("done")}>결제 완료</Button>
                            <Button style={{ color: '#ffb121' }} onClick={() => setStatus("all")}>모두 보기</Button>
                        </Box>

                        {/* 필터링된 데이터 표시 */}
                        {filteredData.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                <tr style={{ borderRight: 'none', borderLeft: 'none' }}>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>종류</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>제목</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>작성자</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>부서</td>
                                    <td style={{ borderRight: 'none', borderLeft: 'none', textAlign:'center'}}>상태</td>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{width:'15%', textAlign:'center'}}>
                                            {item.appDocType === 0 ? '품의서' :
                                                item.appDocType === 1 ? '휴가신청서' :
                                                    item.appDocType === 2 ? '지출보고서' : ''}
                                        </td>
                                        <td style={{width:'37%'}}>{item.additionalFields.title || '제목 없음'}</td>
                                        <td style={{width:'15%', textAlign:'center'}}>{item.writer}</td>
                                        <td style={{width:'16%', textAlign:'center'}}>{item.department}</td>
                                        <td style={{width:'17%', textAlign:'center'}}>{item.additionalFields.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <Typography variant="body1" color="textSecondary">데이터가 없습니다.</Typography>
                        )}
                    </Box>
                </Box>

                {/* Geography Chart */}
                <Box
                    gridColumn={isXlDevices ? "span 4" : "span 3"}
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            예약현황
                            <IconButton onClick={handleBook}>
                                <MoreHoriz style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Dashboard;
