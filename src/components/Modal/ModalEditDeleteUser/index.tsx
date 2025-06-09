import { useState } from 'react';
import Modal from 'react-modal';
import styles from './styles.module.scss';
import { FiX } from 'react-icons/fi'
import { Input } from '../../ui/Input';
import { ButtonGreen } from '../../ui/Button';
import { UserItemProps, UserPasswordProps } from '../../../pages/users';
import { toast } from 'react-toastify';

interface ModalEditUserProps {
    isOpen: boolean;
    onRequestClose: () => void;
    user: UserItemProps;
    handleEditUser: (user: UserItemProps) => void;
}

interface ModalChangePasswordUserProps {
    isOpen: boolean;
    onRequestClose: () => void;
    user: UserPasswordProps;
    handleChangePasswordUser: (user: UserPasswordProps) => void;
}

export function ModalEditUser({ isOpen, onRequestClose, user, handleEditUser }: ModalEditUserProps) {

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

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
        user.name = name;
        user.email = email;
        handleEditUser(user);
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
                <h1>Editar Usuário</h1>
                <div
                    className={styles.form}>
                    <Input
                        type="text"
                        placeholder="Digite o nome do usuário"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Digite o e-mail do usuário"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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

export function ModalChangePasswordUser({ isOpen, onRequestClose, user, handleChangePasswordUser }: ModalChangePasswordUserProps) {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

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
        if (newPassword === repeatNewPassword) {
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;
            handleChangePasswordUser(user);
        } else {
            toast.error('As novas senhas não são iguais!', {
                theme: 'dark'
            });
        }
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
                <h1>Alterar Senha</h1>
                <div
                    className={styles.form}>
                    <Input
                        type="text"
                        placeholder="Digite a senha antiga"
                        value={oldPassword}
                        onChange={(event) => setOldPassword(event.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Digite a nova senha"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <Input
                        type="text"
                        placeholder="Repita a nova senha"
                        value={repeatNewPassword}
                        onChange={(event) => setRepeatNewPassword(event.target.value)}
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