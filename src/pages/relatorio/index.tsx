import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Footer } from '../../components/Footer';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { TableItemProps } from '../tables';
import { UserItemProps } from '../users';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { InputReport } from '../../components/ui/Input';
import moment from 'moment';
import { toast } from 'react-toastify';
import { ButtonGreen } from '../../components/ui/Button';

type PaymentItemProps = {
  id: string;
  total_amount: string;
  amount_paid: string;
  amount_pix: string;
  amount_money: string;
  amount_debit: string;
  amount_credit: string;
  created_at: Date;
  user: {
    name: string;
  };
  table: {
    number: string;
  };
};

interface PaymentProps {
  userList: UserItemProps[];
  tableList: TableItemProps[];
}

export default function Relatorio({ userList, tableList }: PaymentProps) {
  const [filterUsers, setFilterUser] = useState(userList || []);
  const [filterTables, setFilterTables] = useState(tableList || []);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [typesPaymentSelected, setTypesPaymentSelected] = useState(undefined);
  const [tablesSelected, setTablesSelected] = useState(undefined);
  const [usersSelected, setUsersSelected] = useState(undefined);
  const [pdfMakeInstance, setPdfMakeInstance] = useState<any>(null);

  useEffect(() => {
    const loadPdfMake = async () => {
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      pdfMake.vfs = pdfFonts.vfs;
      setPdfMakeInstance(pdfMake);
    };

    const date = new Date();
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const today =
      date.getFullYear().toString() +
      '-' +
      months[date.getMonth()] +
      '-' +
      (date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate().toString());

    setFilterDateFrom(today);
    setFilterDateTo(today);

    loadPdfMake();
  }, []);

  const filterTypesPayment = [
    { id: 1, name: 'Dinheiro' },
    { id: 2, name: 'PIX' },
    { id: 3, name: 'Débito' },
    { id: 4, name: 'Crédito' },
  ];

  async function getPayments() {
    const de = new Date(filterDateFrom);
    const para = new Date(filterDateTo);

    if (de > para) {
      toast.error('A data inicial não pode ser maior que a data final!', {
        theme: 'dark',
      });
      return;
    }

    let table: TableItemProps = undefined;
    if (tablesSelected !== undefined) {
      table = filterTables.find(item => item.number === tablesSelected.split(' ')[1]);
    }

    let user: UserItemProps = undefined;
    if (usersSelected !== undefined) {
      user = filterUsers.find(item => item.name === usersSelected);
    }

    const data = {
      type_payment: typesPaymentSelected === 'Pagamento' ? undefined : typesPaymentSelected,
      table_id: table?.id,
      user_id: user?.id,
      date_from: filterDateFrom,
      date_to: filterDateTo,
    };

    const apiClient = setupAPIClient();
    const response = await apiClient.post('/payments', data);

    if (response.data.length === 0) {
      toast.error('Não foi encontrado resultados para o filtro informado!', {
        theme: 'dark',
      });
      return;
    }

    impressao(response.data, filterDateFrom, filterDateTo, typesPaymentSelected);
  }

  function impressao(payments: PaymentItemProps[], date_from, date_to, typePayment) {
    if (!pdfMakeInstance) return;

    const reportTitle = [
      {
        text: `Uni Pizza - Relatório de Vendas${typePayment && typePayment !== 'Pagamento' ? ' - ' + typePayment : ''} - (${moment(date_from).format('DD/MM/YYYY')} - ${moment(date_to).format('DD/MM/YYYY')})`,
        fontSize: 25,
        bold: true,
        margin: [15, 20, 0, 45],
      },
    ];

    let total = 0;

    const dados = payments.map((item) => {
      total += Number(item.total_amount);
      return [
        { text: item.user?.name, fontSize: 12, marginLeft: 4 },
        { text: 'Mesa ' + item.table.number, fontSize: 12, marginLeft: 4 },
        { text: item.amount_money ? 'R$ ' + item.amount_money + ',00' : 'R$ 0,00', fontSize: 12, marginLeft: 4 },
        { text: item.amount_pix ? 'R$ ' + item.amount_pix + ',00' : 'R$ 0,00', fontSize: 12, marginLeft: 4 },
        { text: item.amount_debit ? 'R$ ' + item.amount_debit + ',00' : 'R$ 0,00', fontSize: 12, marginLeft: 4 },
        { text: item.amount_credit ? 'R$ ' + item.amount_credit + ',00' : 'R$ 0,00', fontSize: 12, marginLeft: 4 },
        { text: moment(item.created_at).format('DD/MM/YYYY'), fontSize: 12, marginLeft: 4 },
        { text: 'R$ ' + item.total_amount + ',00', fontSize: 12, marginLeft: 4 },
      ];
    });

    const details = [
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Usuário', bold: true, fontSize: 12 },
              { text: 'Mesa', bold: true, fontSize: 12 },
              { text: 'Dinheiro', bold: true, fontSize: 12 },
              { text: 'PIX', bold: true, fontSize: 12 },
              { text: 'Débito', bold: true, fontSize: 12 },
              { text: 'Crédito', bold: true, fontSize: 12 },
              { text: 'Data', bold: true, fontSize: 12 },
              { text: 'Valor', bold: true, fontSize: 12 },
            ],
            ...dados,
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ];

    function rodape(currentPage, pageCount) {
      return [
        {
          text: `Valor Total: R$ ${total},00     -     Página ${currentPage} de ${pageCount}`,
          alignment: 'right',
          fontSize: 12,
          bold: true,
          margin: [0, 10, 20, 0],
        },
      ];
    }

    const docDefinitions = {
      pageSize: 'A4',
      pageMargins: [15, 50, 15, 40],
      pageOrientation: 'landscape',
      header: [reportTitle],
      content: [details],
      footer: rodape,
    };

    pdfMakeInstance.createPdf(docDefinitions).open({}, window.open('', '_blank'));
  }

  return (
    <>
      <Head>
        <title>Relatório de vendas - Uni Pizza</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Relatório de Vendas</h1>
          <div className={styles.containerHead}>
            <div className={styles.filter}>
              <FiFilter size={30} />
              <select onChange={(e) => setUsersSelected(e.target.value)} value={usersSelected}>
                <option key={undefined}>Usuário</option>
                {filterUsers.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filter}>
              <FiFilter size={30} />
              <select value={typesPaymentSelected} onChange={(e) => setTypesPaymentSelected(e.target.value)}>
                <option key={undefined}>Pagamento</option>
                {filterTypesPayment.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <FiFilter size={30} />
              <select onChange={(e) => setTablesSelected(e.target.value)} value={tablesSelected}>
                <option key={undefined}>Mesa</option>
                {filterTables.map((item) => (
                  <option key={item.id} value={'Mesa ' + item.number}>
                    Mesa {item.number}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterCalendar}>
              <FiFilter size={30} />
              <InputReport value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} type="date" />
              <FiFilter size={30} />
              <InputReport value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} type="date" />
              <button title="Baixar relatório" className={styles.button} onClick={getPayments}>
                <FiDownload size={35} />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  const responseTables = await apiClient.get('/tables');
  const responseUsers = await apiClient.get('/users');
  return {
    props: {
      userList: responseUsers.data,
      tableList: responseTables.data,
    },
  };
});
