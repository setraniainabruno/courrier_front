import React, { useState } from 'react'
import './Supprime_compte.css'
import { Button, FormControl, Input, InputLabel, TextField } from '@mui/material'
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';


export default function Supprime_compte() {

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [mdp, setMdp] = useState('')
    const [mdpIncor, setMdpIncor] = useState(false);
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    const deconnexion = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('id_user');
        setTimeout(() => {
            window.location.href = '/login';
        }, 300);
    }

    const supprimeUtilisateur = async () => {
        try {
            istoken()
            console.log(mdp)
            const response = await validateAxios.delete(`${path}/api/utilisateurs/supprimer/${user._id}/${mdp}`);
            console.log('Utilisateur supprimé');
            setMdpIncor(false);
            deconnexion();

        } catch (error) {
            console.log('Utilisateur non supprimé');
            setMdpIncor(true);
        }
    };
    return (
        <div className='supprime-compte'>
            <h2>Suppression de compte</h2>
            <div className='premier'>
                <h3>Veuillez entrer votre mot de passe.</h3>

                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='mdp'
                        onChange={(e) => setMdp(e.target.value)}
                    />
                    {mdpIncor &&

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
                    id='suppCompte'
                    className='enreg-inf supp'
                    variant="contained"
                    size="medium"
                    onMouseDown={supprimeUtilisateur}
                >
                    Supprimer
                </Button>
            </div>
        </div>
    )
}
