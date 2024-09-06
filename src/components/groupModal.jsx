import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Box, Checkbox, IconButton, Modal, Typography, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat.js";
import MailOutlineIcon from "@mui/icons-material/MailOutline.js";

const OrganizationChart = ({ selectedEmployees, setSelectedEmployees }) => {
    const [departmentList, setDepartmentList] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
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

    const filterEmployees = (departmentId) => {
        const employeesInDepartment = employeeList.filter(employee => employee.department.id === departmentId);
        setFilteredEmployees(employeesInDepartment);
    };

    const handleDepartmentSelect = (id, hasSubDepartments) => {
        filterEmployees(id); // 부서 선택 시 그 부서의 직원 필터링
        if (hasSubDepartments) {
            setExpandedDepartments(prevState =>
                prevState.includes(id) ? prevState.filter(expandedId => expandedId !== id) : [...prevState, id]
            );
        }
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployees(prevSelected => {
            const alreadySelected = prevSelected.some(selected => selected.id === employee.id);
            if (alreadySelected) {
                return prevSelected.filter(selected => selected.id !== employee.id);
            } else {
                return [...prevSelected, employee];
            }
        });
    };

    return (
        <Box sx={{ display: 'flex', p: 2, gap: 2, height:'90%'}}>
            {/* Department List */}
            <Box sx={{ flex: 1, bgcolor: '#f1f3f5', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto'}}>
                <Typography variant="h6" gutterBottom>부서 목록</Typography>
                <List>
                    {Object.entries(structuredDepartments).map(([key, department]) => (
                        <React.Fragment key={department.id}>
                            <ListItem
                                button
                                onClick={() => handleDepartmentSelect(department.id, Object.keys(department.subDepartments).length > 0)}
                                sx={{
                                    py: 1,
                                    bgcolor: expandedDepartments.includes(department.id) ? '#e0e0e0' : 'transparent',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: '#e0e0e0'
                                    }
                                }}
                            >
                                <ListItemText primary={department.departmentName} />
                                {Object.keys(department.subDepartments).length > 0 && (expandedDepartments.includes(department.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                            </ListItem>
                            {expandedDepartments.includes(department.id) && (
                                <List component="div" disablePadding>
                                    {Object.entries(department.subDepartments).map(([subKey, subDepartment]) => (
                                        <React.Fragment key={subDepartment.id}>
                                            <ListItem
                                                button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDepartmentSelect(subDepartment.id, Object.keys(subDepartment.subDepartments).length > 0);
                                                    filterEmployees(subDepartment.id);
                                                }}
                                                sx={{
                                                    pl: 4,
                                                    py: 1,
                                                    bgcolor: expandedDepartments.includes(subDepartment.id) ? '#dee2e6' : 'transparent',
                                                    borderRadius: 1,
                                                    '&:hover': {
                                                        bgcolor: '#dee2e6'
                                                    }
                                                }}
                                            >
                                                <ListItemText primary={subDepartment.departmentName} />
                                                {Object.keys(subDepartment.subDepartments).length > 0 && (expandedDepartments.includes(subDepartment.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                            </ListItem>
                                            {expandedDepartments.includes(subDepartment.id) && (
                                                <List component="div" disablePadding>
                                                    {Object.entries(subDepartment.subDepartments).map(([subSubKey, subSubDepartment]) => (
                                                        <ListItem
                                                            key={subSubDepartment.id}
                                                            button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDepartmentSelect(subSubDepartment.id, false);
                                                                filterEmployees(subSubDepartment.id);
                                                            }}
                                                            sx={{
                                                                pl: 6,
                                                                py: 1,
                                                                bgcolor: 'transparent',
                                                                '&:hover': {
                                                                    bgcolor: '#e9ecef'
                                                                }
                                                            }}
                                                        >
                                                            <ListItemText primary={subSubDepartment.departmentName} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* Employee List */}
            <Box sx={{ flex: 2, bgcolor: '#fff', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto'}}>
                <Typography variant="h6" gutterBottom>직원 리스트</Typography>
                <List>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <ListItem
                                key={employee.id}
                                button
                                onClick={() => handleEmployeeSelect(employee)}
                                sx={{
                                    py: 1,
                                    bgcolor: selectedEmployees.some(selected => selected.id === employee.id) ? '#e0e0e0' : 'transparent',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: '#e9ecef'
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={selectedEmployees.some(selected => selected.id === employee.id)}
                                        onChange={() => handleEmployeeSelect(employee)}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={employee.name}
                                    secondary={`${employee.position.rank} - ${employee.department.departmentName} - ${employee.email}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">직원이 없습니다</Typography>
                    )}
                </List>
            </Box>

            {/* Selected Employees */}
            <Box sx={{ flex: 2, bgcolor: '#fff', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto'}}>
                <Typography variant="h6" gutterBottom>선택된 직원 정보</Typography>
                {selectedEmployees.length > 0 ? (
                    selectedEmployees.map(employee => (
                        <Box
                            key={employee.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 1,
                                px: 2,
                                mb: 1,
                                borderLeft: '5px solid #ffd454',
                                bgcolor: '#fafafa',
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: '#f0f0f0'
                                }
                            }}
                        >
                            <IconButton onClick={() => handleEmployeeSelect(employee)}>
                                <CloseIcon />
                            </IconButton>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body2" color="textPrimary">이름: {employee.name}</Typography>
                                <Typography variant="body2" color="textSecondary">직급: {employee.position.rank}</Typography>
                                <Typography variant="body2" color="textSecondary">이메일: {employee.email}</Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">직원을 선택하세요</Typography>
                )}
            </Box>
        </Box>
    );
};

const GroupModal = ({open, onClose, onSelect}) => {
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const handleSave = () => {
        onSelect(selectedEmployees);
        console.log(selectedEmployees)
        handleClose();
    };

    const handleClose = () => {
        setSelectedEmployees([]);
        onClose();
    };

    if (!open) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <IconButton
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>

                <OrganizationChart
                    selectedEmployees={selectedEmployees}
                    setSelectedEmployees={setSelectedEmployees}
                />

                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" onClick={handleSave}>저장</Button>
                    <Button variant="outlined" onClick={handleClose}>취소</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GroupModal;
