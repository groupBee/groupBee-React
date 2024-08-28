import React, { useState, useEffect } from 'react';
import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
// 상위 개념 데이터
const topLevelCategories = [
    {
        name: '인사',
        departments: [
            '인사부',
            '총무부'
        ]
    },
    {
        name: '관리',
        departments: [
            '기획부',
            '회계부'
        ]
    },
    {
        name: '개발',
        departments: [
            'IT관리부'
        ]
    }
];
// 부서와 팀 데이터
const departmentData = [
    {
        name: '기획부',
        teams: [
            {
                name: '기획1팀',
                employees: [
                    { id: 1, name: '김기획', position: '팀장', department: '기획부', team: '기획1팀', email: 'kimk@company.com', phone: '010-1111-2222', photo: '/path/to/photo1.jpg' },
                    { id: 2, name: '이계획', position: '팀원', department: '기획부', team: '기획1팀', email: 'leek@company.com', phone: '010-3333-4444', photo: '/path/to/photo2.jpg' },
                ]
            },
            {
                name: '기획2팀',
                employees: [
                    { id: 3, name: '박계획', position: '팀원', department: '기획부', team: '기획2팀', email: 'parkp@company.com', phone: '010-5555-6666', photo: '/path/to/photo3.jpg' }
                ]
            },
            { name: '기획3팀', employees: [] },
            { name: '기획4팀', employees: [] },
            { name: '기획5팀', employees: [] },
        ]
    },
    {
        name: '회계부',
        teams: [
            {
                name: '회계1팀',
                employees: [
                    { id: 4, name: '정회계', position: '팀장', department: '회계부', team: '회계1팀', email: 'jeongh@company.com', phone: '010-7777-8888', photo: '/path/to/photo4.jpg' }
                ]
            },
            {
                name: '회계2팀',
                employees: [
                    { id: 5, name: '최회계', position: '팀원', department: '회계부', team: '회계2팀', email: 'choic@company.com', phone: '010-9999-0000', photo: '/path/to/photo5.jpg' }
                ]
            },
            { name: '회계3팀', employees: [] },
            { name: '회계4팀', employees: [] },
            { name: '회계5팀', employees: [] },
        ]
    },
    {
        name: '총무부',
        teams: [
            {
                name: '총무1팀',
                employees: [
                    { id: 6, name: '윤총무', position: '팀장', department: '총무부', team: '총무1팀', email: 'yoonc@company.com', phone: '010-1212-3434', photo: '/path/to/photo6.jpg' }
                ]
            },
            {
                name: '총무2팀',
                employees: [
                    { id: 7, name: '장총무', position: '팀원', department: '총무부', team: '총무2팀', email: 'jangc@company.com', phone: '010-5656-7878', photo: '/path/to/photo7.jpg' }
                ]
            },
            { name: '총무3팀', employees: [] },
            { name: '총무4팀', employees: [] },
            { name: '총무5팀', employees: [] },
        ]
    },
    {
        name: 'IT관리부',
        teams: [
            {
                name: 'IT관리1팀',
                employees: [
                    { id: 8, name: '오IT', position: '팀장', department: 'IT관리부', team: 'IT관리1팀', email: 'oit@company.com', phone: '010-2323-4545', photo: '/path/to/photo8.jpg' }
                ]
            },
            {
                name: 'IT관리2팀',
                employees: [
                    { id: 9, name: '한IT', position: '팀원', department: 'IT관리부', team: 'IT관리2팀', email: 'hanit@company.com', phone: '010-6767-8989', photo: '/path/to/photo9.jpg' }
                ]
            },
            { name: 'IT관리3팀', employees: [] },
            { name: 'IT관리4팀', employees: [] },
            { name: 'IT관리5팀', employees: [] },
        ]
    },
    {
        name: '인사부',
        teams: [
            {
                name: '인사1팀',
                employees: [
                    { id: 10, name: '송인사', position: '팀장', department: '인사부', team: '인사1팀', email: 'songi@company.com', phone: '010-9898-1010', photo: '/path/to/photo10.jpg' }
                ]
            },
            {
                name: '인사2팀',
                employees: [
                    { id: 11, name: '강인사', position: '팀원', department: '인사부', team: '인사2팀', email: 'kangin@company.com', phone: '010-2121-3434', photo: '/path/to/photo11.jpg' }
                ]
            },
            { name: '인사3팀', employees: [] },
            { name: '인사4팀', employees: [] },
            { name: '인사5팀', employees: [] },
        ]
    }
];

// 왼쪽 패널 컴포넌트
const LeftPanel = ({ onSelectDepartment, onSelectTeam }) => {
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedDepartments, setExpandedDepartments] = useState({});

    const handleCategoryClick = (category) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [category.name]: !prevState[category.name]
        }));
    };

    const handleDepartmentClick = (department) => {
        setExpandedDepartments(prevState => ({
            ...prevState,
            [department.name]: !prevState[department.name]
        }));
        onSelectDepartment(department);
        onSelectTeam(null); // 팀 선택 해제
    };

    const handleTeamClick = (event, team) => {
        event.stopPropagation(); // 클릭 시 부서 클릭 방지
        onSelectTeam(team);
    };

    return (
        <div style={{ padding: '10px',backgroundColor:'#f7f7f7' }}>
            <ul>
                {topLevelCategories.map((category, categoryIndex) => (
                    <li key={categoryIndex} style={{ marginBottom: '20px', listStyleType: 'none' }}>
                        <div
                            onClick={() => handleCategoryClick(category)}
                            style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {category.name}
                            <span style={{
                                marginLeft: '10px',
                                transform: expandedCategories[category.name] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                            }}>
                                ▼
                            </span>
                        </div>
                        {expandedCategories[category.name] && (
                            <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                                {departmentData
                                    .filter(dept => category.departments.includes(dept.name))
                                    .map((dept, deptIndex) => (
                                        <li
                                            key={deptIndex}
                                            style={{ marginBottom: '10px', listStyleType: 'none' }}
                                        >
                                            <div
                                                onClick={() => handleDepartmentClick(dept)}
                                                style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                {dept.name}
                                                <span style={{
                                                    marginLeft: '10px',
                                                    transform: expandedDepartments[dept.name] ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease'
                                                }}>
                                                    ▼
                                                </span>
                                            </div>
                                            {expandedDepartments[dept.name] && (
                                                <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                                                    {dept.teams.map((team, teamIndex) => (
                                                        <li
                                                            key={teamIndex}
                                                            onClick={(event) => handleTeamClick(event, team)}
                                                            style={{ cursor: 'pointer', marginTop: '8px', listStyleType: 'none' }}
                                                        >
                                                            {team.name}
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
    );
};


// 중앙 패널 컴포넌트
const CenterPanel = ({ selectedDepartment, selectedTeam, onSelectEmployee }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const handleEmployeeChange = (employee) => {
        if (selectedEmployeeId === employee.id) {
            // 이미 선택된 직원의 체크박스를 다시 클릭하면 선택 해제
            setSelectedEmployeeId(null);
            onSelectEmployee(null);  // 직원 정보도 비워줍니다.
        } else {
            // 새로운 직원을 선택
            setSelectedEmployeeId(employee.id);
            onSelectEmployee(employee);
        }
    };

    const employees = selectedDepartment
        ? selectedDepartment.teams.flatMap(team => team.employees)
        : [];

    return (
        <div style={{ padding: '10px' }}>
            {selectedTeam ? (
                <div>
                    <h2>{selectedTeam.name}</h2>
                    <ul>
                        <li>
                            <b style={{fontSize: '15px', marginLeft: '80px', display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '30px'}}>이름</span>
                                <span style={{marginRight: '30px', marginLeft: '100px'}}>부서</span>
                                <span style={{marginRight: '30px', marginLeft: '80px'}}>소속</span>
                                <span style={{marginRight: '30px', marginLeft: '100px'}}>이메일</span>
                                <span style={{marginLeft: '140px'}}>전화번호</span>
                            </b>
                        </li>
                        {selectedTeam.employees.map(employee => (
                            <li key={employee.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '10px',
                                fontSize: '15px'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={selectedEmployeeId === employee.id}
                                    onChange={() => handleEmployeeChange(employee)}
                                    style={{marginRight: '15px'}}
                                />
                                <img
                                    src={employee.photo}
                                    alt={employee.name}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '15px'
                                    }}
                                />
                                <span style={{
                                    width: '120px',
                                    marginRight: '30px'
                                }}>{employee.name} ({employee.position})</span>
                                <span style={{width: '100px', marginRight: '30px'}}>{employee.department}</span>
                                <span style={{width: '100px', marginRight: '30px'}}>{employee.team}</span>
                                <span style={{width: '200px', marginRight: '30px'}}>{employee.email}</span>
                                <span style={{width: '120px'}}>{employee.phone}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : selectedDepartment ? (
                <div>

                    <h2>{selectedDepartment.name}</h2>

                    <ul>
                        <li>
                            <b style={{fontSize: '15px', marginLeft: '80px', display: 'flex', alignItems: 'center'}}>
                                <span style={{marginRight: '30px'}}>이름</span>
                                <span style={{marginRight: '30px', marginLeft: '100px'}}>부서</span>
                                <span style={{marginRight: '30px', marginLeft: '80px'}}>소속</span>
                                <span style={{marginRight: '30px', marginLeft: '100px'}}>이메일</span>
                                <span style={{marginLeft: '140px'}}>전화번호</span>
                            </b>
                        </li>

                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <li key={employee.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    fontSize: '15px'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEmployeeId === employee.id}
                                        onChange={() => handleEmployeeChange(employee)}
                                        style={{marginRight: '15px'}}
                                    />
                                    <img
                                        src={employee.photo}
                                        alt={employee.name}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            marginRight: '15px'
                                        }}
                                    />
                                    <span style={{
                                        width: '120px',
                                        marginRight: '30px'
                                    }}>{employee.name} ({employee.position})</span>
                                    <span style={{width: '100px', marginRight: '30px'}}>{employee.department}</span>
                                    <span style={{width: '100px', marginRight: '30px'}}>{employee.team}</span>
                                    <span style={{width: '200px', marginRight: '30px'}}>{employee.email}</span>
                                    <span style={{width: '120px'}}>{employee.phone}</span>
                                </li>
                            ))
                        ) : (
                            <p>직원이 없습니다</p>
                        )}
                    </ul>
                </div>
            ) : (
                <p>부서를 선택하세요</p>
            )}
        </div>
    );
};

// 오른쪽 패널 컴포넌트
const RightPanel = ({selectedEmployee}) => {
    return (
        <div style={{padding: '10px',minHeight:'1050px',borderLeft:'3px solid #ffd454',paddingLeft:'40px'}}>
            {selectedEmployee ? (
                <div>
                    <img
                        src={selectedEmployee.photo}
                        alt={selectedEmployee.name}
                        style={{minWidth: '150px', minHeight: '150px', borderRadius: '50%',border:'1px solid black', marginBottom: '50px',marginTop:'50px'}}
                    />
                    <h2>{selectedEmployee.name}</h2>
                    <p>{selectedEmployee.position}</p>
                    <p>{selectedEmployee.department} - {selectedEmployee.team}</p>
                    <p>{selectedEmployee.email}</p>
                    <p>{selectedEmployee.phone}</p>
                </div>
            ) : (
                <p>직원을 선택하세요</p>
            )}
        </div>
    );
};

// 조직도 컴포넌트
const OrganizationChart = () => {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    return (
        <div style={{display: 'flex', height: '100%'}}>
            <div style={{flex: 1}}>
                <LeftPanel onSelectDepartment={setSelectedDepartment} onSelectTeam={setSelectedTeam}/>
            </div>
            <div style={{flex: 3}}>
                <CenterPanel selectedDepartment={selectedDepartment} selectedTeam={selectedTeam} onSelectEmployee={setSelectedEmployee} />
            </div>
            <div style={{ flex: 1 }}>
                <RightPanel selectedEmployee={selectedEmployee} />
            </div>
        </div>
    );
};

// 모달 컴포넌트
const OrganizationModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 2300,
                height: 1100,
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

// 부모 컴포넌트
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