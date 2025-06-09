import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Input } from "../../components/ui/Input";
import { ButtonGreen } from "../../components/ui/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import Link from "next/link";
import { FiList } from "react-icons/fi";
import { subtle } from "crypto";

export default function User() {
    const { signUp } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [perfil, setPerfil] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const perfils = [
        {
            id: 1,
            name: 'Administrador'
        },
        {
            id: 2,
            name: 'Cozinha'
        },
        {
            id: 3,
            name: 'Bar'
        },
        {
            id: 4,
            name: 'Garçom'
        },
        {
            id: 5,
            name: 'Cliente'
        }
    ];

    async function handleSignUp(event: FormEvent) {
        event.preventDefault();
        if (name === '' || email === '' || password === '' || perfil === undefined) {
            alert('Preencha os campos!');
            return;
        }

        setLoading(true);

        let data = {
            name,
            email,
            password,
            perfil: perfil === 'Administrador' ? 'ADM' : perfil === 'Cozinha' ? 'KITCHEN' : perfil === 'Bar' ? 'BAR' : perfil === 'Garçom' ? 'WAITER' : 'CLIENT'
        }

        await signUp(data);

        setLoading(false);
    }

    return (
        <>
            <Head>
                <title>Uni Pizza - Novo Usuário!</title>
            </Head>
            <Header />
            <div className={styles.container}>
                <div className={styles.containerHead}>
                    <h1>Cadastrar Usuário</h1>
                    <button
                        title="Listar Categorias"
                        className={styles.button}>
                        <Link href="/users" legacyBehavior>
                            <a><FiList size={50} /></a>
                        </Link>
                    </button>
                </div>
                <form onSubmit={handleSignUp}
                    className={styles.form}>
                    <Input
                        placeholder="Digite seu nome"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <Input
                        placeholder="Digite seu e-mail"
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        placeholder="Digite sua senha"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <select value={perfil} onChange={e => setPerfil(e.target.value)}
                    className={styles.perfil}>
                        <option
                            key={undefined}>
                            Perfil
                        </option>
                        {
                            perfils.map((item, index) => (
                                <option
                                    key={item.id}
                                    value={item.name}>{item.name}
                                </option>
                            ))
                        }
                    </select>
                    <ButtonGreen
                        type="submit"
                        loading={loading}>
                        Cadastrar
                    </ButtonGreen>
                </form>
            </div>
            <Footer />
        </>
    )
}
