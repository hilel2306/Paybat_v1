import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { supabase } from '../../supabase/supabaseClient'; // Remplacez par votre configuration Supabase
import { useState, useEffect } from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../billsTable/localeTextConstant'
import moment from 'moment-timezone';
const FIELDS_TO_FETCH = 'id, title, created_at,client_id, client_pro_id, amount_including_tax, status';

export default function BillsTable() {
    const [billData, setBillData] = useState([]);
    const [columns, setColumns] = useState([]);

    function generateColumnsFromData(data) {
        if (!data || data.length === 0) {
            return [];
        }

        const sampleData = data[0];
        const columns = Object.keys(sampleData).map((key) => {
            if (key === 'client_id' || key === 'client_pro_id') {
                return null; // Exclure les colonnes client_id et client_pro_id
            }

            return {
                field: key,
                headerName: key === 'client' ? 'Client' : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                flex: 1,
            };
        });

        return columns.filter((col) => col !== null); // Filtrer les colonnes nulles
    }

    function formatDate(dateString) {
        const date = moment(dateString).tz('Europe/Paris'); // Ajustez le fuseau horaire selon vos besoins
        console.log(date.format('DD/MM/YYYY'))
        return date.format('DD/MM/YYYY');
    }

    // Fonction pour formater un nombre en devise française
    function formatFrenchCurrency(nombre) {
        const formatteur = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        });

        return formatteur.format(nombre);
    }



    // Fonction pour formater un nombre en devise française
    function formatCurrencyAndDate(bills) {
        const billsFormated = []

        for (let i = 0; i < bills.length; i++) {
            bills[i].amount_including_tax = formatFrenchCurrency(bills[i].amount_including_tax);
            bills[i].created_at = formatDate(bills[i].created_at);
            billsFormated.push(bills[i])
        }
        console.log('BILLSFORMATED', billsFormated);
        return billsFormated
    }


    function sortColumnsOrder(columns) {
        const columnOrder = [
            'title',
            'created_at',
            'client',
            'amount_including_tax',
            'status',
        ];

        // Triez les colonnes en fonction de leur position dans columnOrder
        const sortedColumns = columnOrder.map((field) => columns.find((col) => col.field === field));

        // Filtrer les colonnes nulles (celles qui ne sont pas dans columnOrder)
        return sortedColumns.filter((col) => col !== undefined);
    }


    function translateColumnsHeader(columns) {
        const translatedColumns = []
        for (let i = 0; i < columns.length; i++) {
            switch (columns[i].field) {
                case 'title':
                    columns[i].headerName = 'Titre';
                    break
                case 'created_at':
                    columns[i].headerName = 'Crée le';
                    break
                case 'amount_including_tax':
                    columns[i].headerName = 'Montant HT';
                    break
                case 'status':
                    columns[i].headerName = 'Statut'
            }
            translatedColumns.push(columns[i])
        }
        return translatedColumns
    }


    useEffect(() => {
        const fetchBillData = async () => {
            let { data: bill, error } = await supabase
                .from('bill')
                .select(FIELDS_TO_FETCH);

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log('BILLS =>', bill);

                // Pour chaque facture, récupérez les informations sur le client ou le client_pro
                for (let i = 0; i < bill.length; i++) {
                    const { client_id, client_pro_id } = bill[i];

                    if (client_id) {
                        // Si c'est un client, récupérez ses informations depuis la table 'client'
                        const { data: client, error } = await supabase
                            .from('client')
                            .select('name, firstname')
                            .eq('id', client_id)
                            .single();


                        if (client) {
                            // Mettez à jour la facture avec les informations du client
                            bill[i].client = `${client.name} ${client.firstname}`;
                        }
                    } else if (client_pro_id) {
                        // Si c'est un client pro, récupérez ses informations depuis la table 'client_pro'
                        const { data: client_pro, error } = await supabase
                            .from('client_pro')
                            .select('name')
                            .eq('id', client_pro_id)
                            .single();

                        if (client_pro) {
                            // Mettez à jour la facture avec les informations du client pro
                            bill[i].client = client_pro.name;
                        }
                    }
                }
                const billsFormated = formatCurrencyAndDate(bill)
                setBillData(billsFormated);
                const generatedColumns = generateColumnsFromData(bill);
                const sortedColumns = sortColumnsOrder(generatedColumns);
                const translatedCols = translateColumnsHeader(sortedColumns)
                setColumns(translatedCols);
            }
        };
        fetchBillData();
    }, []);



    // const columns = [
    //     { field: 'title', headerName: 'Titre', flex: 1 },
    //     { field: 'created_at', headerName: 'Créé le', flex: 1 },
    //     { field: 'client_id', headerName: 'ID Client', flex: 1 },
    //     { field: 'client_pro_id', headerName: 'ID Client Pro', flex: 1 },
    //     { field: 'amount_including_tax', headerName: 'Montant TTC', type: 'number', flex: 1 },
    //     { field: 'status', headerName: 'Statut', flex: 1 },
    // ];

    // Fonction pour personnaliser le background de la colonne "status"
    const renderStatusCell = (params) => {
        return (
            <div
                style={{
                    backgroundColor: params.value === 'En attente de paiement' ? '#FBBD23' : '#1FD65F', // Personnalisez les couleurs en fonction des valeurs
                    padding: '6px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    width: '100%'
                }}
            >
                {params.value}
            </div>
        );
    };

    return (
        <Box sx={{ height: 600, width: 1 }}>
            <DataGrid
                rows={billData}
                columns={columns.map((column) =>
                    column.field === 'status' ? { ...column, renderCell: renderStatusCell } : column
                )}
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                localeText={GRID_DEFAULT_LOCALE_TEXT}
            />
        </Box>
    );
}


