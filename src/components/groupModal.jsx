import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Box, Button, Checkbox, IconButton, Modal} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OrganizationChart = ({ selectedEmployee, setSelectedEmployee }) => {
    const [departmentList, setDepartmentList] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // 초기 정보 로드
    useEffect(() => {
        getDepartmentList();
        getEmployeeList();
    }, []);

    const getDepartmentList = () => {
        axios.get("/api/department/all")
            .then(res => {
                setDepartmentList(res.data);
            });
    };

    const getEmployeeList = () => {
        axios.get("/api/employee/list")
            .then(res => {
                setEmployeeList(res.data);
            });
    };

    // 부서 구조화
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

    const handleDepartmentSelect = (id, hasSubDepartments) => {
        if (hasSubDepartments) {
            setExpandedDepartments(prevState =>
                prevState.includes(id) ? prevState.filter(expandedId => expandedId !== id) : [...prevState, id]
            );
        } else {
            filterEmployees(id);
        }
    };

    const filterEmployees = (num) => {
        const employeesInDepartment = employeeList.filter(employee => employee.department.id === num);
        setFilteredEmployees(employeesInDepartment);
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee); // 단일 선택
    };

    return (
        <div style={{ display: 'flex', padding: '20px', marginTop: '-15px' }}>
            {/* 부서 목록 */}
            <div style={{ flex: 1, marginRight: '20px', padding: '10px', backgroundColor: '#f7f7f7', minHeight: '90%', paddingLeft: '20px' }}>
                <h2 style={{ marginBottom: '25px' }}>부서 목록</h2>
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
                                                filterEmployees(subDepartment.id);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                fontWeight: expandedDepartments.includes(subDepartment.id) ? 'bold' : 'normal'
                                            }}
                                        >
                                            {subDepartment.departmentName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 직원 리스트 */}
            <div style={{ flex: 2, marginRight: '30px' }}>
                <h2 style={{ marginBottom: '25px', marginTop: '10px' }}>직원 리스트</h2>
                <ul>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
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
                                    style={{ marginRight: '10px' }}
                                />
                                <div style={{ display: 'flex', marginTop: '10px' }}>
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
                                    <div style={{ marginLeft: '20px' }}>
                                        <div>{employee.name}</div>
                                        <div>{employee.position.rank} - {employee.department.departmentName} - {employee.email}</div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>직원이 없습니다</p>
                    )}
                </ul>
            </div>

            {/* 선택된 직원 정보 */}
            <div style={{ flex: 2, paddingLeft: '40px' }}>
                <h2 style={{ marginLeft: '170px' }}>선택된 직원 정보</h2>
                {selectedEmployee ? (
                    <div style={{
                        padding: '10px',
                        minHeight: 'auto',
                        borderLeft: '3px solid #ffd454',
                        paddingLeft: '40px',
                        marginLeft: '140px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ fontSize: '13px' }}>이름: {selectedEmployee.name}</p>
                        <p style={{ fontSize: '13px' }}>직급: {selectedEmployee.position.rank}</p>
                        <p style={{ fontSize: '13px' }}>이메일: {selectedEmployee.email}</p>
                    </div>
                ) : (
                    <p>직원을 선택하세요</p>
                )}
            </div>
        </div>
    );
};

const GroupModal = ({ open, onClose, onSelect }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleSave = () => {
        onSelect(selectedEmployee); // 선택된 직원 정보 저장
        onClose(); // 모달 닫기
    };

    if (!open) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-40%, -50%)',
                width: '70%', // 가로 80%로 설정
                height: '70%',
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
                <div><b style={{
                    marginBottom: '20px',
                    fontSize: '23px',
                    fontWeight: 'bolder'
                }}>부서 선택</b></div>
                <OrganizationChart selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave} // 추가 버튼 클릭 시 저장 및 모달 닫기
                    sx={{ marginTop: 'auto', alignSelf: 'center' }}
                >
                    추가
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
