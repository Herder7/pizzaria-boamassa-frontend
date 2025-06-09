import styles from './styles.module.scss';

export function Footer() {
    return (
        <footer className={styles.container}>
            <span>Copyright &copy; {new Date().toISOString().substring(0,4)} - Uni Pizza | Todos os direitos reservados</span>
        </footer>
    )
}