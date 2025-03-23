import React, { useState } from 'react'
import './Sauvegarde.css'
import { Button, FormControl, Input, InputLabel } from '@mui/material'
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export default function Sauvegarde() {



    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };


    const [mdp, setMdp] = useState('');
    const [mdpIncor, setMdpIncor] = useState(false);


    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }


    const exporteBD = async () => {
        console.log(user)
        try {
            istoken();
            const response = await validateAxios.get(`${path}/api/courriers/export_bd/${user._id}/${mdp}`,{
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'courriers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            setMdpIncor(false);
        } catch (error) {
            setMdpIncor(true);
            console.error('Erreur lors du téléchargement du fichier CSV', error);
        }

    };

    return (
        <div className='sauvegarde'>
            <h2>Sauvegarde de la base de données</h2>
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
                    className='enreg-inf'
                    variant="contained"
                    size="medium"
                    onClick={() => { exporteBD() }}
                >
                    Sauvegarder
                </Button>
            </div>
        </div>
    )
}
