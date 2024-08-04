import React, {useState} from 'react';
import MyModal from "./MyModal.js";

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [resolvePromise, setResolvePromise] = useState(null);

    const showModal = (title) => {
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    }

    const handleCancel = () => {
        setIsOpen(false);
        if (resolvePromise) resolvePromise(false);
    };

    const handleSubmit = () => {
        setIsOpen(false);
        if (resolvePromise) resolvePromise(true);
    };

    const modal = (
        <MyModal
            isOpen={isOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            title={title}
        />
    );

    return { showModal, modal };
};

export default useModal;
