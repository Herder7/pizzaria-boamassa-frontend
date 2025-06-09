import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.scss';

import { FaSpinner } from 'react-icons/fa';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode
}

interface ButtonRefreshProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode
}

export function ButtonRed({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.buttonRed}
            disabled={loading}
            {...rest}
        >
            {loading ? (
                <FaSpinner color="#FFF" size={16} />
            ) : (
                <a
                    className={styles.buttonTextWhite}
                >
                    {children}
                </a>
            )}
        </button>
    )
}

export function ButtonGreen({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.buttonGreen}
            disabled={loading}
            {...rest}
        >
            {loading ? (
                <FaSpinner color="#FFF" size={16} />
            ) : (
                <a
                    className={styles.buttonTextBlack}
                >
                    {children}
                </a>
            )}
        </button>
    )
}

export function ButtonRefresh({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.buttonRefresh}
            disabled={loading}
            {...rest}
        >
            {loading ? (
                <FaSpinner color="#FFF" size={16} />
            ) : (
                <a
                    className={styles.buttonTextBlack}
                >
                    {children}
                </a>
            )}
        </button>
    )
}