// GroupModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Box, Typography, Collapse, List, ListItem } from '@mui/material';
import axios from 'axios';

const GroupModal = ({ open, onClose, onSelect }) => {
    const [departments, setDepartments] = useState([
        { name: '인사부', people: [], open: false },
        { name: '자재부', people: [], open: false },
        { name: 'IT부', people: [], open: false }
    ]);
    const [selectedPerson, setSelectedPerson] = useState('');



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
                                    <ListItem button key={person.id} onClick={() => setSelectedPerson(person.name)}>
                                        {person.name}
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
