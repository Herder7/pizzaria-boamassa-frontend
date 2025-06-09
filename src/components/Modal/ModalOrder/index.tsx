import Modal from 'react-modal';
import styles from './styles.module.scss';
import { FiX } from 'react-icons/fi'
import { OrderItemProps } from '../../../pages/dashboard';

interface ModalOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    order: OrderItemProps[]
    handleFinishOrder: (id: string) => void;
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {
    
    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1D1D2E',
            borderRadius: '1rem'
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}>
            <button
                type='button'
                onClick={onRequestClose}
                className='react-modal-close'
                style={{ background: 'transparent', border: 0 }}>
                <FiX size={45} color='#FF3F4B' className={styles.close} />
            </button>
            <div className={styles.container}>
                <h1>Detalhes do pedido</h1>
                <span className={styles.table}>
                    Mesa: <strong>{order[0].order.table}</strong>
                </span>
                <span>
                    {
                        order.map(item => (
                            <section
                                className={styles.containerItem}
                                key={item.id}>
                                <span>
                                    {item.amount} - <strong>{item.product.name}</strong>
                                </span>
                                <span
                                    className={styles.description}>
                                    {item.product.description}
                                </span>
                            </section>
                        ))
                    }
                </span>
                <button
                    className={styles.buttonConcluirOrder}
                    onClick={() => handleFinishOrder(order[0].order_id)}>
                    Concluir Pedido
                </button>

            </div>
        </Modal>
    )
}