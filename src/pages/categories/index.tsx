import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './styles.module.scss';
import Head from 'next/head';
import { FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Link from 'next/link';
// import { ModalDeleteCatergory, ModalEditCatergory } from '../../components/Modal/ModalEditDeleteCategory';
import { Footer } from '../../components/Footer';
import { ModalDeleteCatergory, ModalEditCatergory } from '../../components/Modal/ModalEditDeleteCategory';
import { SwitchCategory } from '../../components/ui/Switch';

export type CategoryItemProps = {
    id: string;
    name: string;
    status: boolean
}
interface CategoryProps {
    categoryList: CategoryItemProps[];
}

export default function Categories({ categoryList }: CategoryProps) {
    const [categories, setCategories] = useState(categoryList || []);
    const [modalItem, setModalItem] = useState<CategoryItemProps>();
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [search, setSearch] = useState(true);

    setTimeout(async function () {
        setSearch(!search);
    }, 5000);

    useEffect(() => {
        async function getTables() {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/categories');
            setCategories(response.data);
        }
        getTables();
    }, [search]);

    function handleCloseModal() {
        setModalEditVisible(false);
        setModalDeleteVisible(false);
    }

    async function handleOpenModalEdit(category: CategoryItemProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/category', {
                params: {
                    category_id: category.id,
                }
            });
            setModalItem(response.data);
            setModalEditVisible(true);
        } catch (error) {
            toast.error('Houve um erro ao pesquisar a categoria! Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleOpenModalDelete(category: CategoryItemProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/category', {
                params: {
                    category_id: category.id,
                }
            });
            setModalItem(response.data);
            setModalDeleteVisible(true);
        } catch (error) {
            toast.error('Houve um erro ao pesquisar a categoria! Erro: ' + error.response.data.error);
        }
    }

    async function handleEditCategory(category: CategoryItemProps) {
        try {
            const apiClient = setupAPIClient();

            const responseEdited = await apiClient.put('/category/update', {
                category_id: category.id,
                name: category.name
            });
            toast.success('Categoria ' + responseEdited.data.name + ' editada com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/categories');
            setCategories(response.data);
            setModalEditVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao editar a categoria! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleDeleteCategory(category: CategoryItemProps) {
        try {
            const apiClient = setupAPIClient();

            const responseDeleted = await apiClient.delete('/category', {
                params: {
                    category_id: category.id
                }
            });
            toast.success('Categoria deletada com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/categories');
            setCategories(response.data);
            setModalDeleteVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao deletar a categoria! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleDisableCategory(id: string, disable: boolean) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/category/disable', {
                category_id: id,
                disable: disable
            });
            const response = await apiClient.get('/categories');
            setCategories(response.data);
            if (disable) {
                toast.success("Categoria desabilitada com sucesso!", {
                    theme: 'dark'
                });
            } else {
                toast.success("Categoria habilitada com sucesso!", {
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
                        <h1>Categorias</h1>
                        <button
                            title="Cadastrar Categoria"
                            className={styles.button}>
                            <Link href="/category" legacyBehavior>
                                <a><FiPlus size={50} /></a>
                            </Link>
                        </button>
                    </div>
                    {
                        categories.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhuma categoria foi encontrada...
                            </span>
                        ) || (
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={styles.headNome}>Nome</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categories.map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className={styles.nameHeader}>
                                                            <span className={styles.name}>{item.name}</span>
                                                        </td>
                                                        <td
                                                            className={styles.acao}>
                                                            <button
                                                                title="Editar"
                                                                className={styles.button}
                                                                onClick={() => handleOpenModalEdit(item)}>
                                                                <FiEdit size={24} color='#D9D910' />
                                                            </button>
                                                            <button
                                                                title="Deletar"
                                                                className={styles.button}
                                                                onClick={() => handleOpenModalDelete(item)}>
                                                                <FiTrash size={24} color='#FF3F4B' />
                                                            </button>
                                                            <SwitchCategory
                                                                isChecked={item.status}
                                                                itemCategory={item}
                                                                handleDisableCategory={handleDisableCategory} />
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
                    <span className={styles.total}>Total: {categories.length}</span>
                </main>
                <Footer />
                {
                    modalEditVisible && (
                        <ModalEditCatergory
                            isOpen={modalEditVisible}
                            onRequestClose={handleCloseModal}
                            category={modalItem}
                            handleEditCategory={handleEditCategory}
                        />
                    )
                }
                {
                    modalDeleteVisible && (
                        <ModalDeleteCatergory
                            isOpen={modalDeleteVisible}
                            onRequestClose={handleCloseModal}
                            category={modalItem}
                            handleDeleteCategory={handleDeleteCategory}
                        />
                    )

                }
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);
    const response = await apiClient.get('/categories');
    return {
        props: {
            categoryList: response.data
        }
    }
});