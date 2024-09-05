import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Button, Box, Checkbox, IconButton, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from "react-router-dom";

//부서 리스트, 멤버리스트, 멤버디테일
const OrganizationChart = () => {
    const [departmentList, setDepartmentList] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDepartmentNames, setSelectedDepartmentNames] = useState([]);

    //시작하자마자 정보들 불러오기
    useEffect(() => {
        getDepartmentList();
        getEmployeeList();
    }, []);
    //부서정보 불러오기
    const getDepartmentList = () => {
        axios.get("/api/department/all")
            .then(res => {
                setDepartmentList(res.data);
            });
    };
// 사원정보 불러오기
    const getEmployeeList = () => {
        axios.get("/api/employee/list")
            .then(res => {
                const activeEmployees = res.data.filter(employee => employee.membershipStatus === true);
                setEmployeeList(activeEmployees);
                console.log(activeEmployees);
            });
    };
    //부서 분류하기 함수 -->바뀔때마다 호출
    const structuredDepartments = departmentList.reduce((acc, curr) => {
        const baseId = Math.floor(curr.id / 100) * 100;
        const subId = Math.floor(curr.id / 10) * 10;

        if (!acc[baseId]) {
            acc[baseId] = { id: baseId, departmentName: '', subDepartments: {} };
        }

        if (baseId === curr.id) {
            acc[baseId].departmentName = curr.departmentName;
        } else if (subId === curr.id) {
            if (!acc[baseId].subDepartments[subId]) {
                acc[baseId].subDepartments[subId] = { id: subId, departmentName: '', subDepartments: {} };
            }
            acc[baseId].subDepartments[subId].departmentName = curr.departmentName;
        } else {
            const parentSubId = Math.floor(curr.id / 10) * 10;
            if (!acc[baseId].subDepartments[parentSubId]) {
                acc[baseId].subDepartments[parentSubId] = { id: parentSubId, departmentName: '', subDepartments: {} };
            }
            acc[baseId].subDepartments[parentSubId].subDepartments[curr.id] = { id: curr.id, departmentName: curr.departmentName };
        }

        return acc;
    }, {});
    //부서 눌렀을때 하위부서 있으면 하위부서로 출력되고 없으면 해당 부서의 사윈 목록 출력
    const handleDepartmentSelect = (id, hasSubDepartments) => {
        const departmentNames = findDepartmentNames(id);
        setSelectedDepartmentNames(departmentNames);

        if (hasSubDepartments) {
            setExpandedDepartments(prevState =>
                prevState.includes(id) ? prevState.filter(expandedId => expandedId !== id) : [...prevState, id]
            );
        } else {
            filterEmployees(id);
        }
    };

// 선택된 부서의 이름을 찾는 함수
    const findDepartmentNames = (departmentId) => {
        let names = [];
        const traverse = (dept, acc) => {
            if (dept.id === departmentId) {
                acc.push(dept.departmentName);
                return acc;
            }

            if (dept.subDepartments) {
                for (const subDept of Object.values(dept.subDepartments)) {
                    const result = traverse(subDept, [...acc, dept.departmentName]);
                    if (result.length) return result;
                }
            }
            return [];
        };

        return traverse(structuredDepartments[Math.floor(departmentId / 100) * 100], []);
    };
    const filterEmployees = (num, hasSubDepartments) => {
        const employeesInDepartment = employeeList.filter(employee => employee.department.id === num);
        if (hasSubDepartments) {
            const subDepartments = findAllSubDepartments(num);
            const employeesInSubDepartments = subDepartments.flatMap(subDept =>
                employeeList.filter(employee => employee.department.id === subDept.id)
            );
            setFilteredEmployees([...employeesInDepartment, ...employeesInSubDepartments]);
        } else {
            setFilteredEmployees(employeesInDepartment);
        }
    };

    const findAllSubDepartments = (departmentId) => {
        let subDepartments = [];
        const traverse = (dept) => {
            if (dept.subDepartments) {
                Object.values(dept.subDepartments).forEach(subDept => {
                    subDepartments.push(subDept);
                    traverse(subDept);
                });
            }
        };
        traverse(structuredDepartments[departmentId]);
        return subDepartments;
    };

    const toggleSubDepartmentEmployees = (id) => {
        setShowSubDepartmentEmployees(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };
    const navigate = useNavigate();

    const handleChatClick = () => {
        window.open("https://chat.groupbee.co.kr", "_blank"); // 새 창에서 채팅 URL 열기
    };

    const handleEmailClick = () => {
        window.open(`/email?email=${encodeURIComponent(selectedEmployee.email)}`, '_blank'); // 이메일 페이지로 이동

    };

    return (
        <div style={{display: 'flex', padding: '20px',marginTop:'-15px'}}>
            <div style={{flex: 1, marginRight: '20px', padding: '10px', backgroundColor: '#f7f7f7', minHeight: '90%',paddingLeft:'20px'}}>
                <h2 style={{marginBottom:'25px'}}>부서 목록</h2>
                <ul>
                    {Object.entries(structuredDepartments).map(([key, department]) => (
                        <li
                            key={department.id}
                            onClick={() => {
                                handleDepartmentSelect(department.id, Object.keys(department.subDepartments).length > 0);
                                filterEmployees(department.id);
                            }}
                            style={{
                                cursor: 'pointer',
                                fontWeight: expandedDepartments.includes(department.id) ? 'bold' : 'normal'
                            }}
                        >
                            {department.departmentName}
                            {expandedDepartments.includes(department.id) && Object.keys(department.subDepartments).length > 0 && (
                                <ul style={{paddingLeft: '20px'}}>
                                    {Object.entries(department.subDepartments).map(([subKey, subDepartment]) => (
                                        <li
                                            key={subDepartment.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDepartmentSelect(subDepartment.id, Object.keys(subDepartment.subDepartments).length > 0);
                                                filterEmployees(subDepartment.id); // 하위 부서 클릭 시 해당 부서의 직원 필터링
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                fontWeight: expandedDepartments.includes(subDepartment.id) ? 'bold' : 'normal'
                                            }}
                                        >
                                            {subDepartment.departmentName}
                                            {expandedDepartments.includes(subDepartment.id) && Object.keys(subDepartment.subDepartments).length > 0 && (
                                                <ul style={{paddingLeft: '20px'}}>
                                                    {Object.entries(subDepartment.subDepartments).map(([subSubKey, subSubDepartment]) => (
                                                        <li
                                                            key={subSubDepartment.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDepartmentSelect(subSubDepartment.id, false); // 최하위 부서일 경우 하위 부서가 없음을 알림
                                                                filterEmployees(subSubDepartment.id); // 최하위 부서 클릭 시 해당 부서의 직원 필터링
                                                            }}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontWeight: expandedDepartments.includes(subSubDepartment.id) ? 'bold' : 'normal'
                                                            }}
                                                        >
                                                            {subSubDepartment.departmentName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{flex: 2, marginRight: '30px'}}>
                <h2 style={{marginBottom:'25px',marginTop:'10px'}}>직원 리스트</h2>
                {selectedDepartmentNames.length > 0 && (
                    <h5>
                        {selectedDepartmentNames.join(' > ')}
                    </h5>
                )}
                <ul>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <li
                                key={employee.id}
                                onClick={() => setSelectedEmployee(employee)}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: selectedEmployee?.id === employee.id ? 'bold' : 'normal',
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}
                            >
                                <Checkbox
                                    checked={selectedEmployee?.id === employee.id}
                                    onChange={() => {
                                        if (selectedEmployee?.id === employee.id) {
                                            setSelectedEmployee(null); // 동일한 직원을 다시 클릭하면 선택 해제
                                        } else {
                                            setSelectedEmployee(employee); // 새로운 직원을 클릭하면 선택
                                        }
                                    }}
                                    style={{marginRight: '10px'}}
                                />
                                <div style={{display:'flex',marginTop:'10px'}}>
                                    <img
                                        src={employee.profileFile}
                                        alt={`${employee.name}의 프로필`}
                                        style={{
                                            minWidth: '40px',
                                            maxWidth: '40px',
                                            minHeight: '40px',
                                            maxHeight: '40px',
                                            borderRadius: '50%',
                                            border: '1px solid grey',
                                            objectFit: 'cover',
                                            marginBottom: '20px'
                                        }}
                                    />
                                    <div style={{marginLeft:'20px'}}>
                                    <div>{employee.name}</div>
                                    <div>{employee.position.rank}&nbsp;&nbsp; -&nbsp; {employee.department.departmentName}&nbsp; - &nbsp;&nbsp;{employee.email}</div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>직원이 없습니다</p>
                    )}
                </ul>
            </div>

            <div style={{flex: 2,paddingLeft:'40px'}}>
                <h2 style={{marginLeft:'170px'}}>직원 정보</h2>
                {selectedEmployee ? (
                    <div style={{
                        padding: '10px',
                        minHeight: 'auto',
                        borderLeft: '3px solid #ffd454',
                        paddingLeft: '40px',
                        marginLeft: '140px'
                    }}>
                        <img
                            src={selectedEmployee.profileFile}
                            alt={`${selectedEmployee.name}의 프로필`}
                            style={{
                                minWidth: '150px',
                                maxWidth: '150px',
                                minHeight: '150px',
                                maxHeight: '150px',
                                borderRadius: '50%',
                                border: '1px solid grey',
                                objectFit: 'cover',
                                marginBottom: '20px',
                                marginTop:'20px'
                            }}
                        />
                        <div style={{display: 'flex', gap: '10px',marginBottom:'40px'}}>
                            <Button
                                variant="contained"
                                startIcon={<ChatIcon />}
                                sx={{
                                    backgroundColor: '#007bff',
                                    backgroundImage: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                    color: 'white',
                                    fontSize: '12vpx',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease', // 모든 속성에 대한 부드러운 전환
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                        backgroundImage: 'linear-gradient(135deg, #0056b3 0%, #003d80 100%)',
                                        transform: 'scale(1.05)', // 버튼을 약간 확대
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // 그림자 효과 강화
                                    },
                                    '&:focus': {
                                        outline: 'none', // 포커스 시 기본 윤곽선 제거
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // 포커스 시 그림자 강화
                                    },
                                }}
                                onClick={handleChatClick}
                            >
                                채팅
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<MailOutlineIcon />}
                                sx={{
                                    backgroundColor: '#28a745',
                                    backgroundImage: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease', // 모든 속성에 대한 부드러운 전환
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#1e7e34',
                                        backgroundImage: 'linear-gradient(135deg, #1e7e34 0%, #155d27 100%)',
                                        transform: 'scale(1.05)', // 버튼을 약간 확대
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // 그림자 효과 강화
                                    },
                                    '&:focus': {
                                        outline: 'none', // 포커스 시 기본 윤곽선 제거
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // 포커스 시 그림자 강화
                                    },
                                }}
                                onClick={handleEmailClick}
                            >
                                메일
                            </Button>
                        </div>
                        <p style={{fontSize: '13px',marginTop:'-15px'}}>이름: {selectedEmployee.name}</p>
                        <p style={{fontSize: '13px'}}>직급: {selectedEmployee.position.rank}</p>
                        <p style={{fontSize: '13px'}}>이메일: {selectedEmployee.email}</p>
                        <p style={{fontSize: '13px'}}>전화번호: {selectedEmployee.phoneNumber}</p>
                        <p style={{fontSize: '13px'}}>부서: {selectedEmployee.department.departmentName}</p>
                        <p style={{fontSize: '13px'}}>입사일: {selectedEmployee.firstDay ? selectedEmployee.firstDay : '정보 없음'}</p>
                    </div>
                ) : (
                    <p>직원을 선택하세요</p>
                )}
            </div>
        </div>
    );
};

const OrganizationModal = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '95%',
                height: '90%',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <IconButton
                sx={{ position: 'absolute', top: 16, right: 16 }}
                onClick={onClose}
            >
                <CloseIcon />
            </IconButton>
            <div>
                <b
                    style={{
                        marginBottom: '20px',
                        fontSize: '30px',
                        marginLeft: '50px',
                        color: '#fac337',
                    }}
                >
                    GroupBee&nbsp;
                </b>
                <b style={{ fontSize: '25px' }}>조직도</b>
            </div>
            <OrganizationChart />
        </Box>
    );
};

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <CloseIcon />
            <OrganizationModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default App;