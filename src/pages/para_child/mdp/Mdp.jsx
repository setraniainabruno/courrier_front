import React, { useEffect, useRef, useState } from 'react'
import './Mdp.css'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export default function Mdp() {



    const recVal = (e) => {
        setAdmin((admin) => ({ ...admin, [e.target.name]: e.target.value }));
    }
    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }
    const utilId = JSON.parse(sessionStorage.getItem('user'))._id;
    const [admin, setAdmin] = useState(null);
    const [incorMdp, setIncorMdp] = useState(false);
    const [difMdp, setDifMdp] = useState(false);

    const [ancienMdp, setAncienMdp] = useState('');
    const [mdp, setMdp] = useState('');
    const [mdpConf, setMdpConf] = useState('');

    const infoUtilisateur = async () => {
        try {
            istoken();
            if (!utilId) {
                console.log("ID d'utilisateur non trouvé dans le Session Storage.");
            }
            console.log(utilId);

            const response = await validateAxios.get(`${path}/api/utilisateurs/select_id/${utilId}`);

            setAdmin(response.data);
            setMdpAdmin(response.data.mdp);

        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        }
    };

    useEffect(() => {
        infoUtilisateur();
    }, []);

    const modifierMdp = async () => {
        if (mdp === mdpConf) {
            try {
                istoken()
                if (!utilId) {
                    console.log("ID d'utilisateur non trouvé dans le Session Storage.");
                }
                console.log(utilId);
                const response = await validateAxios.put(`${path}/api/utilisateurs/modification_mdp/${utilId}`, {
                    mdp1: ancienMdp,
                    nouveau_mdp: mdpConf,
                })
                setIncorMdp(false);
                setDifMdp(false);
                sessionStorage.setItem('user', JSON.stringify(admin));
                sessionStorage.setItem('id_user', admin._id);

                console.log('Utilisateur a éte bien mdifié')
            } catch (error) {
                setIncorMdp(true);
                setDifMdp(false);
                console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            }
        } else {
            setDifMdp(true);
            setIncorMdp(false);
        }
    };


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div className='mdp'>
            <h2>Changer votre mot de passe</h2>
            <div className='premier'>

                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='ancien_mdp'
                        onChange={(e) => setAncienMdp(e.target.value)}

                    />
                    {incorMdp &&
                        <p className='mdp-incorrecte-child'>Mot de passe vide ou incorrecte !</p>
                    }
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Nouveau mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='mdp'
                        onChange={(e) => setMdp(e.target.value)}

                    />
                </FormControl>
                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Confirmer</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='confirm_mdp'
                        onChange={(e) => setMdpConf(e.target.value)}

                    />
                    {difMdp &&
                        <p className='mdp-incorrecte-child'>Mot de passe différent !</p>
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
                    onMouseDown={modifierMdp}
                >
                    Enregistrer
                </Button>
            </div>
        </div>
    )
}
