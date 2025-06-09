import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import styles from './styles.module.scss';
import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Input, TextArea } from "../../components/ui/Input";
import { ButtonGreen } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { FiList, FiUpload } from 'react-icons/fi';
import { setupAPIClient } from "../../services/api";
import { toast } from 'react-toastify';
import { Footer } from "../../components/Footer";
import Link from "next/link";

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {

    const [imageUrl, setImageUrl] = useState('');
    const [imageProduct, setImageProduct] = useState(null);
    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return;
        }

        const image = event.target.files[0];

        if (!image) {
            return;
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/jpg' || image.type === 'image/bmp') {
            setImageProduct(image);
            setImageUrl(URL.createObjectURL(image));
        }
    }

    //Quando você seleciona uma nova categoria na lista
    function handleChangeCategory(event) {
        setCategorySelected(event.target.value);
    }

    function clearFields() {
        setImageUrl('');
        setImageProduct(null);
        setCategorySelected(null);
        setName('');
        setPrice('');
        setDescription('');
    }

    async function handleProduct(event: FormEvent) {
        event.preventDefault();

        try {
            const data = new FormData();

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageProduct);

            const apiClient = setupAPIClient();

            const response = await apiClient.post('/product', data);

            toast.success('Produto ' + response.data.name + ' cadastrado com sucesso!', {
                theme: "dark"
            });

            clearFields();

        } catch (error) {
            toast.error('Erro ao cadastrar o produto! Erro: ' + error.response.data.error, {
                theme: "dark"
            });
        }
    }

    return (
        <>
            <Head>
                <title>Cadastrar Produto - Pizzaria Boa Massa</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHead}>
                        <h1>Cadastrar Produtos</h1>
                        <button
                            title="Listar Categorias"
                            className={styles.button}>
                            <Link href="/products" legacyBehavior>
                                <a><FiList size={50} /></a>
                            </Link>
                        </button>
                    </div>
                    <form className={styles.form} onSubmit={handleProduct}>

                        <label className={styles.imageProduto}>
                            <span>
                                <FiUpload
                                    size={30}
                                    color="#FFF" />
                            </span>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/bmp"
                                onChange={handleFile} />

                            {
                                imageUrl && (
                                    <img
                                        className={styles.image}
                                        src={imageUrl}
                                        alt="Imagem do produto"
                                        width={250}
                                        height={250} />
                                )
                            }
                        </label>

                        <Select
                            onChange={handleChangeCategory}
                            value={categorySelected}>
                            {
                                categories.map((item, index) => {
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
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            type="text"
                            placeholder="Digite o nome do produto"
                            maxLength={20}
                        />
                        <Input
                            value={price}
                            onChange={(event) => setPrice(event.target.value.replace(/[^0-9]/g, ""))}
                            type="text"
                            placeholder="Digite o preço do produto"
                        />
                        <TextArea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Descreva o produto"
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

    const apiClient = setupAPIClient(context);

    const response = await apiClient.get('/categories');

    return {
        props: {
            categoryList: response.data
        }
    }
});