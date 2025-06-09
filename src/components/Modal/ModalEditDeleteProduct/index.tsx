import { useState } from 'react';
import Modal from 'react-modal';
import styles from './styles.module.scss';
import { FiX } from 'react-icons/fi'
import { Input } from '../../ui/Input';
import { ButtonGreen, ButtonRed } from '../../ui/Button';
import { ProductItemProps } from '../../../pages/products';

interface ModalEditProductProps {
    isOpen: boolean;
    onRequestClose: () => void;
    product: ProductItemProps;
    handleEditProduct: (product: ProductItemProps) => void;
}

interface ModalDeleteProductProps {
    isOpen: boolean;
    onRequestClose: () => void;
    product: ProductItemProps;
    handleDeleteProduct: (category: ProductItemProps) => void;
}

export function ModalEditProduct({ isOpen, onRequestClose, product, handleEditProduct }: ModalEditProductProps) {

    const [name, setName] = useState(product.name);

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
        product.name = name;
        handleEditProduct(product);
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
                <h1>Editar Produto</h1>
                <div
                    className={styles.form}>
                    <Input
                        type="text"
                        placeholder="Digite o nome do produto"
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

export function ModalDeleteProduct({ isOpen, onRequestClose, product, handleDeleteProduct }: ModalDeleteProductProps) {

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
        handleDeleteProduct(product);
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
                <h1>Deletar Produto</h1>
                <div
                    className={styles.form}>
                    <span className={styles.mensagemDelete}>Deseja realmente deletar o produto?</span>
                    <ButtonRed
                        onClick={handleDelete}>
                        Deletar
                    </ButtonRed>
                </div>
            </div>
        </Modal>
    )
}