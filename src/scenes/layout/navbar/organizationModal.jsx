import React, { useState, useEffect } from 'react';
import {Box, Checkbox, IconButton, Modal} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import {forEach, map} from "react-bootstrap/ElementChildren";

// 부서 데이터를 계층 구조로 변환하는 함수
const transformDepartments = (departments) => {
    const departmentMap = {};
    const rootDepartments = [];

    // 모든 부서를 맵에 저장
    departments.forEach(department => {
        departmentMap[department.id] = { ...department, subDepartments: [] };
    });

    // 계층 구조 생성
    departments.forEach(department => {
        const id = department.id;
        const parentId = id % 100 === 0 ? id : id - (id % 10); // 최상위 그룹 또는 두 번째 하위 그룹의 ID를 찾음
        const grandParentId = id % 100 === 0 ? null : parentId - (parentId % 10); // 두 번째 하위 그룹의 최상위 그룹 ID


        // 두 번째 하위 그룹의 부모 (최상위 그룹)과 연결
        if (grandParentId !== null && departmentMap[grandParentId]) {
            departmentMap[grandParentId].subDepartments.push(departmentMap[id]);
        } else if (parentId !== id && departmentMap[parentId]) {
            departmentMap[parentId].subDepartments.push(departmentMap[id]);
        } else {
            rootDepartments.push(departmentMap[id]);
        }
    });

    return rootDepartments;
};

const OrganizationChart = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        departmentList();
        employeeList();
    }, []);

    const departmentList = async () => {
        try {
            const response = await axios.get('/api/department/all');
            const transformedDepartments = transformDepartments(response.data);
            setDepartments(transformedDepartments);
        } catch (error) {
            console.error('부서 데이터를 가져오는 중 오류 발생:', error);
        }
    };
    const employeeList = async () => {
        try {
            const response = await axios.get('/api/employee/list');
            setEmployees(response.data);
        } catch (error) {
            console.error('직원 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handleDepartmentSelect = (departmentId) => {
        setSelectedDepartment(departmentId);
        setSelectedEmployee(null); // 부서를 선택할 때 직원 선택 해제
    };

    const handleEmployeeSelect = (employee) => {
        if (selectedEmployee?.id === employee.id) {
            setSelectedEmployee(null); // 이미 선택된 직원 클릭 시 선택 해제
        } else {
            setSelectedEmployee(employee); // 직원 선택
        }
    };

    const filteredEmployees = employees.filter(employee =>
        selectedDepartment && employee.department.id === selectedDepartment
    );

// const departmentList = async () => {
//     const response = await axios.get('/api/department/all');
//     response.data.forEach((item) =>{
//             console.log(item.departmentName)
//             console.log(item.id)
//         })
// }
//
// const employeeList = async () => {
//     const response = await axios.get('/api/employee/list');
//
//     response.data.forEach((employee) => {
//         console.log(employee.name)
//         console.log(employee.position.rank)
//     })
// }

    return (
        <div style={{display: 'flex', padding: '20px'}}>
            <div style={{flex: 1, marginRight: '20px',padding: '10px',backgroundColor:'#f7f7f7',minHeight:'100%'}}>
                <h2>부서 목록</h2>
                <ul>
                    {departments.map(department => (
                        <li
                            key={department.id}
                            onClick={() => handleDepartmentSelect(department.id)}
                            style={{
                                cursor: 'pointer',
                                fontWeight: department.id === selectedDepartment ? 'bold' : 'normal'
                            }}
                        >
                            {department.departmentName}
                            {department.subDepartments.length > 0 && (
                                <ul style={{paddingLeft: '20px'}}>
                                    {department.subDepartments.map(subDepartment => (
                                        <li
                                            key={subDepartment.id}
                                            onClick={() => handleDepartmentSelect(subDepartment.id)}
                                            style={{
                                                cursor: 'pointer',
                                                fontWeight: subDepartment.id === selectedDepartment ? 'bold' : 'normal'
                                            }}
                                        >
                                            {subDepartment.departmentName}
                                            {subDepartment.subDepartments.length > 0 && (
                                                <ul style={{paddingLeft: '20px'}}>
                                                    {subDepartment.subDepartments.map(subSubDepartment => (
                                                        <li
                                                            key={subSubDepartment.id}
                                                            onClick={() => handleDepartmentSelect(subSubDepartment.id)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontWeight: subSubDepartment.id === selectedDepartment ? 'bold' : 'normal'
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

            {/* 중간 패널: 직원 목록 */}
            <div style={{flex: 2, marginRight: '20px'}}>
                <h2>직원 리스트</h2>
                <ul>
                    {filteredEmployees.map(employee => (
                        <li
                            key={employee.id}
                            onClick={() => handleEmployeeSelect(employee)}
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
                                onChange={() => handleEmployeeSelect(employee)}
                                style={{marginRight: '10px'}}
                            />s
                            <div>
                                <div>{employee.name}</div>
                                <div>{employee.position.rank} - {employee.department.departmentName} - {employee.email}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 오른쪽 패널: 직원 상세 정보 */}
            <div style={{flex: 2}}>
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
// 모달 컴포넌트
const OrganizationModal = ({open, onClose}) => {
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
                    sx={{position: 'absolute', top: 16, right: 16}}
                    onClick={onClose}
                >
                    <CloseIcon/>
                </IconButton>
                <OrganizationChart/>
            </Box>
        </Modal>
    );
};

// 부모 컴포넌트
const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <OrganizationModal open={isModalOpen} onClose={handleCloseModal}/>
        </div>
    );
};

export default App;