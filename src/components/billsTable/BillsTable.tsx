import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { supabase } from '../../supabase/supabaseClient'; // Remplacez par votre configuration Supabase
import { useState, useEffect } from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../billsTable/localeTextConstant'

const FIELDS_TO_FETCH = 'id, title, created_at, amount_including_tax, client_id, client_pro_id, status';



export default function BillsTable() {
    const [billData, setBillData] = useState([]);
    // const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchBillData = async () => {
            const { data: bill, error } = await supabase
                .from('bill')
                .select(FIELDS_TO_FETCH);

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log('BILLS =>', bill);
                setBillData(bill);
            }
        };
        fetchBillData();
    }, []);


    const columns = [
        { field: 'title', headerName: 'Titre', flex: 1 },
        { field: 'created_at', headerName: 'Créé le', flex: 1 },
        { field: 'amount_including_tax', headerName: 'Montant TTC', type: 'number', flex: 1 },
        { field: 'client_id', headerName: 'ID Client', flex: 1 },
        { field: 'client_pro_id', headerName: 'ID Client Pro', flex: 1 },
        { field: 'status', headerName: 'Statut', flex: 1 },
    ];

    return (
        <Box sx={{ height: 600, width: 1 }}>
            <DataGrid
                rows={billData}
                columns={columns} // Utilisez la variable "columns" générée dynamiquement
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


