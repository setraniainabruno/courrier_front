import './Nouveau.css';
import { Alert, Box, Button, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export function Nouveau() {

    useEffect(() => {
        document.title = 'Nouveau courrier';
    }, []);
    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }



    const [alert, setAlert] = useState({ message: "", severity: "" });
    const [isAlert, setIsAlert] = useState(false);
    const showalertS = () => {
        setAlert({ message: 'Courrier enregistré avec succée', severity: "success" });
    };

    const alRef = useRef(null);
    const showalertE = () => {
        alRef.current.style.top = "4rem";
        setAlert({ message: "Echec d'enregistrement du courrier", severity: "warning" });
        const hideAl = setTimeout(() => {
            alRef.current.style.left = "-100rem";
        }, 2000);
        const hideAl1 = setTimeout(() => {
            setIsAlert(false);
        }, 2500);
        return () => { clearTimeout(hideAl), clearTimeout(hideAl1) };
    };


    //REQUETTE
    const [courrier, setCourrier] = useState({
        num_courrier: null,
        nom_exp: "",
        motif_courrier: "",
        date_courrier: dayjs().format('DD-MM-YYYY'),
        email_exp: "---",
        nom_dest: "---"
    })

    const recVal = (e) => {
        setCourrier((courrier) => ({ ...courrier, [e.target.name]: e.target.value }));
    }

    const [confirmAjoutCourrier, setConfirmAjoutCourrier] = useState(false);
    const ajoutCourrierRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ajoutCourrierRef.current && !ajoutCourrierRef.current.contains(event.target)) {
                setTimeout(() => {
                    setConfirmAjoutCourrier(false);
                }, 300);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [confirmAjoutCourrier]);

    const [fichiers, setFichiers] = useState([]);
    const [fichiers1, setFichiers1] = useState([]);
    const numCourrier = courrier.num_courrier;
    const handleFileChange = (event) => {

        fichiers.forEach(file => URL.revokeObjectURL(file.path));

        const files = Array.from(event.target.files);
        setFichiers1(files);
        const fileDetails = files.map((file) => {
            const fileName = file.name;
            const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
            const urlFile = URL.createObjectURL(file);

            return {
                num_courrier: numCourrier,
                nom_fichier: fileName,
                extension: fileExtension,
                path: urlFile,
            };
        });
        setFichiers(fileDetails);
    };


    const [error, setError] = useState(null);
    const recupCourriers = async () => {
        try {
            istoken();
            const res = await validateAxios.get(`${path}/api/courriers/max_num_courrier`);
            setCourrier((courrier) => ({ ...courrier, num_courrier: res.data.maxNumCourrier + 1 }));

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };
    useEffect(() => {
        if (!error) {
            recupCourriers();
        } else {
            setCourrier((courrier) => ({ ...courrier, num_courrier: 1 }));
        }
    }, [error]);

    const ajoutCourrier = async () => {
        try {
            await validateAxios.post(`${path}/api/courriers/ajout`, courrier);
            ajout_fichier();

            console.log('Employee added successfully');
            setCourrier({
                num_courrier: "",
                nom_exp: "",
                motif_courrier: "",
                date_courrier: dayjs().format('DD-MM-YYYY'),
                email_exp: "---",
                nom_dest: "---"
            });
            const al = setTimeout(() => {
                showalertS();
            }, 500);
            return () => clearTimeout(al);

        } catch (error) {
            showalertE();
            console.error('Ajout courrier ehoué', error);
        }
    }

    const ajout_fichier = async () => {
        const formData = new FormData();
        formData.append('num_courrier', numCourrier);
        fichiers1.forEach((file, index) => {
            formData.append('fichiers', file);
            formData.append(`index_${index}`, index);
        });

        try {
            istoken();
            const response = await validateAxios.post(`${path}/api/fichiers/ajout_fichier`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
        } catch (error) {
            console.error('Erreur lors de l\'upload :', error.response ? error.response.data : error.message);
        }

        fichiers.map((file, index) => {
            console.log(`Fichier ${index} :`, {
                num_courrier: file.num_courrier || 'N/A',
                nom_fichier: file.nom_fichier,
                extension: file.extension,
                path: file.path,
                file: file.file
            });
        });
    };





    return (
        <motion.div className="nouveau"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {confirmAjoutCourrier &&
                <div className='ajouConf'>
                    <motion.div
                        className="modPhoto"

                        initial={{ y: -400 }}
                        animate={{ y: 0 }}
                        ref={ajoutCourrierRef}

                    >
                        <IconButton className='closeA' aria-label="delete" size="large" onClick={() => { setConfirmAjoutCourrier(false) }}>
                            <CloseIcon />
                        </IconButton>


                        <h3 className='primary'>Confirmation.</h3>
                        <p className='primary'>Voulez-vous ajouter cet courrier ?</p>
                        <div>
                            <Button
                                className='btnOuiSupp'
                                variant="outlined"
                                size="small"
                                color='primary'
                                onClick={() => {
                                    ajoutCourrier();
                                    setTimeout(() => {
                                        recupCourriers();
                                        setConfirmAjoutCourrier(false);
                                    }, 1000);
                                    console.log(courrier);

                                }}
                            >
                                OK
                            </Button>
                        </div>

                    </motion.div>
                </div>
            }

            <div className="ajoutC">
                <div className='dmd'>
                    <h2>Ajouter de nouveau courrier</h2>

                </div>
                <Box
                    className="ajoutC1"
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25rem' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <TextField
                        name='num_courrier'
                        className='inputF'
                        id="standard-basic"
                        label="Numéro"
                        variant="standard"
                        value={courrier.num_courrier || 1}
                        inputProps={{
                            onInput: (e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }
                        }}
                        autoFocus
                        selectOnFocus
                    />
                    <TextField
                        name='nom_exp'
                        className='inputF'
                        id="standard-basic"
                        label="Nom expediteur"
                        variant="standard"
                        onChange={recVal}

                    />
                    <TextField
                        name='motif_courrier'
                        className='inputF'
                        id="standard-basic"
                        label="Motif"
                        variant="standard"
                        onChange={recVal}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="date_courrier"
                            defaultValue={dayjs()}
                            label="Date"
                            className='inputF datePicker'
                            format="DD-MM-YYYY"

                            // minDate={dayjs()}

                            slotProps={{
                                textField: { variant: 'standard' },
                            }}
                            onChange={(date) => setCourrier(prevC => ({ ...prevC, date_courrier: date.format("DD-MM-YYYY") }))}
                        />
                    </LocalizationProvider>

                </Box>



            </div>
            <div className='infoRight'>

                <>{/* Fichier */}
                    <h2>Fichier</h2>
                    <label htmlFor="fichier-courrier" className='fichier'>
                        {fichiers.length == 0 &&
                            (<div >
                                <img className='uploade-file' src="./upload.png" />
                                <h2>Cliquer</h2>
                            </div>)
                        }
                        <input type="file" name="fichier-courrier" id="fichier-courrier" multiple onChange={handleFileChange} />
                        <div className='case-fichier-courrier'>
                            {fichiers.map((file, index) => (
                                <div key={index}>
                                    <div className={
                                        file.extension != 'pdf' && file.extension != 'doc' && file.extension != 'docx' && file.extension != 'dot' && file.extension != 'dotx' && file.extension != 'odt' && file.extension != 'xml'

                                            ? 'image-parent'
                                            : ''
                                    }>
                                        <img className={
                                            file.extension != 'pdf' && file.extension != 'doc' && file.extension != 'docx' && file.extension != 'dot' && file.extension != 'dotx' && file.extension != 'odt' && file.extension != 'xml'
                                                ? 'image-file'
                                                : 'icon-fichier-courrier'
                                        }
                                            src={
                                                file.extension == 'pdf'
                                                    ? "pdf.svg"
                                                    : file.extension == 'doc' || file.extension == 'docx' || file.extension == 'dot' || file.extension == 'dotx' || file.extension == 'odt' || file.extension == 'xml'
                                                        ? "word.svg"
                                                        : file.extension == 'png' || file.extension == 'jpg' || file.extension == 'jpeg'
                                                            ? file.path
                                                            : "autre.svg"
                                            }

                                        />
                                    </div>
                                    <p>{file.nom_fichier.length <= 9 ? file.nom_fichier : file.nom_fichier.slice(0, 10) + "..."}</p>
                                </div>
                            ))}
                        </div>

                    </label>
                </>

                <div className='infoFacult'>
                    <div className='dmd'>
                        <h2>Information facultative</h2>
                    </div>
                    <Box
                        className="ajoutC1"
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25rem' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            name='email_exp'
                            className='inputF'
                            id="standard-basic"
                            label="Email de l'expediteur"
                            variant="standard"
                            onChange={recVal}
                        />
                        <TextField
                            name='nom_dest'
                            className='inputF'
                            id="standard-basic"
                            label="Nom destinataire"
                            variant="standard"
                            onChange={recVal}
                        />
                    </Box>
                </div>
                <div className='btn'>

                    <Button
                        variant="contained"
                        size="medium"
                        className='btnA'
                        // onClick={ajoutCourrier}
                        // onMouseDown={() => { setIsAlert(true); console.log(courrier) }}

                        onClick={() => { recupCourriers(); setConfirmAjoutCourrier(true) }}
                    >
                        Valider
                    </Button>

                    <Button
                        className='btnB'
                        variant="contained"
                        size="medium"
                        color="error"
                    >
                        Annuler
                    </Button>

                </div>
            </div>
            {isAlert &&
                <motion.div
                    className='al'
                    ref={alRef}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert
                        variant="filled"
                        severity={alert.severity}
                    >
                        {alert.message}
                    </Alert>
                </motion.div>
            }

        </motion.div >
    )
}