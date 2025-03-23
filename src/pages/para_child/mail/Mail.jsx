import React, { useEffect, useRef, useState } from 'react'
import './Mail.css'
import { Alert, Button, FormControl, Input, InputLabel, TextField } from '@mui/material'
import { motion } from 'framer-motion';
import axios from 'axios';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export default function Mail() {
    const mailRef = useRef(null);
    const showMdp = (e) => {
        if (mailRef.current) {
            mailRef.current.style.height = "31rem";
        }
    }
    const hideMdp = (e) => {
        if (mailRef.current) {
            mailRef.current.style.height = "12rem";
        }
    }



    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const [alerts, setAlerts] = useState([]);
    const showalert = () => {
        setAlerts([...alerts, { message: 'Alerte enregistrée', timestamp: Date.now() }]);

    };
    useEffect(() => {
        if (alerts.length > 0) {
            const timeout = setTimeout(() => {
                setAlerts(alerts.slice(1));
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [alerts]);


    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }
    const utilId = JSON.parse(sessionStorage.getItem('user'))._id;
    const [admin, setAdmin] = useState(null);
    const [mdp, setMdp] = useState('');
    const [incorMdp, setIncorMdp] = useState(false);

    const recVal = (e) => {
        setAdmin((admin) => ({ ...admin, [e.target.name]: e.target.value }));
    }


    const infoUtilisateur = async () => {
        try {
            istoken();
            if (!utilId) {
                console.log("ID d'utilisateur non trouvé dans le Session Storage.");
            }
            console.log(utilId);

            const response = await validateAxios.get(`${path}/api/utilisateurs/select_id/${utilId}`);

            console.log(response.data);
            setAdmin(response.data);

        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        }
    };

    useEffect(() => {
        infoUtilisateur();
    }, []);

    const modifierEmail = async () => {
        try {
            istoken()
            if (!utilId) {
                console.log("ID d'utilisateur non trouvé dans le Session Storage.");
            }
            console.log(utilId);
            const response = await validateAxios.put(`${path}/api/utilisateurs/modification_email/${utilId}`, {
                email: admin.email,
                mdp: mdp,
                correcte_mdp: admin.mdp
            })
            setIncorMdp(false);
            sessionStorage.setItem('user', JSON.stringify(admin));
            sessionStorage.setItem('id_user', admin._id);

            console.log('L\'email de l\'utilisateur a éte bien mdifié')
        } catch (error) {
            setIncorMdp(true);
            console.error('Erreur lors de la mise à jour d\'email de l\'utilisateur:', error);
        }
    };

    return (
        <div className='mail' ref={mailRef}>
            <h2>Addresse e-mail</h2>
            <div className='premier'>
                {admin ?
                    (
                        <TextField
                            name='email'
                            className='inputInfo'
                            id="standard-basic"
                            label="E-mail"
                            variant="standard"
                            defaultValue={admin.email}
                            onChange={recVal}
                            onInput={() => { showMdp() }}
                        />
                    ) : (
                        <p className='charge'>Chargement des informations...</p>
                    )
                }
            </div>
            <div className='b'>
                <h3>Veuillez entrer votre mot de passe.</h3>

                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='mdp'
                        onChange={(e) => setMdp(e.target.value)}
                    />
                    {incorMdp &&
                        <p className='mdp-incorrecte-child'>Mot de passe vide ou incorrecte !</p>
                    }
                    <div className='check'>
                        <input
                            type="checkbox" name="" id="pass"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}

                        />
                        <label htmlFor="pass">Afficher le mot de passe</label>
                    </div>
                </FormControl>
                <Button
                    className='enreg-inf'
                    variant="contained"
                    size="medium"
                    onMouseDown={() => { console.log(admin) }}
                    onClick={modifierEmail}
                >
                    Enregistrer
                </Button>

                {/* <div className='al'>
                    {alerts.slice().reverse().map((alert, index) => (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Alert
                                variant="filled"
                                severity="success"
                                key={index}

                            >
                                {alert.message} - {new Date(alert.timestamp).toLocaleString()}
                            </Alert>
                        </motion.div>
                    ))}
                </div> */}
            </div>
        </div>
    )
}
