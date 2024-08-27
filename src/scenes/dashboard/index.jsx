import {
    Box,
    Button,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    Add,
} from "@mui/icons-material";
import {tokens} from "../../theme";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXlDevices = useMediaQuery("(min-width: 1260px)");
    const isMdDevices = useMediaQuery("(min-width: 724px)");
    const isXsDevices = useMediaQuery("(max-width: 436px)");

    const navigate = useNavigate(); // navigate 함수 생성

    const handleBoard = () => {
        navigate("/board");
    };

    const handleCalendar = () => {
        navigate("/calendar");
    };

    const handleEmail = () => {
        navigate("/email");
    };

    const handleList = () => {
        navigate("/list");
    };

    const handleBook = () => {
        navigate("/book");
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="flex-end" mb="20px">
                <Button style={{ marginRight: '10px' }}>일정예약</Button>
                <Button>메일보내기</Button>
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
                                <Add style={{ color: "gray" }} />
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
                                <Add style={{ color: "gray" }} />
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
                            <IconButton onClick={handleEmail}>
                                <Add style={{ color: "gray" }} />
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
                    overflow="auto"
                >
                    <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                        <Typography color={colors.gray[100]} variant="h5" fontWeight="600" display="flex" justifyContent="space-between" alignItems="center">
                            결제현황
                            <IconButton onClick={handleList}>
                                <Add style={{ color: "gray" }} />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Box></Box>
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
                                <Add style={{ color: "gray" }} />
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
