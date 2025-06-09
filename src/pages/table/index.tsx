import { FormEvent, useState } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { Input } from "../../components/ui/Input";
import { ButtonGreen } from "../../components/ui/Button";
import { toast } from 'react-toastify';
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Footer } from "../../components/Footer";
import Link from "next/link";
import { FiList } from "react-icons/fi";

export default function Table() {
    const [number, setNumber] = useState('1');

    async function handleTable(event: FormEvent) {
        event.preventDefault();
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.post('/table', {
                number: number
            });
            toast.success('Mesas cadastradas com sucesso!', {
                theme: "dark"
            });
        } catch (error) {
            toast.error('Erro ao cadastrar as mesas! Erro: ' + error.response.data.error, {
                theme: "dark"
            });
        }
        setNumber('');
    }
    return (
        <>
            <Head>
                <title>Cadastrar Mesas - Uni Pizza</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Cadastrar Mesas</h1>
                        <button
                            title="Listar Categorias"
                            className={styles.button}>
                            <Link href="/tables" legacyBehavior>
                                <a><FiList size={50} /></a>
                            </Link>
                        </button>
                    </div>
                    <form
                        onSubmit={handleTable}
                        className={styles.form}>
                        <Input
                            type="number"
                            placeholder="Digite a quantidade das mesas"
                            value={number}
                            min={1}
                            onChange={(event) => setNumber(event.target.value)}
                        />
                        <ButtonGreen
                            type="submit">
                            Cadastrar
                        </ButtonGreen>
                    </form>
                </main>
                <Footer />
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (context) => {
    return {
        props: {}
    }
});