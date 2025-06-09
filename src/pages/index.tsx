import { useState, useContext, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/home.module.scss';
import logo from '../../public/boa_massa_logo.png';
import { Input } from "../components/ui/Input";
import { ButtonRed } from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from 'react-toastify';
import Link from "next/link";
import { canSSRGuest } from "../utils/canSSRGuest";
import { Footer } from "../components/Footer";

export default function Home() {

  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {
      toast.warning('Preencha os campos!', {
        theme: 'dark'
      });
      return
    }

    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Boa Massa - Faça seu Login</title>
      </Head>
      <div className={styles.container}>
        <Image
          className={styles.logo}
          src={logo}
          alt="Logo Boa Massa"
        />
        <div className={styles.login}>
          <form action="" onSubmit={handleLogin}>
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
            <ButtonRed
              type="submit"
              loading={loading}
            >
              Acessar
            </ButtonRed>
          </form>
          <Link href="/signup" legacyBehavior>
            <a className={styles.text}>Não possui uma conta? Cadastre-se!</a>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps = canSSRGuest(async () => {
  return {
    props: {}
  }
})