// GroupModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Box, Typography, Collapse, List, ListItem } from '@mui/material';
import axios from 'axios';

const GroupModal = ({ open, onClose, onSelect }) => {
    const [memberList, setMemberList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState('');

    // 정보 가져오기
    const getinfo = () => {
        axios.get("/api/employee/list")
            .then(res => {
                setMemberList(res.data.data);
            });
    }

    // 부서별로 멤버를 정리하는 함수
    const organizeDepartments = (memberList) => {
        const departmentNames = [...new Set(memberList.map(member => member.department))];

        const sortedList = departmentNames.map(dep => ({
            name: dep,
            people: [],
            open: false
        }));

        memberList.forEach(member => {
            const department = sortedList.find(dep => dep.name === member.department);
            if (department) {
                department.people.push({
                    id: member.id,
                    name: member.name,
                    position: member.position, // 직급 추가
                    email: member.email,
                    extensionCall: member.extensionCall,
                    phoneNumber: member.phoneNumber
                });
            }
        });

        return sortedList;
    };

    useEffect(() => {
        getinfo();
    }, []);

    useEffect(() => {
        if (memberList.length > 0) {
            const organizedDepartments = organizeDepartments(memberList);
            setDepartments(organizedDepartments);
        }
    }, [memberList]);

    const handleDepartmentClick = (departmentName) => {
        setDepartments(prevDepartments =>
            prevDepartments.map(department =>
                department.name === departmentName
                    ? { ...department, open: !department.open }
                    : department
            )
        );
    };

    const handleSelect = () => {
        onSelect(selectedPerson);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 8,
                boxShadow: 24,
            }}>
                <h2>부서 및 승인자 선택</h2>
                {departments.map(department => (
                    <div key={department.name}>
                        <Typography
                            variant="h6"
                            onClick={() => handleDepartmentClick(department.name)}
                            style={{ cursor: 'pointer', marginBottom: 10 }}
                        >
                            {department.name} {department.open ? '▲' : '▼'}
                        </Typography>
                        <Collapse in={department.open}>
                            <List>
                                {department.people.map(person => (
                                    <ListItem 
                                        button 
                                        key={person.id} 
                                        onClick={() => setSelectedPerson(person.name)}
                                    >
                                        {person.name} &lt;{person.position}&gt;
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </div>
                ))}

                <Button variant="contained" color="primary" onClick={handleSelect} style={{ marginTop: 20 }}>
                    선택
                </Button>
            </Box>
        </Modal>
    );
};

export default GroupModal;
