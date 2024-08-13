import {Box, FormControl, InputLabel, Select, useTheme, MenuItem, Button} from "@mui/material";
import { Header } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../../theme";
import {NavLink, useNavigate} from "react-router-dom";

const List = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [filteredData, setFilteredData] = useState([]);
    const memberId = "손가투"; // 실제 멤버 ID로 교체 필요
    const [status,setStatus]=useState("all");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태 추가
    const PageCount = 10; // 한 페이지에 표시할 항목 수

    const handleChange = (e) => {
        const selectedStatus = e.target.value;
        setStatus(selectedStatus);
        setCurrentPage(1); // 상태가 바뀔 때 페이지 번호 초기화
        navigate(`/${memberId}/${selectedStatus}/${sort}`);
    }

    const getStatusCount = () => {
            if(status==="all"){
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
    }, [status, currentPage]);
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

    // 클릭된 행을 링크로 리다이렉트하는 함수
    const trClick = (appDocType, id) => {
        navigate(`/elecapp/sign/${appDocType}/${memberId}/${id}`);
    };


    return (
        <Box m="20px">
            <Header title="결재현황" subtitle="List of Contacts for Future Reference" />
            <Box mb="20px" display="flex" justifyContent="flex-end">
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel id="status-select-label">결재 상태</InputLabel>
                    <Select
                        labelId="status-select-label"
                        value={status}
                        onChange={handleChange}
                        label="결재 상태"
                    >
                        <MenuItem value="all">모두 보기</MenuItem>
                        <MenuItem value="ready">결재 대기</MenuItem>
                        <MenuItem value="ing">결재 중</MenuItem>
                        <MenuItem value="done">결재 완료</MenuItem>
                    </Select>
                </FormControl>
            </Box>

                   <table className="table table-bordered">
            <thead>
                <tr style={{border:'none',lineHeight:'30px'}}>
                    <td style={{backgroundColor:'#ffb121',border:'none',borderRadius:'5px 0 0 0',width:'10%',paddingLeft:'1.5%'}}>번호</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',width:'15%'}}>종류</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',width:'30%'}}>제목</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',width:'10%'}}>작성자</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',width:'10%'}}>부서</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',width:'15%'}}>작성일</td>
                    <td style={{backgroundColor:'#ffb121',border:'none',borderRadius:'0 5px 0 0',width:'10%'}}>상태</td>
                </tr>
            </thead>
            <tbody>
                
                    {   currentData &&
                        currentData.map((item, idx) => (
                            <tr key={idx} style={{lineHeight:'30px',cursor:'pointer'}} onClick={() => trClick(item.appDocType, item.id)}>
                                <td style={{borderRight:'none',borderLeft:'none',paddingLeft:'1.5%'}}>{(currentPage - 1) * PageCount + idx + 1}</td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>
                                    {item.appDocType === 0 ? '품의서' :
                                     item.appDocType === 1 ? '휴가신청서' :
                                     item.appDocType === 2 ? '지출보고서' : ''}
                                </td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>
                                    <NavLink to={`/elecapp/sign/${item.appDocType}/${memberId}/${item.id}`} style={{color:'black',textDecoration:'none'}}>
                                    {
                                        item.additionalFields.title?item.additionalFields.title:'휴가신청서'
                                    }</NavLink>
                                </td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>{item.writer}</td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>{item.department}</td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>
                                    {
                                       item.writeday.substring(0,10)
                                    }
                                </td>
                                <td style={{borderRight:'none',borderLeft:'none'}}>
                                    {item.approveType == 0 ? '반려' : item.approveType == 1 ? '제출완료' : item.approveType == 2 ? '진행중' : '결재완료'}
                               </td>
                            </tr>
                        ))
                    }
                    {binpage.map((_, idx) => (
                        <tr key={`empty-${idx}`} style={{lineHeight: '30px', border: 'none'}}>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
                            <td style={{border: 'none'}}>&nbsp;</td>
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
                               <span style={{margin: '0 10px'}}>
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
