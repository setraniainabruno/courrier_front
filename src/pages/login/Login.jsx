import React, { useEffect, useRef, useState } from 'react'
import './Login.css'
import { Button, InputAdornment, TextField } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import { motion } from 'framer-motion';
import { path } from '../../utils/api'



export function Login() {

    useEffect(() => {
        document.title = 'Authentification : Gestion de courrier';
    }, [])

    const navigate = useNavigate();

    const passRef = useRef(null);
    const [isCheck, setIsCheck] = useState(false);
    const showPass = () => setIsCheck((a) => !a)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    const [admin, setAdmin] = useState({
        email: "email",
        mdp: ""
    })
    const recVal = (e) => {
        setAdmin((admin) => ({ ...admin, [e.target.name]: e.target.value }));
    }
    const inputMailRef = useRef(null);
    const inputMdpRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                console.log(admin.email);
                () => { getUtilisateur(admin.email) };
            }
        };

        const inputMailElement = inputMailRef.current;
        const inputMdpElement = inputMdpRef.current;
        if (inputMailElement) {
            inputMailElement.addEventListener('keypress', handleKeyPress);
        }
        if (inputMdpElement) {
            inputMdpElement.addEventListener('keypress', handleKeyPress);
        }

        return () => {
            if (inputMailElement) {
                inputMailElement.removeEventListener('keypress', handleKeyPress);
            }
            if (inputMdpElement) {
                inputMdpElement.removeEventListener('keypress', handleKeyPress);
            }
        };
    }, []);

    const [infoInc, setInfoInc] = useState(false);
    const [mdpIncor, setMdpIncor] = useState(false);

    //REQUETTES
    const getUtilisateur = async () => {
        try {
            const response = await axios.post(`${path}/api/utilisateurs/login`, admin);

            if (response.status === 200 && response.data.token) {
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);

                window.location.href = '/';

                setInfoInc(false);
                setMdpIncor(false);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setInfoInc(true);
                    setMdpIncor(false);
                } else if (error.response.status === 401) {
                    setInfoInc(false);
                    setMdpIncor(true);
                }
            } else {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                setInfoInc(false);
                setMdpIncor(false);
            }
        }
    };

    return (
        <div className='login'>

            <div className='formP'>
                <motion.div className='leftForm'


                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <img src="./mailLog.png" alt="img" className='imageL' />
                </motion.div>
                <motion.form className='form'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h2>Authentification</h2>
                    <div>
                        <TextField
                            name='email'
                            className='inputLog'
                            label="E-mail"
                            ref={inputMailRef}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon className='mailIcon' />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={recVal}
                        />
                        {infoInc &&
                            <p className='info-incorrecte-child'>Veuillez vérifier votre information !</p>
                        }
                    </div>
                    <div>
                        <TextField
                            name='mdp'
                            className='inputLog'
                            label="Mot de passe"
                            type={isCheck ? "text" : 'password'}
                            autoComplete="current-password"
                            ref={inputMdpRef}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HttpsIcon className='mdpIcon' />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                            onChange={recVal}
                        />
                        {mdpIncor &&

                            <p className='mdp-incorrecte-child'>Mot de passe incorrecte !</p>

                        }

                        <div className='check-login'>

                            <div className="checkbox-wrapper">
                                <input id="terms-checkbox-37" name="checkbox" type="checkbox"
                                    ref={passRef}
                                    onClick={showPass}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                />
                                <label className="terms-label" htmlFor="terms-checkbox-37">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" className="checkbox-svg">
                                        <mask fill="white" id="path-1-inside-1_476_5-37">
                                            <rect height="200" width="200"></rect>
                                        </mask>
                                        <rect mask="url(#path-1-inside-1_476_5-37)" strokeWidth="40" className="checkbox-box" height="200" width="200"></rect>
                                        <path strokeWidth="15" d="M52 111.018L76.9867 136L149 64" className="checkbox-tick"></path>
                                    </svg>
                                    <span htmlFor="checkbox-wrapper" className="label-text">Afficher le mot de passe</span>
                                </label>
                            </div>

                        </div>

                    </div>


                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={() => {
                            console.log(admin)
                            getUtilisateur(admin.email)
                        }}
                    >
                        Se connecter
                    </Button>

                    <div>

                        <p>Email : admin@gmail.com</p>
                        <p>Mot de passe : admin</p>
                    </div>
                </motion.form>


            </div>
        </div>
    )
}

