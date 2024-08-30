import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Box, Checkbox, IconButton, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

//부서 리스트, 멤버리스트, 멤버디테일
const OrganizationChart = () => {
    const [departmentList, setDepartmentList] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

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
    //사원정보 불러오기
    const getEmployeeList = () => {
        axios.get("/api/employee/list")
            .then(res => {
                setEmployeeList(res.data);
                console.log(res.data);
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
        if (hasSubDepartments) {
            setExpandedDepartments(prevState =>
                prevState.includes(id) ? prevState.filter(expandedId => expandedId !== id) : [...prevState, id]
            );
        } else {
            filterEmployees(id);
        }
    };
    //부서 눌렀을때 부서 id 값 넘겨받아서 그 부서에 해당하는 사원을 filteredemployees에 넣기
    const filterEmployees = (num) => {
        setFilteredEmployees(employeeList.filter(employee => employee.department.id === num));
    };

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px', padding: '10px', backgroundColor: '#f7f7f7', minHeight: '100%' }}>
                <h2>부서 목록</h2>
                <ul>
                    {Object.entries(structuredDepartments).map(([key, department]) => (
                        <li
                            key={department.id}
                            onClick={() => handleDepartmentSelect(department.id, Object.keys(department.subDepartments).length > 0)}
                            style={{
                                cursor: 'pointer',
                                fontWeight: expandedDepartments.includes(department.id) ? 'bold' : 'normal'
                            }}
                        >
                            {department.departmentName}
                            {expandedDepartments.includes(department.id) && Object.keys(department.subDepartments).length > 0 && (
                                <ul style={{ paddingLeft: '20px' }}>
                                    {Object.entries(department.subDepartments).map(([subKey, subDepartment]) => (
                                        <li
                                            key={subDepartment.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDepartmentSelect(subDepartment.id, Object.keys(subDepartment.subDepartments).length > 0);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                fontWeight: expandedDepartments.includes(subDepartment.id) ? 'bold' : 'normal'
                                            }}
                                        >
                                            {subDepartment.departmentName}
                                            {expandedDepartments.includes(subDepartment.id) && Object.keys(subDepartment.subDepartments).length > 0 && (
                                                <ul style={{ paddingLeft: '20px' }}>
                                                    {Object.entries(subDepartment.subDepartments).map(([subSubKey, subSubDepartment]) => (
                                                        <li
                                                            key={subSubDepartment.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDepartmentSelect(subDepartment.id, Object.keys(subDepartment.subDepartments).length > 0);
                                                                filterEmployees(subSubDepartment.id);
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

            <div style={{ flex: 2, marginRight: '20px' }}>
                <h2>직원 리스트</h2>
                <ul>
                    {filteredEmployees.map(employee => (
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
                                onChange={() => setSelectedEmployee(employee)}
                                style={{ marginRight: '10px' }}
                            />
                            <div>
                                <div>{employee.name}</div>
                                <div>{employee.position.rank} - {employee.department.departmentName} - {employee.email}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: 2 }}>
                <h2>직원 정보</h2>
                {selectedEmployee ? (
                    <div style={{
                        padding: '10px',
                        minHeight: '100%',
                        borderLeft: '3px solid #ffd454',
                        paddingLeft: '40px'
                    }}>
                        <p>이름: {selectedEmployee.name}</p>
                        <p>직급: {selectedEmployee.position.rank}</p>
                        <p>이메일: {selectedEmployee.email}</p>
                        <p>전화번호: {selectedEmployee.phoneNumber}</p>
                        <p>부서: {selectedEmployee.department.departmentName}</p>
                        <p>입사일: {selectedEmployee.firstDay ? selectedEmployee.firstDay : '정보 없음'}</p>
                    </div>
                ) : (
                    <p>직원을 선택하세요</p>
                )}
            </div>
        </div>
    );
};

const OrganizationModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
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
            }}>
                <IconButton
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <OrganizationChart />
            </Box>
        </Modal>
    );
};

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <OrganizationModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default App;
