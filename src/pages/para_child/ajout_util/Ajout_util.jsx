import React, { useEffect, useState } from 'react'
import './Ajout_util.css'
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import dayjs from 'dayjs';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';


export default function Ajout_util() {


    const [admin, setAdmin] = useState({
        nom: "",
        prenom: "",
        email: "",
        role: "Invité",
        mdp: "12345678",
        photo: "admin.jpg",
        dateC: dayjs().format('DD-MM-YYYY')
    });
    const recVal = (e) => {
        setAdmin((admin) => ({ ...admin, [e.target.name]: e.target.value }));

    }

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    //REQUETTES

    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }


    const utilId = JSON.parse(sessionStorage.getItem('user'))._id;
    const [util, setUtil] = useState(null);
    const [mdp1, setMdp1] = useState('');
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
            setUtil(response.data);

        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        }
    };

    useEffect(() => {
        infoUtilisateur();
    }, []);

    const ajoutUtilisateur = async () => {
        try {
            istoken();
            await validateAxios.post(`${path}/api/utilisateurs/ajout`, {
                nom: admin.nom,
                prenom: admin.prenom,
                pseudo: admin.pseudo,
                lieu: admin.lieu,
                email:admin.email,
                photo:admin.photo,
                mdp: admin.mdp,
                role:admin.role,

                mdpUtil: mdp1,
                correcte_mdp: util.mdp
            });

            console.log('Employee ajouté avec succé');
            setAdmin({
                nom: "",
                prenom: "",
                email: "",
                role: "Invité",
                mdp: "12345678",
                dateC: dayjs().format('DD-MM-YYYY')
            });
            setIncorMdp(false);
        } catch (error) {
            setIncorMdp(true);
            console.error('Ajout courrier ehoué', error);
        }
    }


    return (
        <div className='ajout_util' >
            <h2>Nouveau utilisateur</h2>
            <div className='premier'>
                <TextField
                    name='nom'
                    className='inputInfo'
                    id="standard-basic"
                    label="Nom"
                    variant="standard"
                    defaultValue={admin.nom}
                    onChange={recVal}
                />
                <TextField
                    name='prenom'
                    className='inputInfo'
                    id="standard-basic"
                    label="Prénom(s)"
                    variant="standard"
                    defaultValue={admin.prenom}
                    onChange={recVal}
                />
                <TextField
                    name='email'
                    className='inputInfo'
                    id="standard-basic"
                    label="E-mail"
                    variant="standard"
                    defaultValue={admin.email}
                    onChange={recVal}
                />
                <div>
                    <InputLabel id="role">Rôle</InputLabel>
                    <Select
                        name='role'
                        className='select inputInfo'
                        labelId="role"
                        defaultValue={admin.role}
                        onChange={recVal}

                        label="Rôle"
                        variant="standard"
                        MenuProps={{ classes: { paper: 'popup', listItem: 'popup' } }}
                    >

                        <MenuItem value="Invité">Invité</MenuItem>
                        <MenuItem value="Administrateur">Administrateur</MenuItem>

                    </Select>
                </div>
            </div>
            <div className='b'>
                <h3>Veuillez entrer votre mot de passe.</h3>

                <FormControl sx={{ m: 1 }} variant="standard" className='inputInfo'>
                    <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name='mdp_admin'
                        onChange={(e) => setMdp1(e.target.value)}
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
                        ajoutUtilisateur();
                    }}
                >
                    Enregistrer
                </Button>
            </div>
        </div>
    )
}
