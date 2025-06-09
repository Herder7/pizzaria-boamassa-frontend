import { useEffect, useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { FiEdit, FiPlus, FiTrash, FiFilter } from "react-icons/fi";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { toast } from "react-toastify";
import { SwitchProduct } from "../../components/ui/Switch";
import { ModalDeleteProduct, ModalEditProduct } from "../../components/Modal/ModalEditDeleteProduct";

export type ProductItemProps = {
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
    status: boolean,
    category_id: string;
    category: {
        id: string;
        name: string;
    }
}

interface ItemCategoryProps {
    id: string;
    name: string;
}

interface ProductProps {
    productList: ProductItemProps[];
    categoryList: ItemCategoryProps[];
}

export default function Products({ productList, categoryList }: ProductProps) {

    const [products, setProducts] = useState(productList || []);
    const [categorySelected, setCategorySelected] = useState();
    const [imageUrl, setImageUrl] = useState(process.env.NEXT_PUBLIC_API_URL+'/files/');
    const [modalItem, setModalItem] = useState<ProductItemProps>();
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

    // const [search, setSearch] = useState(true);

    // setTimeout(async function () {
    //     setSearch(!search);
    // }, 5000);

    // useEffect(() => {
    //     async function getTables() {
    //         const apiClient = setupAPIClient();
    //         const response = await apiClient.get('/products');
    //         setProducts(response.data);
    //     }
    //     getTables();
    // }, [search]);

    async function handleChangeCategory(event) {
        const apiClient = setupAPIClient();
        if (event.target.value === 'Tudo') {
            const response = await apiClient.get('/products');
            if (response.data.length === 0) {
                setProducts([]);
            } else {
                setProducts(response.data);
            }
        }
        for (let x = 0; x < categoryList.length; x++) {
            if (categoryList[x].name === event.target.value) {
                const response = await apiClient.get('/product/bycategory', {
                    params: {
                        category_id: categoryList[x].id
                    }
                });
                if (response.data.length === 0) {
                    setProducts([]);
                } else {
                    setProducts(response.data);
                }
            }
        }
    }

    function handleCloseModal() {
        setModalEditVisible(false);
        setModalDeleteVisible(false);
    }

    async function handleOpenModalEdit(product: ProductItemProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/product', {
                params: {
                    product_id: product.id,
                }
            });
            setModalItem(response.data);
            setModalEditVisible(true);
        } catch (error) {
            toast.error('Houve um erro ao pesquisar o produto! Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleDeleteProduct(product: ProductItemProps) {
        try {
            const apiClient = setupAPIClient();

            const responseEdited = await apiClient.delete('/product', {
                params: {
                    product_id: product.id
                }
            });
            toast.success('Produto ' + responseEdited.data.name + ' deletado com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/products');
            setProducts(response.data);
            setModalDeleteVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao deletar o produto! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleOpenModalDelete(product: ProductItemProps) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/product', {
                params: {
                    product_id: product.id,
                }
            });
            setModalItem(response.data);
            setModalDeleteVisible(true);
        } catch (error) {
            toast.error('Houve um erro ao pesquisar o produto! Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleEditProduct(product: ProductItemProps) {
        try {
            const apiClient = setupAPIClient();

            const responseEdited = await apiClient.put('/product/update', {
                category_id: product.id,
                name: product.name
            });
            toast.success('Produto ' + responseEdited.data.name + ' editado com sucesso!', {
                theme: 'dark'
            });
            const response = await apiClient.get('/products');
            setProducts(response.data);
            setModalEditVisible(false);
        } catch (error) {
            toast.error("Houve um erro ao editar o produto! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }


    async function handleDisableProduct(id: string, disable: boolean) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/product/disable', {
                product_id: id,
                disable: disable
            });
            const response = await apiClient.get('/products');
            setProducts(response.data);
            if (disable) {
                toast.success("Produto desabilitado com sucesso!", {
                    theme: 'dark'
                });
            } else {
                toast.success("Produto habilitado com sucesso!", {
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
                <title>Listar Produtos - Uni Pizza</title>
            </Head>
            <div>
                <Header />
               <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Produtos</h1>
                        <div className={styles.filter}>
                            <FiFilter size={30} />
                            <select
                                onChange={handleChangeCategory}
                                value={categorySelected}>
                                <option
                                    key={'#'}>
                                    Tudo
                                </option>
                                {
                                    categoryList.map((item, index) => {
                                        return (
                                            <option
                                                key={item.id}>
                                                {item.name}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <button
                            title="Cadastrar Produto"
                            className={styles.button}>
                            <Link href="/product" legacyBehavior>
                                <a><FiPlus size={50} /></a>
                            </Link>
                        </button>
                    </div>
                    {
                        products.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum produto foi encontrado...
                            </span>
                        ) || (
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th
                                                className={styles.headNomeDescrição}>Nome e Descrição</th>
                                            <th>Preço</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map(item => {
                                                const price = 'R$' + item.price + ',00';
                                                return (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <img
                                                                className={styles.image}
                                                                src={imageUrl + item.banner}
                                                                alt="Imagem do produto"
                                                                width={250}
                                                                height={250} />
                                                        </td>
                                                        <td className={styles.nameDescription}>
                                                            <span className={styles.name}>{item.name}</span>
                                                            <span>{item.description}</span>
                                                        </td>
                                                        <td
                                                            className={styles.price}>
                                                            {price}
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
                                                            <SwitchProduct
                                                                isChecked={item.status}
                                                                itemProduct={item}
                                                                handleDisableProduct={handleDisableProduct} />
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
                    <span className={styles.total}>Total: {products.length}</span>
                </main>
                <Footer />
                {
                    modalEditVisible && (
                        <ModalEditProduct
                            isOpen={modalEditVisible}
                            onRequestClose={handleCloseModal}
                            product={modalItem}
                            handleEditProduct={handleEditProduct}
                        />
                    )
                }
                {
                    modalDeleteVisible && (
                        <ModalDeleteProduct
                            isOpen={modalDeleteVisible}
                            onRequestClose={handleCloseModal}
                            product={modalItem}
                            handleDeleteProduct={handleDeleteProduct}
                        />
                    )
                }
            </div >
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);
    const responseProducts = await apiClient.get('/products');
    const responseCategories = await apiClient.get('/categories');
    return {
        props: {
            productList: responseProducts.data,
            categoryList: responseCategories.data
        }
    }
});