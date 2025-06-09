import { useState } from 'react';
import Modal from 'react-modal';
import styles from './styles.module.scss';
import { FiX } from 'react-icons/fi'
import { Input } from '../../ui/Input';
import { CategoryItemProps } from '../../../pages/categories';
import { ButtonGreen, ButtonRed } from '../../ui/Button';

interface ModalEditCategoryProps {
    isOpen: boolean;
    onRequestClose: () => void;
    category: CategoryItemProps;
    handleEditCategory: (category: CategoryItemProps) => void;
}

interface ModalDeleteCategoryProps {
    isOpen: boolean;
    onRequestClose: () => void;
    category: CategoryItemProps;
    handleDeleteCategory: (category: CategoryItemProps) => void;
}

export function ModalEditCatergory({ isOpen, onRequestClose, category, handleEditCategory }: ModalEditCategoryProps) {

    const [name, setName] = useState(category.name);

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1D1D2E',
            borderRadius: '1rem'
        }
    };

    function handleEdit() {
        category.name = name;
        handleEditCategory(category);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}>
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}>
                <FiX size={45} color='#FF3F4B' className={styles.close} />
            </button>
            <div className={styles.container}>
                <h1>Editar Categoria</h1>
                <div
                    className={styles.form}>
                    <Input
                        type="text"
                        placeholder="Digite o nome da categoria"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <ButtonGreen
                        onClick={handleEdit}>
                        Editar
                    </ButtonGreen>
                </div>
            </div>
        </Modal>
    )
}

export function ModalDeleteCatergory({ isOpen, onRequestClose, category, handleDeleteCategory }: ModalDeleteCategoryProps) {

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1D1D2E',
            borderRadius: '1rem'
        }
    };

    function handleDelete() {
        handleDeleteCategory(category);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}>
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}>
                <FiX size={45} color='#FF3F4B' className={styles.close} />
            </button>
            <div className={styles.container}>
                <h1>Deletar Categoria</h1>
                <div
                    className={styles.form}>
                    <span className={styles.mensagemDelete}>Deseja realmente deletar a categoria?</span>
                    <ButtonRed
                        onClick={handleDelete}>
                        Deletar
                    </ButtonRed>
                </div>
            </div>
        </Modal>
    )
}