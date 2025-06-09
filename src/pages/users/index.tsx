import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './styles.module.scss';
import Head from 'next/head';
import { FiEdit, FiKey, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import { ModalChangePasswordUser, ModalEditUser } from '../../components/Modal/ModalEditDeleteUser';
import { SwitchTable, SwitchUser, SwitchUserReadOnly } from '../../components/ui/Switch';

export type UserItemProps = {
    id: string;
    name: string;
    email: string;
    perfil: string;
    status: boolean;
    is_logged: boolean;
}

export type UserPasswordProps = {
    id: string;
    oldPassword: string;
    newPassword: string;
}


interface UserProps {
    userList: UserItemProps[];
}

export default function Categories({ userList }: UserProps) {
    const [users, setUsers] = useState(userList || []);
    const [modalItem, setModalItem] = useState<UserItemProps>();
    const [modalItemChangePassword, setModalItemChangePassword] = useState<UserPasswordProps>();
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalChangePasswordVisible, setModalChangePasswordVisible] = useState(false);
    const [search, setSearch] = useState(true);

    setTimeout(async function () {
        setSearch(!search);
    }, 5000);

    useEffect(() => {
        async function getTables() {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/users');
            setUsers(response.data);
        }
        getTables();
    }, [search]);

    function handleCloseModal() {
        setModalEditVisible(false);
        setModalChangePasswordVisible(false);
    }

    async function handleOpenModalEdit(user: UserItemProps) {
            setModalItem(user);
            setModalEditVisible(true);
    }

    async function handleOpenModalChangePassword(user: UserPasswordProps) {
        setModalItemChangePassword(user);
        setModalChangePasswordVisible(true);
    }

    async function handleEditUser(user: UserItemProps) {
        try {
            const apiClient = setupAPIClient();

            const responseEdited = await apiClient.put('/user/update', {
                user_id: user.id,
                name: user.name,
                email: user.email
            });
            toast.success('Usuário ' + responseEdited.data.name + ' editado com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/users');
            setUsers(response.data);
            setModalEditVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao editar o usuário! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleChangePasswordUser(user: UserPasswordProps) {

        try {
            const apiClient = setupAPIClient();

            const responseEdited = await apiClient.put('/user/password', {
                user_id: user.id,
                old_password: user.oldPassword,
                new_password: user.newPassword
            });
            toast.success('Nova senha do usuário ' + responseEdited.data.name + ' alterada com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/users');
            setUsers(response.data);
            setModalChangePasswordVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao alterar a senha do usuário! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleDisableUser(id: string, disable: boolean) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/user/disable', {
                user_id: id,
                disable: disable
            });
            const response = await apiClient.get('/users');
            setUsers(response.data);
            if (disable) {
                toast.success("Usuário desabilitado com sucesso!", {
                    theme: 'dark'
                });
            } else {
                toast.success("Usuário habilitado com sucesso!", {
                    theme: 'dark'
                });
            }
        } catch (error) {
            toast.error("Ocorreu um erro! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    return (
        <>
            <Head>
                <title>Listar Categorias - Uni Pizza</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Usuários</h1>
                        <button
                            title="Cadastrar Usuário"
                            className={styles.button}>
                            <Link href="/user" legacyBehavior>
                                <a><FiPlus size={50} /></a>
                            </Link>
                        </button>
                    </div>
                    {
                        users.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum usuário foi encontrado...
                            </span>
                        ) || (
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={styles.head}>Nome</th>
                                            <th className={styles.head}>E-mail</th>
                                            <th className={styles.headAcao}>Ação</th>
                                            <th className={styles.headAcao}>Logado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users.map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <span className={styles.valueItem}>{item.name}</span>
                                                        </td>
                                                        <td>
                                                            <span className={styles.valueItem}>{item.email}</span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                title="Alterar Senha"
                                                                className={styles.button}
                                                                onClick={() => handleOpenModalChangePassword({
                                                                    id: item.id,
                                                                    oldPassword: '',
                                                                    newPassword: ''
                                                                })}>
                                                                <FiKey size={24} color='#D9D910' />
                                                            </button>
                                                            <button
                                                                title="Editar"
                                                                className={styles.button}
                                                                onClick={() => handleOpenModalEdit(item)}>
                                                                <FiEdit size={24} color='#D9D910' />
                                                            </button>
                                                            <SwitchUser
                                                                isChecked={item.status}
                                                                itemUser={item}
                                                                handleDisableUser={handleDisableUser} />
                                                        </td>
                                                        <td className={styles.tdAcao}>
                                                            <SwitchUserReadOnly
                                                                isChecked={item.is_logged} />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                    <span className={styles.total}>Total: {users.length}</span>
                </main>
                <Footer />
                {
                    modalEditVisible && (
                        <ModalEditUser
                            isOpen={modalEditVisible}
                            onRequestClose={handleCloseModal}
                            user={modalItem}
                            handleEditUser={handleEditUser}
                        />
                    )
                }
                {
                    modalChangePasswordVisible && (
                        <ModalChangePasswordUser
                            isOpen={modalChangePasswordVisible}
                            onRequestClose={handleCloseModal}
                            user={modalItemChangePassword}
                            handleChangePasswordUser={handleChangePasswordUser}
                        />
                    )
                }
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);
    const response = await apiClient.get('/users');
    return {
        props: {
            userList: response.data
        }
    }
});