import React, { useRef, useState } from 'react'
import './Information.css'
import { Button, FormControl, Input, InputLabel, TextField, getTableRowUtilityClass } from '@mui/material'
import { useEffect } from 'react';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export default function Information() {
    const informationRef = useRef(null);
    const showMdp = (e) => {
        if (informationRef.current) {
            informationRef.current.style.height = "48rem";
        }
    }
    const hideMdp = (e) => {
        if (informationRef.current) {
            informationRef.current.style.height = "31rem";
        }
    }




    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }
    const recVal = (e) => {
        setAdmin((admin) => ({ ...admin, [e.target.name]: e.target.value }));
    }


    const utilId = JSON.parse(sessionStorage.getItem('user'))._id;
    const [admin, setAdmin] = useState(null);
    const [mdp, setMdp] = useState('');
    const [incorMdp, setIncorMdp] = useState(false);


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

    const modifierUtilisateur = async () => {
        try {
            istoken();
            if (!utilId) {
                console.log("ID d'utilisateur non trouvé dans le Session Storage.");
            }
            const response = await validateAxios.put(`${path}/api/utilisateurs/modification/${utilId}`, {
                nom: admin.nom,
                prenom: admin.prenom,
                pseudo: admin.pseudo,
                lieu: admin.lieu,
                mdp: mdp,
                correcte_mdp: admin.mdp
            });
            setIncorMdp(false);
            sessionStorage.setItem('user', JSON.stringify(admin));
            sessionStorage.setItem('id_user', admin._id);
            console.log('Utilisateur a éte bien mdifié')
        } catch (error) {
            setIncorMdp(true);
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
    };

    return (
        <div className='information' ref={informationRef}>
            <h2>Information</h2>
            {admin ? (
                <div className='premier'>
                    <TextField
                        name='nom'
                        className='inputInfo'
                        id="standard-basic"
                        label="Nom"
                        variant="standard"
                        defaultValue={admin.nom}
                        onChange={recVal}
                        onInput={() => { showMdp() }}
                    />
                    <TextField
                        name='prenom'
                        className='inputInfo'
                        id="standard-basic"
                        label="Prénom(s)"
                        variant="standard"
                        defaultValue={admin.prenom}
                        onChange={recVal}
                        onInput={() => { showMdp() }}
                    />
                    <TextField
                        name='pseudo'
                        className='inputInfo'
                        id="standard-basic"
                        label="Pseudo"
                        variant="standard"
                        defaultValue={admin.pseudo}
                        onChange={recVal}
                        onInput={() => { showMdp() }}
                    />
                    <TextField
                        name='lieu'
                        className='inputInfo'
                        id="standard-basic"
                        label="Adresse"
                        variant="standard"
                        defaultValue={admin.lieu}
                        onChange={recVal}
                        onInput={() => { showMdp() }}
                    />
                </div>
            ) : (
                <p className='charge'>Chargement des informations...</p>
            )}
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
                    onMouseDown={() => {
                        console.log(admin);
                        modifierUtilisateur();
                    }}
                >
                    Enregistrer
                </Button>
            </div>
        </div>
    )
}
