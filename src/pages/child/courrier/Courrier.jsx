import React, { useEffect, useRef, useState } from 'react';
import './Courrier.css';
import { Box, Button, IconButton, TextField } from "@mui/material";
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ArrowBackIos, ArrowForwardIos, FirstPage, LastPage } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Nouveau } from '../nouveau/Nouveau';
import validateAxios from '../../../validateAxios';
import AddIcon from '@mui/icons-material/Add';
import { path } from '../../../utils/api';



export function Courrier() {


    useEffect(() => {
        document.title = 'Liste de courrier';
        recupCourriersMax();
    }, []);

    const estAdmin = JSON.parse(sessionStorage.getItem('user')).role === "Administrateur";
    // console.log('EstAdmin : ', estAdmin)


    const [ListeCourrier, setListeCourrier] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(ListeCourrier.length / itemsPerPage);

    const currentData = ListeCourrier.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const [sendmail, setSendmail] = useState(false);
    const mailRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mailRef.current && !mailRef.current.contains(event.target)) {
                setSendmail(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sendmail]);

    const [confirmSuppCourrier, setConfirmSuppCourrier] = useState(false);
    const suppCourrierRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suppCourrierRef.current && !suppCourrierRef.current.contains(event.target)) {
                setTimeout(() => {
                    setConfirmSuppCourrier(false);
                }, 300);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [confirmSuppCourrier]);

    const [afficheInfo, setAfficheInfo] = useState(false);
    const infoCourrierRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!mailRef.current && !suppCourrierRef.current) {
                if (infoCourrierRef.current && !infoCourrierRef.current.contains(event.target)) {
                    setAfficheInfo(false);
                }
            } else if (suppCourrierRef.current) {
                if (infoCourrierRef.current && !infoCourrierRef.current.contains(event.target) && !suppCourrierRef.current.contains(event.target)) {
                    setAfficheInfo(false);
                    setConfirmSuppCourrier(false);
                }
            } else if (mailRef.current) {
                if (infoCourrierRef.current && !infoCourrierRef.current.contains(event.target) && !mailRef.current.contains(event.target)) {
                    setAfficheInfo(false);
                    setSendmail(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        recupCourriersMax();
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [afficheInfo]);

    const [nouveauCourrier, setNouveauCourrier] = useState(false);
    const nouveauCourrierRef = useRef(null);



    const paperRef = useRef(null);
    const enableBorderBottom = () => {
        paperRef.current.style.borderBottom = "2px solid #6C9BCF";
    }
    const disableBorderBottom = () => {
        paperRef.current.style.borderBottom = "none";
    }

    const [courrierCible, setCourrierCible] = useState({
        num_courrier: "",
        nom_exp: "",
        motif_courrier: "",
        date_courrier: "",
        email_exp: "",
        nom_dest: ""
    })


    //REQUETTE

    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    const recupCourriersMax = async () => {

        try {
            istoken();

            const res = await validateAxios.get(`${path}/api/courriers`);
            setListeCourrier(res.data);
            // console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const [idCourrier, setIdCourrier] = useState(null);
    const deleteCourrier = async (id, num) => {
        try {
            istoken();
            const response = await validateAxios.delete(`${path}/api/courriers/supprimer/${id}`);
            supprimerFichiers(num);
            ajoutCourNotif(objetSupp);

        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const supprimerFichiers = async (numero) => {
        try {
            istoken();
            const response = await validateAxios.delete(`${path}/api/fichiers/supprimer_fichier/${numero}`);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const [fichiersInfo, setFichiersInfo] = useState([]);
    const selectFichier = async (num_courrier) => {
        try {
            istoken();
            const res = await validateAxios.get(`${path}/api/fichiers/select_fichier/${num_courrier}`);
            setFichiersInfo(res.data);
            // console.log('Fichiers récupérés:' + res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers:', error);
        }
    };


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
            const res = await validateAxios.get(path + '/api/courriers/max_num_courrier');
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

            istoken();
            console.log(courrier)

            await validateAxios.post(path + '/api/courriers/ajout', courrier);
            ajout_fichier();
            ajoutCourNotif(objetAjout);

            console.log('Employee added successfully');
            setCourrier({
                num_courrier: "",
                nom_exp: "",
                motif_courrier: "",
                date_courrier: dayjs().format('DD-MM-YYYY'),
                email_exp: "---",
                nom_dest: "---"
            });
            setTimeout(() => {
                setNouveauCourrier(false);
                setFichiers([]);
                setFichiers1([]);
            }, 300);

        } catch (error) {
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
            const response = await validateAxios.post(`${path}/api/fichiers/ajout_fichier`, formData);
            recupCourriers();
            setTimeout(() => {
                setNouveauCourrier(false);
            }, 300);


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

    const telechargerFichier = async (num_courrier) => {
        try {
            istoken();

            const response = await validateAxios.get(`${path}/api/fichiers/telechargement/${num_courrier}`, {

                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `Fichier_${num_courrier}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement du fichier:", error);
        }
    };




    const [emailEnv, setEmaiEnv] = useState({
        dest: '',
        objet: '',
        contenue: ''
    });

    const recupVal = (e) => {
        const { name, value } = e.target;
        setEmaiEnv({ ...emailEnv, [name]: value });
    };

    const envoieEmail = async (e) => {
        e.preventDefault();
        try {
            const objetMail = {
                email: JSON.parse(sessionStorage.getItem('user')).email,
                contenue: `Un email a été envoyé ${emailEnv.dest}. Objet :${emailEnv.objet}. Contenue : ${emailEnv.contenue}`,
                photo: "mail-send.svg"
            };
            const response = await validateAxios.post(`${path}/api/email/envoie_email`, emailEnv);


            if (response.status === 200) {
                ajoutCourNotif(objetMail);
                setSendmail(false);
                console.log('Email envoyé avec succès!');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email :', error);
        }
    };




    const recherche = async (cle) => {
        try {
            const response = await validateAxios.get(`${path}/api/courriers/recherche/${cle}`);
            setListeCourrier(response.data);
        } catch (error) {
            console.error('Erreur lors de la recherche des courriers:', error);
        }

    };

    const objetAjout = {
        email: JSON.parse(sessionStorage.getItem('user')).email,
        contenue: "Un nouveau courrier a été enregistré avec succès.",
        photo: "add-mail.svg"
    };

    const objetSupp = {
        email: JSON.parse(sessionStorage.getItem('user')).email,
        contenue: "Un courrier a été supprimé avec succès.",
        photo: "delete-mail.svg"
    };

    const ajoutCourNotif = async (objet) => {
        try {
            const response = await validateAxios.post(`${path}/api/notifications/ajouter`, objet);
        } catch (error) {
            console.log('Erreur lors de l\'ajout de la notification : ', error);
        }
    };
    return (
        <>
            {/* Information et modification */}

            {afficheInfo &&
                <motion.div className="courrier"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >

                    {sendmail &&
                        <motion.div className="sendMail"

                            initial={{ y: -600, x: -180, opacity: 0 }}
                            animate={{ y: -100, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            ref={mailRef}

                        >
                            <IconButton className='closeA' aria-label="modification" size="large" onClick={() => { setSendmail(false) }}>
                                <CloseIcon />
                            </IconButton>
                            <h3>Envoyer un e-mail.</h3>
                            <div>
                                <p>A :   {emailEnv.dest}</p>
                                <Input
                                    name='objet'
                                    className='inputMail'
                                    placeholder="Objet"
                                    sx={{
                                        '&::before': {
                                            display: 'none',
                                        },
                                        '&:focus-within': {
                                            outline: 'none',
                                        },
                                    }}

                                    onChange={recupVal}
                                />

                                <Textarea
                                    name='contenue'
                                    minRows={7}
                                    className='inputMail'
                                    placeholder="Votre message…"
                                    sx={{
                                        '&::before': {
                                            left: '2.5px',
                                            right: '2.5px',
                                            bottom: 0,
                                            top: 'unset',
                                            transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                            borderRadius: 0,
                                        },
                                        '&:focus-within::before': {
                                            transform: 'scaleX(1)',
                                        },
                                    }}
                                    onChange={recupVal}
                                />
                                <Button
                                    size="small"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    color="primary"
                                    onClick={envoieEmail}
                                >
                                    Envoyer
                                </Button>
                            </div>

                        </motion.div>
                    }

                    {confirmSuppCourrier &&

                        <motion.div
                            className="modPhoto"

                            initial={{ y: -400 }}
                            animate={{ y: 0 }}
                            ref={suppCourrierRef}

                        >
                            <IconButton className='closeA' aria-label="delete" size="large" onClick={() => { setConfirmSuppCourrier(false) }}>
                                <CloseIcon />
                            </IconButton>


                            <h3 className='supp'>Confirmation.</h3>
                            <p className='supp'>Voulez-vous supprimer cet courrier ?</p>
                            <div>
                                <Button
                                    className='btnOuiSupp'
                                    variant="outlined"
                                    size="small"
                                    color='error'
                                    onClick={() => {
                                        deleteCourrier(idCourrier, fichiersInfo[0].num_courrier);
                                        recupCourriersMax();
                                        setTimeout(() => {
                                            setConfirmSuppCourrier(false)
                                            setAfficheInfo(false);
                                        }, 1000);

                                    }}
                                >
                                    Supprimer
                                </Button>
                            </div>

                        </motion.div>
                    }



                    <motion.div className="infCourrierParent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        ref={infoCourrierRef}
                    >
                        <div className='head'>
                            <h2>Information du courrier</h2>

                        </div>

                        <div className='fichierCourrier'>
                            <div className='carte1' >
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<FileDownloadIcon />}
                                    className='impCarte'
                                    aria-label="delete"
                                    color="primary"
                                    onMouseDown={
                                        () => telechargerFichier(courrierCible.num_courrier)
                                    }
                                    disabled={!estAdmin}
                                >
                                </Button>
                                <div className='liste-fichier'>
                                    {fichiersInfo.map((file, index) => (
                                        <div key={index}>
                                            <div className='image-fichier-child'>
                                                <img
                                                    src="./rar.png" />
                                            </div>
                                            <p>{file.nom_fichier}</p>
                                        </div>
                                    ))}
                                </div>


                            </div>
                        </div>

                        <div className='infCourrier'>
                            <Box
                                className='left'
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '25rem' },
                                }}

                                noValidate
                            >
                                <TextField
                                    className='inputF'
                                    name="num_courrier"
                                    label="Numéro"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.num_courrier}

                                />
                                <TextField
                                    className='inputF'
                                    name="nom_exp"
                                    label="Nom expediteur"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.nom_exp}

                                />
                                <TextField
                                    className='inputF'
                                    name="motif_courrier"
                                    label="Motif"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.motif_courrier}
                                />

                                <TextField
                                    className='inputF'
                                    name="date_courrier"
                                    label="Date"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.date_courrier.slice(0, 10).split('-').reverse().join('-')}
                                />
                                <TextField
                                    className='inputF'
                                    name="email"
                                    label="Email de l'expediteur"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.email_exp == "---" ? "Aucun" : courrierCible.email_exp}
                                />
                                <TextField
                                    className='inputF'
                                    name="nom_dest"
                                    label="Nom destinataire"
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    defaultValue={courrierCible.nom_dest == "---" ? "Aucun" : courrierCible.nom_dest}

                                />
                            </Box>
                        </div>

                        <div className='btn'>

                            <Button
                                variant="contained"
                                size="medium"
                                className='btnA'
                                onClick={() => { setSendmail(true) }}
                                disabled={courrierCible.email_exp == "---" || !estAdmin}
                            >
                                Envoyer un e-mail
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="error"
                                onClick={() => { setConfirmSuppCourrier(true) }}
                                disabled={!estAdmin}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </motion.div>
                    <IconButton className='close' aria-label="delete" size="large"
                        onClick={() => {
                            setAfficheInfo(false),
                                setSelectFile1(null),
                                setUrlFile1("")
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </motion.div >
            }
            {
                nouveauCourrier &&
                <motion.div
                    className='nouveau-cour'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}

                >

                    <motion.div className="nouveau"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        ref={nouveauCourrierRef}
                    >
                        <IconButton className='closeAjout' aria-label="delete" size="large"
                            onClick={() => {


                                setTimeout(() => {
                                    setNouveauCourrier(false);
                                    setFichiers([]);
                                    setFichiers1([]);
                                }, 300);
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
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
                                                    recupCourriersMax();
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
                                    inputProps={{
                                        onInput: (e) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '');
                                        }
                                    }}

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

                                        slotProps={{
                                            textField: { variant: 'standard' },
                                        }}
                                        onChange={(date) => {
                                            setCourrier(prevC => ({ ...prevC, date_courrier: date.toDate() }));
                                            console.log(date.toDate());
                                        }}

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
                                        inputProps={{
                                            onInput: (e) => {
                                                e.target.value = e.target.value.toLowerCase();
                                            }
                                        }}
                                    />
                                    <TextField
                                        name='nom_dest'
                                        className='inputF'
                                        id="standard-basic"
                                        label="Nom destinataire"
                                        variant="standard"
                                        onChange={recVal}
                                        inputProps={{
                                            onInput: (e) => {
                                                e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
                                            }
                                        }}
                                    />
                                </Box>
                            </div>
                            <div className='btn'>

                                <Button
                                    variant="contained"
                                    size="medium"
                                    className='btnA'

                                    onClick={() => {
                                        recupCourriersMax();
                                        setConfirmAjoutCourrier(true);
                                    }}
                                >
                                    Valider
                                </Button>

                            </div>
                        </div>


                    </motion.div >

                </motion.div>
            }

            <div className='liste' id='divToPrint'>
                <div className='ajoutImp'>
                    <div className='rechercheP'>
                        <Paper
                            component="form"
                            sx={{ mt: 0.5, p: '0px 4px', display: 'flex', alignItems: 'center', width: 300, height: 39 }}
                            className="custom-paper"
                            ref={paperRef}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Recherche..."
                                className="custom-input"
                                type='search'
                                onFocus={() => { enableBorderBottom() }}
                                onBlur={() => { disableBorderBottom() }}

                                onChange={(e) => {
                                    recherche(e.target.value.trim())
                                }}


                            />
                            <IconButton type="button" aria-label="search" className="custom-icon-button" >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </div>
                </div>
                <div className='nouveau-courrier'>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={() => { setNouveauCourrier(true); recupCourriers(); }}
                        disabled={!estAdmin}

                    >
                        <AddIcon />
                        Nouveau courrier
                    </Button>
                </div>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Numéro</th>
                                <th>Nom expediteur</th>
                                <th>Motifs</th>
                                <th>Date</th>
                                <th>E-mail expediteur</th>
                                <th>Nom destinataire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((courrier, index) => (
                                <tr key={index}
                                    onClick={() => {
                                        setAfficheInfo(true);
                                        setCourrierCible(courrier);
                                        setEmaiEnv({ dest: courrier.email_exp });
                                        setIdCourrier(courrier._id);
                                        selectFichier(courrier.num_courrier);
                                    }}
                                >
                                    <td>{courrier.num_courrier}</td>
                                    <td>{courrier.nom_exp}</td>
                                    <td>{courrier.motif_courrier}</td>
                                    <td>{
                                        courrier.date_courrier.slice(0, 10).split('-').reverse().join('-')
                                    }</td>
                                    <td>{courrier.email_exp}</td>
                                    <td>{courrier.nom_dest}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
                <div className='controlTab'>
                    <div>
                        <IconButton
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="first page"
                        >
                            <FirstPage style={{ fontSize: '2.2rem' }} />
                        </IconButton>

                        <IconButton
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="previous page"
                        >
                            <ArrowBackIos />
                        </IconButton>
                    </div>

                    <div className="btnControlParent">
                        <span className='pageInfo'>
                            Page {currentPage} sur {totalPages}
                        </span>
                    </div>

                    <div>
                        <IconButton
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="next page"
                        >
                            <ArrowForwardIos />
                        </IconButton>
                        {/* Bouton pour accéder à la dernière page */}
                        <IconButton
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="last page"
                        >
                            <LastPage style={{ fontSize: '2.2rem' }} />
                        </IconButton>
                    </div>
                </div>
            </div >
        </ >
    )
}