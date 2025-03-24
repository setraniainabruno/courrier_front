import './Profile.css';
import { useEffect, useRef, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import validateAxios from '../../../validateAxios';
import { path } from '../../../utils/api';

export function Profile() {

    useEffect(() => {
        document.title = 'Profile';
        profileUtilisateur();
    }, []);
    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    const [modPhoto, setModPhoto] = useState(false);
    const modPhotoRef = useRef(null);
    const [urlFile1, setUrlFile1] = useState('');

    const handlechangeImgInf = (e) => {
        const file1 = e.target.files[0];
        setUrlFile1(URL.createObjectURL(file1));
    };

    const changeStatusModPhoto = () => {
        setTimeout(() => {
            setModPhoto(!modPhoto);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modPhotoRef.current && !modPhotoRef.current.contains(event.target)) {
                setTimeout(() => {
                    setModPhoto(false);
                }, 300);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modPhoto]);

    const utilId = sessionStorage.getItem('id_user');
    const [util, setUser] = useState(null);


    const profileUtilisateur = async () => {
        try {
            istoken();
            if (!utilId) {
                console.log("ID d'utilisateur non trouvé dans le Session Storage.");
            }
            console.log(utilId);

            const response = await validateAxios.get(`${path}/api/utilisateurs/select_id/${utilId}`);

            console.log(response.data);
            setUser(response.data);

        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', err);
        }
    };



    return (
        <div className='profileMain'>
            {modPhoto && (
                <motion.div
                    className="modPhoto"
                    initial={{ y: -300 }}
                    animate={{ y: 250 }}
                    ref={modPhotoRef}
                >
                    <IconButton className='closeA' aria-label="modification" size="large" onClick={changeStatusModPhoto}>
                        <CloseIcon />
                    </IconButton>
                    <h3>Modification.</h3>
                    <label className='moDph' htmlFor="imgModPhoto">Sélectionnez une image</label>
                    <p>
                        <input name='photo-profile' type="file" id='imgModPhoto' onChange={handlechangeImgInf} />
                    </p>
                    <div>
                        <Button variant="outlined" size="small" color='primary'>
                            Modifier
                        </Button>
                    </div>
                </motion.div>
            )}
            <div
                className="photo-couverture"
                style={{
                    backgroundImage: `url(${path}/utilisateurs/couverture.jpg})`,

                }}
            >
                <div
                    className="photo-profile"
                    onClick={changeStatusModPhoto}
                >
                    <img src={urlFile1 ? urlFile1 : "./admin.jpg"} alt="Profile" />
                </div>
            </div>
            <div className="infoAdmin">
                <div className="gauche">
                    {util ? (
                        <>
                            <div className='infoAdminChild'>
                                <p>{util.nom} {util.prenom}</p>
                            </div>
                            <div className='infoAdminChild'>
                                <p>{util.email}</p>
                            </div>
                            <div className='infoAdminChild'>
                                <p>Rôle : {util.role}</p>
                            </div>
                        </>
                    ) : (
                        <p>Chargement des informations...</p>
                    )}
                </div>
                <div className="droite">
                    {util ? (
                        <>
                            <div className='infoAdminChild'>
                                <p>Pseudo : {util.pseudo}</p>
                            </div>
                            <div className='infoAdminChild'>
                                <p>Lieu : {util.lieu}</p>
                            </div>
                            <div className='infoAdminChild'>
                                <p>Date de création : {util.dateC ? dayjs(util.dateC, 'DD-MM-YYYY').format('D MMMM YYYY') : 'Date non disponible'}</p>
                            </div>
                        </>
                    ) : (
                        <p>Chargement des informations...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
