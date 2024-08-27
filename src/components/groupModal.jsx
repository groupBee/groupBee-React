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
                console.log(res.data.data);
            });
    }

    // 부서별로 멤버를 정리하는 함수
    const organizeDepartments = (memberList) => {
        const departmentMap = {};

        // 각 멤버를 부서별로 정리
        memberList.forEach(member => {
            const departmentName = member.departmentName;

            // 부서가 아직 존재하지 않으면 생성
            if (!departmentMap[departmentName]) {
                departmentMap[departmentName] = {
                    name: departmentName,
                    people: [],
                    open: false  // 기본적으로 닫힌 상태
                };
            }

            // 해당 부서에 멤버 추가
            departmentMap[departmentName].people.push({
                id: member.id,
                name: member.name,
                position: member.position,
                email: member.email,
                extensionCall: member.extensionCall,
                phoneNumber: member.phoneNumber
            });
        });

        // 부서 리스트로 변환
        return Object.values(departmentMap);
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
                    ? { ...department, open: !department.open }  // 클릭 시 열고 닫기
                    : department
            )
        );
    };

    const handleSelect = () => {
        if (selectedPerson) {
            onSelect(selectedPerson.name);  // 선택한 사람의 이름만 전달
        }
        handleClose();  // 모달 닫기
    };

    const handleClose = () => {
        // 모달이 닫힐 때 부서의 open 상태를 초기화
        setDepartments(prevDepartments =>
            prevDepartments.map(department => ({
                ...department,
                open: false  // 모든 부서를 닫힌 상태로 설정
            }))
        );
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
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
                                        onClick={() => setSelectedPerson(person)}
                                    >
                                        {person.name} &lt;{person.position}&gt;<br/>{person.email}
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
