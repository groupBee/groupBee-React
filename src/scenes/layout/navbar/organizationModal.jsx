import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from "axios";
import {
    Button,
    Box,
    Checkbox,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";



const OrganizationChart = () => {
    const [departmentList, setDepartmentList] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDepartmentNames, setSelectedDepartmentNames] = useState([]);
    const [departmentLevel, setDepartmentLevel] = useState({});
    const [expandedTopDepartments, setExpandedTopDepartments] = useState([]);
    const [expandedMidDepartments, setExpandedMidDepartments] = useState([]);
    const [includeSubDepartments, setIncludeSubDepartments] = useState(false);

    useEffect(() => {
        getDepartmentList();
        getEmployeeList();
    }, []);

    useEffect(() => {
        if (departmentList.length > 0) {
            const levels = {};
            departmentList.forEach(dept => {
                if (dept.id % 100 === 0) levels[dept.id] = 'top';
                else if (dept.id % 10 === 0) levels[dept.id] = 'mid';
                else levels[dept.id] = 'sub';
            });
            setDepartmentLevel(levels);
        }
    }, [departmentList]);

    const getDepartmentList = () => {
        axios.get("/api/department/all")
            .then(res => {
                setDepartmentList(res.data);
            });
    };

    const getEmployeeList = () => {
        axios.get("/api/employee/list")
            .then(res => {
                const activeEmployees = res.data.filter(employee => employee.membershipStatus === true);
                setEmployeeList(activeEmployees);
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

    const handleDepartmentSelect = (id) => {
        const level = departmentLevel[id];
        const departmentNames = findDepartmentNames(id);
        setSelectedDepartmentNames(departmentNames);
        setSelectedEmployee(null);

        switch (level) {
            case 'top':
                handleTopDepartmentExpand(id);
                filterEmployees(id, includeSubDepartments);
                break;
            case 'mid':
                handleMidDepartmentExpand(id);
                filterEmployees(id, includeSubDepartments);
                break;
            case 'sub':
                filterEmployees(id, includeSubDepartments);
                break;
            default:
                setFilteredEmployees([]);
        }
    };


    const handleIncludeSubDepartmentsChange = (e) => {
        const newIncludeSubDepartments = e.target.checked;
        setIncludeSubDepartments(newIncludeSubDepartments);
        if (selectedDepartmentNames.length > 0) {
            const selectedDepartmentId = departmentList.find(dept => dept.departmentName === selectedDepartmentNames[selectedDepartmentNames.length - 1]).id;
            filterEmployees(selectedDepartmentId, newIncludeSubDepartments);
        }
    };

    const handleTopDepartmentExpand = (id) => {
        setExpandedTopDepartments(prev => {
            if (prev.includes(id)) {
                return prev.filter(deptId => deptId !== id);
            } else {
                return [id];  // 다른 상위 부서를 닫고 현재 부서만 열기
            }
        });
        // 중간 부서 확장 상태 초기화
        setExpandedMidDepartments([]);
    };

    const handleMidDepartmentExpand = (id) => {
        setExpandedMidDepartments(prev => {
            if (prev.includes(id)) {
                return prev.filter(deptId => deptId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const filterEmployees = (id, includeSubDepartments) => {
        const level = departmentLevel[id];
        let employeesToShow = [];

        const addEmployeesForDepartment = (deptId) => {
            employeesToShow = [...employeesToShow, ...employeeList.filter(employee => employee.department.id === deptId)];
        };

        if (includeSubDepartments) {
            switch (level) {
                case 'top':
                    departmentList.filter(dept => Math.floor(dept.id / 100) === Math.floor(id / 100)).forEach(dept => addEmployeesForDepartment(dept.id));
                    break;
                case 'mid':
                    departmentList.filter(dept => Math.floor(dept.id / 10) === Math.floor(id / 10)).forEach(dept => addEmployeesForDepartment(dept.id));
                    break;
                case 'sub':
                    addEmployeesForDepartment(id);
                    break;
            }
        } else {
            addEmployeesForDepartment(id);
        }

        setFilteredEmployees(employeesToShow);
    };

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

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleChatClick = () => {
        window.open("https://chat.groupbee.co.kr", "_blank");
    };

    const handleEmailClick = () => {
        if (selectedEmployee) {
            window.open(`/email?email=${encodeURIComponent(selectedEmployee.email)}`, '_blank');
        }
    };
    const styles = `
.list-transition-enter {
  opacity: 0;
  transform: translateY(-10px);
}
.list-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}
.list-transition-exit {
  opacity: 1;
}
.list-transition-exit-active {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 300ms, transform 300ms;
}
`;

    return (
        <Box sx={{ display: 'flex', p: 2, gap: 2, height: '90%' }}>
            <Box sx={{ flex: 1, bgcolor: '#f1f3f5', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>부서 목록</Typography>
                <List>
                    {Object.entries(structuredDepartments).map(([key, department]) => (
                        <React.Fragment key={department.id}>
                            <ListItem
                                button
                                onClick={() => handleDepartmentSelect(department.id)}
                                // ... (스타일링)
                            >
                                <ListItemText primary={department.departmentName} />
                                {Object.keys(department.subDepartments).length > 0 &&
                                    (expandedTopDepartments.includes(department.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                            </ListItem>
                            {expandedTopDepartments.includes(department.id) && (
                                <List component="div" disablePadding>
                                    {Object.entries(department.subDepartments).map(([subKey, subDepartment]) => (
                                        <React.Fragment key={subDepartment.id}>
                                            <ListItem
                                                button
                                                onClick={() => handleDepartmentSelect(subDepartment.id)}
                                                // ... (스타일링)
                                            >
                                                <span style={{marginRight:'5px',marginLeft:'10px'}}></span>
                                                <ListItemText primary={subDepartment.departmentName} />
                                                {Object.keys(subDepartment.subDepartments).length > 0 &&
                                                    (expandedMidDepartments.includes(subDepartment.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                            </ListItem>
                                            {expandedMidDepartments.includes(subDepartment.id) && (
                                                <List component="div" disablePadding>
                                                    {Object.entries(subDepartment.subDepartments).map(([subSubKey, subSubDepartment]) => (
                                                        <ListItem
                                                            key={subSubDepartment.id}
                                                            button
                                                            onClick={() => handleDepartmentSelect(subSubDepartment.id)}
                                                            // ... (스타일링)
                                                        >
                                                            <span style={{marginRight: '5px',marginLeft:'25px'}}></span>
                                                            <ListItemText primary={subSubDepartment.departmentName}/>
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

            <Box sx={{ flex: 2, bgcolor: '#fff', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto' }}>
                <Checkbox
                    checked={includeSubDepartments}
                    onChange={handleIncludeSubDepartmentsChange}
                />
                <Typography variant="body2">하위 부서 포함</Typography>
                <Typography variant="h6" gutterBottom>직원 리스트</Typography>
                <Box sx={{ mb: 2 }}>
                    {selectedDepartmentNames.length > 0 && (
                        <Typography variant="subtitle1" gutterBottom>
                            {selectedDepartmentNames.join('<')}
                        </Typography>
                    )}
                </Box>
                <List>
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <ListItem
                                key={employee.id}
                                button
                                onClick={() => handleEmployeeSelect(employee)}
                                sx={{
                                    py: 1,
                                    bgcolor: selectedEmployee?.id === employee.id ? '#e0e0e0' : 'transparent',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: '#e9ecef'
                                    }
                                }}
                            >
                                <ListItemIcon onChange={() => handleEmployeeSelect(employee)}>
                                    <Checkbox
                                        checked={selectedEmployee?.id === employee.id}
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

            <Box sx={{ flex: 2, bgcolor: '#fff', borderRadius: 1, p: 2, boxShadow: 1, overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>선택된 직원 정보</Typography>
                {selectedEmployee ? (
                    <Box
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
                                marginTop: '20px'
                            }}
                        />
                        <Box sx={{ ml: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<ChatIcon />}
                                sx={{
                                    backgroundColor: '#007bff',
                                    backgroundImage: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                    color: 'white',
                                    fontSize: '12px',
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                        backgroundImage: 'linear-gradient(135deg, #0056b3 0%, #003d80 100%)',
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
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
                                    transition: 'all 0.3s ease',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#1e7e34',
                                        backgroundImage: 'linear-gradient(135deg, #1e7e34 0%, #155d27 100%)',
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                    },
                                    '&:focus': {
                                        outline: 'none',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                                onClick={handleEmailClick}
                            >
                                메일
                            </Button>
                        </Box>
                        <p style={{ fontSize: '13px', marginTop: '-15px' }}>이름: {selectedEmployee.name}</p>
                        <p style={{ fontSize: '13px' }}>직급: {selectedEmployee.position.rank}</p>
                        <p style={{ fontSize: '13px' }}>이메일: {selectedEmployee.email}</p>
                        <p style={{ fontSize: '13px' }}>전화번호: {selectedEmployee.phoneNumber}</p>
                        <p style={{ fontSize: '13px' }}>부서: {selectedEmployee.department.departmentName}</p>
                        <p style={{ fontSize: '13px' }}>입사일: {selectedEmployee.firstDay ? selectedEmployee.firstDay : '정보 없음'}</p>
                    </Box>
                ) : (
                    <Typography variant="body2" color="textSecondary">직원을 선택하세요</Typography>
                )}
            </Box>
        </Box>
    );
};

const OrganizationModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <Box
            sx={{
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
                position: 'relative'
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

export default OrganizationModal;
