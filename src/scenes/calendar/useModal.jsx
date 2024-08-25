import React, {useEffect, useState} from 'react';
import UpdateModal from "./updateModal.jsx";
import AddModal from "./addModal.jsx";
import DeleteModal from "./deleteModal.jsx";
// import DeleteModal from "./deleteModal.jsx";

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState(null);
    const [modalContent, setModalContent] = useState({id: '', title: '', type: 'confirm'});
    const [inputValues, setInputValues] = useState({title: '', start: '', end: '', content: ''});

    // 동기처리를 하여 값이 변경되었는지 확인하기 위해서 잠깐 추가
    useEffect(() => {

    }, [isOpen]);

    const showModal = (id, title, type = 'confirm', initialValues = {}) => {
        setModalContent({id, title, type});
        setInputValues(initialValues);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const deleteModal = (id, title, type='delete', initialValues={}) => {
        setModalContent({id, title, type});
        setInputValues(initialValues);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolvePromise(()=>resolve);
        })
    }

    const handleCancel = () => {
        setIsOpen(false);
        if (resolvePromise) resolvePromise(false);
    };

    const handleSubmit = () => {
        setIsOpen(false);

        // 데이터를 백엔드로 전송하여 DB에 저장
        fetch('/api/calendar/write', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputValues), // inputValues를 JSON 형식으로 변환하여 전송
        })
            .then(response => response.json())
            .then(data => {
                console.log('Event successfully saved:', data);
                if (resolvePromise) {
                    resolvePromise(data); // 저장된 데이터를 반환하거나, true 등 다른 값을 반환할 수 있습니다.
                }
            })
            .catch(error => {
                console.error('Error saving event:', error);
                if (resolvePromise) {
                    resolvePromise(false); // 오류 발생 시 false 반환
                }
            });
    };

    const handleDelete = () => {
        setIsOpen(false);

        fetch(`/api/calendar/${modalContent.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    console.log('Event successfully deleted');
                    if (resolvePromise) {
                        resolvePromise(true);
                    }
                } else {
                    throw new Error('Failed to delete event');
                }
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                if (resolvePromise) {
                    resolvePromise(false);
                }
            });
    }

    const handleUpdate = (updatedValues) => {
        setIsOpen(false);

        fetch(`/api/calendar/${modalContent.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedValues),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Event successfully saved:', data);
                if (resolvePromise) {
                    resolvePromise(data); // 저장된 데이터를 반환하거나, true 등 다른 값을 반환할 수 있습니다.
                }
            })
            .catch(error => {
                console.error('Error saving event:', error);
                if (resolvePromise) {
                    resolvePromise(false); // 오류 발생 시 false 반환
                }
            });
    }

    const modal = (() => {
        if (modalContent.type === 'confirm') {
            return (
                <UpdateModal
                    isOpen={isOpen}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    initialData={inputValues}
                />
            );
        } else if (modalContent.type === 'delete') {
            return (
                <DeleteModal
                    isOpen={isOpen}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                    initialData={inputValues}
                />
            );
        } else {
            return (
                <AddModal
                    isOpen={isOpen}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                />
            );
        }
    })();


    return {showModal, deleteModal, modal};
};

export default useModal;
