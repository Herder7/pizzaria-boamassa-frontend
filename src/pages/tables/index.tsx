import { useEffect, useState, useContext } from 'react';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { FiEdit, FiFilter, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Footer } from '../../components/Footer';
import { SwitchTable, SwitchTableDisable } from '../../components/ui/Switch';
import Link from 'next/link';
import { AuthContext } from '../../contexts/AuthContext';

export interface TableItemProps {
    id: string;
    number: string;
    status: boolean;
    free: boolean;
    call_waiter: boolean;
    close_bill: boolean;
}

interface TableProps {
    tableList: TableItemProps[];
}

export default function Tables({ tableList }: TableProps) {
    const [tables, setTables] = useState(tableList || []);
    const [search, setSearch] = useState(true);
    const { user } = useContext(AuthContext);

    setTimeout(async function () {
        setSearch(!search);
    }, 5000);

    useEffect(() => {
        async function getTables() {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/tables');
            setTables(response.data);
        }
        getTables();
    }, [search]);

    async function handleDisableTable(id: string, disable: boolean) {
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/table/disable', {
                table_id: id,
                disable: disable
            });
            const response = await apiClient.get('/tables');
            setTables(response.data);
            if (disable) {
                toast.success("Mesa desabilitada com sucesso!", {
                    theme: 'dark'
                });
            } else {
                toast.success("Mesa habilitada com sucesso!", {
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
                        <h1>Mesas</h1>
                        {user?.perfil !== 'CLIENT' && (
                            <button
                            title="Adicionar mesas"
                            className={styles.button}>
                            <Link href="/table" legacyBehavior>
                                <a><FiPlus size={50} /></a>
                            </Link>
                        </button>
                        )}
                    </div>
                    {
                        tables.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhuma mesa foi encontrada...
                            </span>
                        ) || (
                            <div className={styles.table}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={styles.headNumber}>Mesas</th>
                                            <th>Disponível</th>
                                            <th>Livre</th>
                                            <th>Garçom</th>
                                            <th>Conta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            tables.map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className={styles.tdNumber}>
                                                            <span className={styles.number}>Mesa {item.number}</span>
                                                        </td>
                                                        <td className={styles.tdAcao}>
                                                            <SwitchTableDisable
                                                                isChecked={item.status}
                                                                itemTable={item}
                                                                handleDisableTable={handleDisableTable} />
                                                        </td>
                                                        <td className={styles.tdAcao}>
                                                            <SwitchTable
                                                                isChecked={item.free}
                                                                type='free' />
                                                        </td>
                                                        <td className={styles.tdAcao}>
                                                            <SwitchTable
                                                                isChecked={item.call_waiter}
                                                                type='call_waiter' />
                                                        </td>
                                                        <td className={styles.tdAcao}>
                                                            <SwitchTable
                                                                isChecked={item.close_bill}
                                                                type='close_bill' />
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
                    <span className={styles.total}>Total: {tables.length}</span>
                </main>
                <Footer />
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    const apiClient = setupAPIClient(context);
    const response = await apiClient.get('/tables');
    return {
        props: {
            tableList: response.data
        }
    }
});