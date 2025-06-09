import { useEffect, useState } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { FiRefreshCcw, FiPlus } from 'react-icons/fi';
import { setupAPIClient } from '../../services/api';
import { ModalOrder } from '../../components/Modal/ModalOrder';
import Modal from 'react-modal';
import { ButtonRefresh } from '../../components/ui/Button';
import Link from "next/link";
import { toast } from 'react-toastify';
import { Footer } from '../../components/Footer';

type OrderProps = {
    id: string;
    table: {
        number: string;
    }
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || []);
    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(true);

    setTimeout(async function () {
        setSearch(!search);
    }, 5000);

    useEffect(() => {
        async function getTables() {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/orders');
            setOrderList(response.data);
        }
        getTables();
    }, [search]);

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalView(id: string) {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/order/show', {
                params: {
                    order_id: id,
                }
            });
            setModalItem(response.data);
            setModalVisible(true);
        } catch (error) {
            toast.error('Houve um erro ao tentar visualizar os itens do pedido! Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }


    async function handleFinishItem(id: string) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/order/finish', {
                order_id: id,
            });
            const response = await apiClient.get('/orders');
            setOrderList(response.data);
            setModalVisible(false);
            toast.success('Pedido finalizado com sucesso!', {
                theme: 'dark'
            });
        } catch (error) {
            toast.error('Houve um erro ao finalizar o pedido! Erro: ' + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    async function handleRefreshOrders() {
        try {
            setLoading(true);
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/orders')
            setOrderList(response.data);
            setLoading(false);
        } catch (error) {
            toast.error("Houve um erro ao atualizar a lista de pedidos! Erro: " + error.response.data.error, {
                theme: 'dark'
            });
        }
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Painel - Pizzaria Boa Massa</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>
                        <ButtonRefresh
                            onClick={handleRefreshOrders}
                            disabled={loading}>
                            <FiRefreshCcw
                                size={25} />
                        </ButtonRefresh>
                    </div>
                    <button
                            title="Cadastrar Pedido"
                            className={styles.button}>
                            <Link href="/order" legacyBehavior>
                                <a><FiPlus size={50} /></a>
                            </Link>
                    </button>
                    <article className={styles.listOreders}>
                        {
                            orderList.length === 0 && (
                                <span className={styles.emptyList}>
                                    Nenhum pedido aberto foi encontrado...
                                </span>
                            )
                        }
                        {
                            orderList.map(item => (
                                <section key={item.id} className={styles.orderItem}>
                                    <button onClick={() => handleOpenModalView(item.id)}>
                                        <div className={styles.tag}></div>
                                        <span>Mesa {item.table.number}</span>
                                    </button>
                                </section>
                            ))
                        }
                    </article>
                </main>
                <Footer />
                {
                    modalVisible && (
                        <ModalOrder
                            isOpen={modalVisible}
                            onRequestClose={handleCloseModal}
                            order={modalItem}
                            handleFinishOrder={handleFinishItem}
                        />
                    )
                }
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/orders');
    return {
        props: {
            orders: response.data
        }
    }
});