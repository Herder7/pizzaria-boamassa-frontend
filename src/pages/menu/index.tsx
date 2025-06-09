import { useEffect, useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/uni_pizza_logo.png';
import { setupAPIClient } from "../../services/api";
import { FiFilter } from "react-icons/fi";
import { Footer } from "../../components/Footer";
import { SwitchTableCallWaiter, SwitchTableCloseBill } from "../../components/ui/Switch";
import { TableItemProps } from "../tables";
import { toast } from "react-toastify";

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

export default function Menu() {

    const [categories, setCategories] = useState<ItemCategoryProps[] | []>([]);
    const [products, setProducts] = useState<ProductItemProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState();
    const [imageUrl, setImageUrl] = useState(process.env.NEXT_PUBLIC_API_URL+'/files/');
    const [table, setTable] = useState<TableItemProps | null>();
    const [searchTable, setSearchTable] = useState(true);

    setTimeout(async function () {
        setSearchTable(!searchTable);
    }, 5000);

    const apiClient = setupAPIClient();

    useEffect(() => {
        async function getMenu() {

            var url_string = window.location.href;
            var url = new URL(url_string);
            var data = url.searchParams.get("table");

            const response = await apiClient.get('/menu/table', {
                params: {
                    table: data
                }
            });
            setTable(response.data);

            const productsList = await apiClient.get('/menu');
            if (productsList.data.length === 0) {
                setProducts([]);
            } else {
                setProducts(productsList.data);
            }

            const categoriesList = await apiClient.get('/menu/categories', {
                params: {
                    disable: '1'
                }
            });
            if (categoriesList.data.length === 0) {
                setCategories([]);
            } else {
                setCategories(categoriesList.data);
            }
        }

        getMenu();
    }, []);

    useEffect(() => {
        async function getTable() {
            var url_string = window.location.href;
            var url = new URL(url_string);
            var data = url.searchParams.get("table");

            const response = await apiClient.get('/menu/table', {
                params: {
                    table: data
                }
            });
            setTable(response.data);
        }

        getTable();
    }, [searchTable])

    async function handleChangeCategory(event) {
        const apiClient = setupAPIClient();
        if (event.target.value === 'Tudo') {
            const response = await apiClient.get('/menu');
            if (response.data.length === 0) {
                setProducts([]);
            } else {
                setProducts(response.data);
            }
        }
        for (let x = 0; x < categories.length; x++) {
            if (categories[x].name === event.target.value) {
                const response = await apiClient.get('/menu', {
                    params: {
                        category_id: categories[x].id
                    }
                });
                setProducts(response.data);
            }
        }
    }

    async function handleCallWaiter(id: string) {
        try {
            const response = await apiClient.put('/menu/call_waiter', {
                table_id: id,
                call_waiter: !table?.call_waiter
            });
            setTable(response.data);
        } catch (error) {
            toast.error("Ocorreu um erro ao chamar o garçom! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleCloseBill(id: string) {
        try {
            const response = await apiClient.put('/menu/close_bill', {
                table_id: id,
                close_bill: !table?.close_bill
            });
            setTable(response.data);
        } catch (error) {
            toast.error("Ocorreu um erro ao pedir a conta! Erro: " + error.response.data.error, {
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
                <Link href="/dashboard">
                    <Image
                        className={styles.logo}
                        src={logo}
                        alt="Logo Uni Pizza" />
                </Link>
                <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Menu - Mesa {table?.number}</h1>
                        <div className={styles.actionTable}>
                            <h4>Chamar Garçom</h4>
                            <SwitchTableCallWaiter
                                isChecked={table?.call_waiter}
                                itemTable={table}
                                handleCallWaiter={handleCallWaiter} />
                        </div>
                        <div className={styles.actionTable}>
                            <h4>Pedir a Conta</h4>
                            <SwitchTableCloseBill
                                isChecked={table?.close_bill}
                                itemTable={table}
                                handleCloseBill={handleCloseBill} />
                        </div>
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
                                    categories.map((item, index) => {
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
                    </div>
                    {
                        products.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum menu foi encontrado...
                            </span>
                        ) || (
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th
                                                className={styles.headNomeDescrição}>Nome e Descrição</th>
                                            <th>Preço</th>
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
            </div >
        </>
    )
}