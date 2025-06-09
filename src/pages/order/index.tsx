import { ChangeEvent, FormEvent, useState } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from 'react-toastify';
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { ButtonGreen } from "../../components/ui/Button";
import { Footer } from "../../components/Footer";

export interface TableItemProps {
    id: string;
    number: string;
    status: boolean;
    free: boolean;
    call_waiter: boolean;
    close_bill: boolean;
}

type ItemPropsProduct = {
    id: string,
    name: string,
    price: number,
    description: string,
    category_id: string,
    file: any;
}

export interface UserItemProps {
    id: string;
    name: string;
    email: string;
    perfil: string;
    status: boolean;
    is_logged: boolean;
}


interface OrderProps {
    tableList: TableItemProps[];
    productList: ItemPropsProduct[];
    userList: UserItemProps[];
}


export default function Order({ tableList, productList, userList }: OrderProps) {
    const [name, setName] = useState('');
    const [tables, setTables] = useState(tableList || []);
    const [products, setProducts] = useState(productList || []);
    const [tableSelected, setTableSelected] = useState(0);
    const [productSelected, setProductSelected] = useState(0);
    const [userSelected, setUserSelected] = useState(0);
    const [amount, setAmount] = useState('');
    const [userActive, setUserActive] = useState(userList || []);

    async function handleChangeTable(event) {
        setTableSelected(event.target.value);
    }

    async function handleChangeProducts(event) {
        setProductSelected(event.target.value);
    }

    function clearFields() {
        setTableSelected(null);
        setName('');
        setAmount('');
        setUserSelected(null);
        setProductSelected(null);
    }

    async function handleOrder(event: FormEvent) {
        event.preventDefault();

        try {
            const apiClient = setupAPIClient();

            const response = await apiClient.post('/order', {
                name: name,
                table_id: tables[tableSelected].id,
                amount: amount
            });

            const amountProduct = Number(products[productSelected].price);

            const responseProductItemAdded = await apiClient.post('/order/add', {
                order_id: response.data.id,
                product_id: products[productSelected].id,
                amount: amountProduct
            })

            toast.success('Pedido ' + response.data.id + ' cadastrada com sucesso!', {
                theme: "dark"
            });

            clearFields();
        } catch(error) {
            toast.error('Erro ao cadastrar pedido! Erro: ' + error.response.data.error, {
                theme: "dark"
            });
        }
    }

    return (
        <>
            <Head>
                <title>Adicionar Pedido - Pizzaria Boa Massa</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Adicionar Pedido</h1>
                    </div>
                    <form className={styles.form} onSubmit={handleOrder}>
                        <Select
                            onChange={handleChangeTable}
                            value={tableSelected}>
                                {
                                    tables.map((item, index) => {
                                        return (
                                            <option
                                                key={item.id}
                                                value={index}>
                                                {item.number}
                                            </option>
                                        )
                                    })
                                }
                        </Select>
                        <Input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            type="text"
                            placeholder="Digite o nome"
                            maxLength={20}
                        />
                        <Select
                            onChange={handleChangeProducts}
                            value={productSelected}>
                                {
                                    products.map((item, index) => {
                                        return (
                                            <option
                                                key={item.id}
                                                value={index}>
                                                {item.name}
                                            </option>
                                        )
                                    })
                                }
                        </Select>
                        <Input
                            value={amount}
                            onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ""))}
                            type="text"
                            placeholder="Digite o valor total"
                        />
                        <ButtonGreen
                            type="submit">
                                Adicionar
                        </ButtonGreen>
                    </form>
                </main>
                <Footer />
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);

    const responseTables = await apiClient.get('/tables');
    const responseProducts = await apiClient.get('/products');

    return {
        props: {
            tableList: responseTables.data, 
            productList: responseProducts.data
        }
    }
});