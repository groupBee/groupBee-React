// GroupModal.jsx
import React, { useState, useEffect } from 'react';
import {Modal, Button, Box, Typography, Collapse, List, ListItem, Checkbox, IconButton} from '@mui/material';
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";

const GroupModal = ({ open, onClose, onSelect }) => {
    const [memberList, setMemberList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState('');

    // 정보 가져오기
    const getinfo = () => {
        axios.get("/api/employee/list")
            .then(res => {
                setMemberList(res.data);
                console.log(res.data);
            });
    }

    // 부서별로 멤버를 정리하는 함수
    const organizeDepartments = (memberList) => {
        const departmentMap = {};

        // 각 멤버를 부서별로 정리
        memberList.forEach(member => {
            const departmentName = member.department.departmentName;

            // 부서가 아직 존재하지 않으면 생성
            if (!departmentMap[departmentName]) {
                departmentMap[departmentName] = {
                    name: departmentName,
                    people: [],
                    open: false
                };
            }

            // 해당 부서에 멤버 추가
            departmentMap[departmentName].people.push({
                id: member.id,
                name: member.name,
                position: member.position.rank,
                email: member.email,
                extensionCall: member.extensionCall,
                phoneNumber: member.phoneNumber
            });
        });

        // 부서 리스트로 변환
        return Object.values(departmentMap);
    };

    useEffect(() => {
        if (open) {
            setDepartments(departments.map(department => ({ ...department, open: false })));
        }
    }, [open]);


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

    // 모든 부서를 열기
    const handleOpenAll = () => {
        setDepartments(prevDepartments =>
            prevDepartments.map(department => ({ ...department, open: true }))
        );
    };

    // 모든 부서를 닫기
    const handleCloseAll = () => {
        setDepartments(prevDepartments =>
            prevDepartments.map(department => ({ ...department, open: false }))
        );
    };


    const handleSelectPerson = (person) => {
        setSelectedPerson(person); // 단일 선택만 가능
    };


    const isSelected = (person) => selectedPerson.id === person.id;

    const handleSelect = () => {
        onSelect(selectedPerson);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 450,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // 부드러운 그림자 효과
                    maxHeight: '55vh', // 모달의 최대 높이 설정
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto', // 스크롤 추가
                    '&::-webkit-scrollbar': {
                    display: 'none',},
                    '-ms-overflow-style': 'none',  /* IE and Edge */
                    'scrollbar-width': 'none',  /* Firefox */
                }}
            >
                {/* 헤더 영역 스타일 및 닫기 버튼 */}
                <div
                    style={{
                        backgroundColor: '#ffb121',
                        padding: '10px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky', // 고정된 헤더
                        top: 0,
                        zIndex: 1000,
                    }}
                >
                    <Typography style={{ color: 'white', fontSize: '1.5rem' }}>부서 및 승인자 선택</Typography>
                    <IconButton onClick={onClose} style={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </div>

                {/* 본문 내용 영역 */}
                <div style={{padding: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                        <Button variant="outlined" onClick={handleOpenAll} style={{marginRight: '10px'}}>
                            모두 열기
                        </Button>
                        <Button variant="outlined" onClick={handleCloseAll}>
                            모두 닫기
                        </Button>
                    </div>

                    {departments.map((department) => (
                        <div key={department.name} style={{marginBottom: '15px'}}>
                            <Typography
                                variant="h6"
                                onClick={() => handleDepartmentClick(department.name)}
                                style={{
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    color: '#333', // 텍스트 색상
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'space-between', // 제목과 화살표를 양 끝에 배치
                                    alignItems: 'center',
                                    padding: '5px 10px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '5px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {department.name} {department.open ? '▲' : '▼'}
                            </Typography>
                            <Collapse in={department.open}>
                                <List>
                                    {department.people.map((person) => (
                                        <ListItem
                                            button
                                            key={person.id}
                                            onClick={() => handleSelectPerson(person)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: isSelected(person)
                                                    ? '#e0f7fa'
                                                    : 'transparent', // 선택된 항목에 배경색 추가
                                                borderRadius: '5px',
                                                padding: '10px',
                                                marginBottom: '8px',
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <Checkbox
                                                checked={isSelected(person)}
                                                onChange={() => handleSelectPerson(person)}
                                                style={{color: '#ffb121'}} // 체크박스 색상
                                            />
                                            <div>
                                                <Typography variant="body1" style={{fontWeight: 500}}>
                                                    {person.name} &lt;{person.position}&gt;
                                                </Typography>
                                                <Typography variant="body2" style={{color: '#666'}}>
                                                    {person.email}
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    ))}

                    {/* 선택 버튼 */}
                    <div
                        style={{
                            position: 'sticky',
                            bottom: 20,
                            left: 0,
                            width: '100%',
                            height:'70px',
                            backgroundColor: 'white', // 배경색이 필요할 경우 지정
                            zIndex: 1000, // 다른 요소 위에 배치되도록 설정
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSelect}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '10px',
                                backgroundColor: '#ffb121',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                borderRadius: '5px',
                                boxShadow: '0px 4px 10px rgba(255, 177, 33, 0.3)', // 부드러운 그림자 효과
                            }}
                        >
                            선택
                        </Button>
                    </div>
                    </div>
            </Box>
        </Modal>

);
};

export default GroupModal;
