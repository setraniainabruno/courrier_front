import './Rapport.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export function Rapport() {

    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    useEffect(() => {
        document.title = 'Rapport';
        listeCourrierDeuxDate();
        listeCourrierMoisRecent();
    }, [])

    const [ListeCourrier, setListeCourrier] = useState([]);
    useEffect(() => {
        const recupCourriers = async () => {
            try {
                istoken();
                const res = await validateAxios.get(path + '/api/courriers');
                setListeCourrier(res.data)
                console.log(res.data);
            } catch (error) {
                console.log(error)
            }
        }

        recupCourriers();
    }, []);

    const [showTouteListe, setShowTouteListe] = useState(false);
    const [showMoisListe, setShowMoisListe] = useState(false);
    const [showPersListe, setShowPersListe] = useState(false);


    const changeHauteurToute = () => {
        const liste = document.querySelector('#toute-liste');
        const liste1 = document.querySelector('#pers-liste');
        const liste2 = document.querySelector('#mois-liste');
        if (showTouteListe) {
            liste.style.height = "6rem";
            liste.style.overflowX = "hidden";
            setShowTouteListe(false);
        } else {
            liste.style.height = "58vh";
            liste.style.overflowX = "auto";
            setShowTouteListe(true);
        }
        liste1.style.height = "6rem";
        liste1.style.overflowX = "hidden";
        liste2.style.height = "6rem";
        liste2.style.overflowX = "hidden";
        setShowMoisListe(false);
        setShowPersListe(false);
    };
    const changeHauteurMois = () => {
        const liste = document.querySelector('#mois-liste');
        const liste1 = document.querySelector('#toute-liste');
        const liste2 = document.querySelector('#pers-liste');
        if (showMoisListe) {
            liste.style.height = "6rem";
            liste.style.overflowX = "hidden";
            setShowMoisListe(false);
        } else {
            liste.style.height = "58vh";
            liste.style.overflowX = "auto";
            setShowMoisListe(true);
        }
        liste1.style.height = "6rem";
        liste1.style.overflowX = "hidden";
        liste2.style.height = "6rem";
        liste2.style.overflowX = "hidden";
        setShowTouteListe(false);
        setShowPersListe(false);

    };
    const changeHauteurPers = () => {
        const liste = document.querySelector('#pers-liste');
        const liste1 = document.querySelector('#toute-liste');
        const liste2 = document.querySelector('#mois-liste');
        if (showPersListe) {
            liste.style.height = "6rem";
            liste.style.overflowX = "hidden";
            setShowPersListe(false);
        } else {
            liste.style.height = "58vh";
            liste.style.overflowX = "auto";
            setShowPersListe(true);
        }
        liste1.style.height = "6rem";
        liste1.style.overflowX = "hidden";
        liste2.style.height = "6rem";
        liste2.style.overflowX = "hidden";
        setShowTouteListe(false);
        setShowMoisListe(false);
    };


    //Impression

    const handlePrintToute = () => {
        const printableDiv = document.getElementById('toute-liste-imp');
        if (printableDiv) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                    <html>
                        <body>
                        <h3>Liste du courrier</h3>
                            ${printableDiv.innerHTML}
                            <style>
                                h3{
                                    font-size: 1rem;
                                    font-family: Arial;
                                    word-spacing: 2px;
                                    width:100%;
                                    text-align: center;
                                }
                                .nbrC{
                                    text-align: left;
                                    font-size: 0.8rem;

                                }
                                .toutes-liste{
                                    width: 70rem;
                                    height: 70vh;
                                    background-color: #fff;
                                    padding: var(--padding-1);
                                    color: #000;
                                
                                }
                            
                                table{
                                    text-align: left;
                                    width: 100%;
                                    background-color: #fff;
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    margin-bottom: 0.5rem;
                                    table-layout: auto;
                                }
                                
                                table th,
                                table tr td{
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    padding: 0.4rem;
                                    font-size: 0.8rem;
                                    font-family: Arial !important;
                                    word-spacing: 2px;
                                }

                                th {
                                    font-weight: bold;
                                }
                            </style>
                        </body>
                    </html>
                `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handlePrintMois = () => {
        const printableDiv = document.getElementById('mois-liste-imp');
        if (printableDiv) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                    <html>
                        <body>
                        <h3>Liste du courrier</h3>
                            ${printableDiv.innerHTML}
                            <style>
                                h3{
                                    font-size: 1rem;
                                    font-family: Arial;
                                    word-spacing: 2px;
                                    width:100%;
                                    text-align: center;
                                }
                                .nbrC{
                                    text-align: left;
                                    font-size: 0.8rem;

                                }
                                .mois-liste{
                                    width: 70rem;
                                    height: 70vh;
                                    background-color: #fff;
                                    padding: var(--padding-1);
                                    color: #000;
                                
                                }
                            
                                table{
                                    text-align: left;
                                    width: 100%;
                                    background-color: #fff;
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    margin-bottom: 0.5rem;
                                    table-layout: auto;
                                }
                                
                                table th,
                                table tr td{
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    padding: 0.4rem;
                                    font-size: 0.8rem;
                                    font-family: Arial !important;
                                    word-spacing: 2px;
                                }

                                th {
                                    font-weight: bold;
                                }
                            </style>
                        </body>
                    </html>
                `);
            printWindow.document.close();
            printWindow.print();
        }
    };
   
    const handlePrintPers = () => {
        const printableDiv = document.getElementById('pers-liste-imp');
        if (printableDiv) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                    <html>
                        <body>
                        <h3>Liste du courrier </h3>
                            ${printableDiv.innerHTML}
                            <style>
                                h3{
                                    font-size: 1rem;
                                    font-family: Arial;
                                    word-spacing: 2px;
                                    width:100%;
                                    text-align: center;
                                }
                                .nbrC{
                                    text-align: left;
                                    font-size: 0.8rem;

                                }
                                .pers-liste{
                                    width: 70rem;
                                    height: 70vh;
                                    background-color: #fff;
                                    padding: var(--padding-1);
                                    color: #000;
                                
                                }
                            
                                table{
                                    text-align: left;
                                    width: 100%;
                                    background-color: #fff;
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    margin-bottom: 0.5rem;
                                    table-layout: auto;
                                }
                                
                                table th,
                                table tr td{
                                    border-collapse: collapse;
                                    border: 1px solid #000;
                                    padding: 0.4rem;
                                    font-size: 0.8rem;
                                    font-family: Arial !important;
                                    word-spacing: 2px;
                                }

                                th {
                                    font-weight: bold;
                                }
                            </style>
                        </body>
                    </html>
                `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const [dateDebut, setDateDebut] = useState(dayjs());
    const [dateFin, setDateFin] = useState(dayjs());

    const [listeDeux, setListeDeux] = useState([]);

    const listeCourrierDeuxDate = async () => {
        try {
            istoken();
            const res = await validateAxios.post(`${path}/api/courriers/select_entre_dates`, {
                date_debut: dayjs(dateDebut).format('DD-MM-YYYY'),
                date_fin: dayjs(dateFin).format('DD-MM-YYYY')
            });
            setListeDeux(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des documents:', error);
        }
    };
    const [listeMoisRecent, setListeMoisRecent] = useState([]);

    const listeCourrierMoisRecent = async () => {
        try {
            istoken();
            const res = await validateAxios.get(`${path}/api/courriers/mois_recent`);
            setListeMoisRecent(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des documents:', error);
        }
    };



    return (
        <div className='rapport-parent'>
            <div className='rapport'
                id='toute-liste'
            >
                <div
                    className="rapport-toutes-liste"
                    onMouseDown={changeHauteurToute}
                >
                    <h2>Toutes les liste</h2>
                    {showTouteListe
                        ? <KeyboardArrowDownIcon fontSize="large" />
                        : <KeyboardArrowRightIcon fontSize="large" />
                    }
                </div>
                <div className='btn-impr'>
                    <Button
                        variant="contained"
                        size="small"
                        id='btn-imp-toute'
                        onMouseDown={handlePrintToute}
                    >
                        Imprimer la liste
                    </Button>
                </div>

                <div className='toutes-liste' id='toute-liste-imp'>
                    <table>
                        <thead>
                            <th>Numéro courrier</th>
                            <th>Nom expediteur</th>
                            <th>Motifs</th>
                            <th>Date</th>
                        </thead>
                        <tbody>
                            {ListeCourrier.map((courrier, index) => (
                                <tr key={index}>
                                    <td>{courrier.num_courrier}</td>
                                    <td>{courrier.nom_exp}</td>
                                    <td>{courrier.motif_courrier}</td>
                                    <td>{courrier.date_courrier.slice(0, 10).split('-').reverse().join('-')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 className='nbrC'>Nombre du courrier : {ListeCourrier.length}</h3>
                </div>
                <div className="foot-liste"></div>
            </div>

            <div className='rapport'
                id='mois-liste'
            >
                <div
                    className="rapport-mois-liste"
                    onMouseDown={changeHauteurMois}
                >
                    <h2>Liste du mois</h2>
                    {showMoisListe
                        ? <KeyboardArrowDownIcon fontSize="large" />
                        : <KeyboardArrowRightIcon fontSize="large" />
                    }
                </div>
                <div className='btn-impr'>
                    <Button
                        variant="contained"
                        size="small"
                        id='btn-imp-mois'

                        onMouseDown={handlePrintMois}
                    >
                        Imprimer la liste
                    </Button>
                </div>

                <div className='mois-liste' id='mois-liste-imp'>
                    <table>
                        <thead>
                            <th>Numéro courrier</th>
                            <th>Nom expediteur</th>
                            <th>Motifs</th>
                            <th>Date</th>
                        </thead>
                        <tbody>
                            {listeMoisRecent.map((courrier, index) => (
                                <tr key={index}>
                                    <td>{courrier.num_courrier}</td>
                                    <td>{courrier.nom_exp}</td>
                                    <td>{courrier.motif_courrier}</td>
                                    <td>{courrier.date_courrier.slice(0, 10).split('-').reverse().join('-')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 className='nbrC'>Nombre du courrier : {listeMoisRecent.length}</h3>
                </div>
                <div className="foot-liste"></div>
            </div>

            <div className='rapport'
                id='pers-liste'
            >
                <div
                    className="rapport-pers-liste"
                    onMouseDown={changeHauteurPers}
                >
                    <h2>Liste personalisé</h2>
                    {showPersListe
                        ? <KeyboardArrowDownIcon fontSize="large" />
                        : <KeyboardArrowRightIcon fontSize="large" />
                    }
                </div>
                <div className='btn-impr'>

                    <Button
                        variant="contained"
                        size="small"
                        id='btn-imp-pers'
                        onMouseDown={handlePrintPers}
                    >
                        Imprimer la liste
                    </Button>
                    <div className='btn-impr-pers'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DatePicker
                                name="date_debut"
                                className='inputF datePicker datePers'
                                defaultValue={dayjs()}
                                maxDate={dayjs()}
                                label="Date début"
                                format="DD-MM-YYYY"

                                onChange={(newValue) => {
                                    setDateDebut(newValue);
                                    if (newValue.isAfter(dateFin)) {
                                        setDateFin(newValue);
                                    }
                                }}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '30px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-dark)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#6C9BCF',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--color-dark)',
                                    },
                                    '&:hover .MuiInputLabel-root': {
                                        color: '#6C9BCF',
                                    },
                                    '&.Mui-focused .MuiInputLabel-root': {
                                        color: '#6C9BCF',
                                    }
                                }}


                            />
                            <h2>-</h2>
                            <DatePicker
                                name="date_fin"
                                defaultValue={dayjs()}

                                label="Date fin"
                                className='inputF datePicker datePers'
                                format="DD-MM-YYYY"

                                onChange={(newValue) => setDateFin(newValue)}
                                minDate={dateDebut}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        height: '30px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--color-dark)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#6C9BCF',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--color-dark)',
                                    },
                                    '&:hover .MuiInputLabel-root': {
                                        color: '#6C9BCF',
                                    },
                                    '&.Mui-focused .MuiInputLabel-root': {
                                        color: '#6C9BCF',
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            size="small"
                            id='btn-imp-pers'
                            onMouseDown={() => {
                                listeCourrierDeuxDate();
                            }}
                        >
                            Valider
                        </Button>
                    </div>
                </div>

                <div className='pers-liste' id='pers-liste-imp'>
                    <table>
                        <thead>
                            <th>Numéro courrier</th>
                            <th>Nom expediteur</th>
                            <th>Motifs</th>
                            <th>Date</th>
                        </thead>
                        <tbody>
                            {listeDeux.map((courrier, index) => (
                                <tr key={index}>
                                    <td>{courrier.num_courrier}</td>
                                    <td>{courrier.nom_exp}</td>
                                    <td>{courrier.motif_courrier}</td>
                                    <td>{courrier.date_courrier.slice(0, 10).split('-').reverse().join('-')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 className='nbrC'>Nombre du courrier : {listeDeux.length}</h3>
                </div>
                <div className="foot-liste"></div>
            </div>


        </div>
    )
}