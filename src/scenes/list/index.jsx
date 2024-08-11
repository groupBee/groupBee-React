import { Box, FormControl, InputLabel, Select, useTheme, MenuItem } from "@mui/material";
import { Header } from "../../components";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../theme";
import { NavLink } from "react-router-dom";

const List = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [list, setList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const memberId = "손가원"; // 실제 멤버 ID로 교체 필요
    const [status,setStatus]=useState("all");

    const getStatusCount = () => {
            if(status=="all"){
            axios(`/api/elecapp/allreceived?memberId=${memberId}`)
            .then(res=>{
                setFilteredData(res.data);
            })
        }else{
            axios(`/api/elecapp/status?memberId=${memberId}&status=${status}`)
            .then(res=>{
                setFilteredData(res.data);
            })
        }
    };

    useEffect(() => {
     
        getStatusCount(); // 컴포넌트가 마운트될 때 데이터 로드
    }, []);

    const handleStatusChange = (event) => {
        //status 보내기
        console.log("status="+status)
    };
    useEffect(() => {
        getStatusCount();
        handleStatusChange(); // 컴포넌트가 마운트될 때 데이터 로드
    }, [status]);

    return (
        <Box m="20px">
            <Header title="결재현황" subtitle="List of Contacts for Future Reference" />
            <Box mb="20px" display="flex" justifyContent="flex-end">
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel id="status-select-label">결재 상태</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="결재 상태"
                    >
                        <MenuItem value="all">모두 보기</MenuItem>
                        <MenuItem value="ready">결재 대기</MenuItem>
                        <MenuItem value="ing">결재 중</MenuItem>
                        <MenuItem value="done">결재 완료</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.gray[100]} !important`,
                    },
                }}
            >
                   <table className="table table-bordered">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>종류</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>부서</th>
                    <th>작성일</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                
                    {   filteredData &&
                        filteredData.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    {item.appDocType === 0 ? '품의서' :
                                     item.appDocType === 1 ? '휴가신청서' :
                                     item.appDocType === 2 ? '지출보고서' : ''}
                                </td>
                                <td>
                                    <NavLink to={`/elecapp/sign/${item.appDocType}/${memberId}/${item.id}`}>
                                    {
                                        item.additionalFields.title?item.additionalFields.title:'휴가신청서'
                                    }</NavLink>
                                </td>
                                <td>{item.writer}</td>
                                <td>{item.department}</td>
                                <td>
                                    {
                                       item.writeday.substring(0,10)
                                    }
                                </td>
                                <td>
                                    {
                                        


                                    }
                               </td>
                            </tr>
                        ))
                    }
                
                
            </tbody>
        </table>
            </Box>
        </Box>
    );
};

export default List;
