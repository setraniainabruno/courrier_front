import React, { useEffect, useRef, useState } from 'react'
import './Utilisateur.css'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { NavLink } from 'react-router-dom';
import validateAxios from '../../../validateAxios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { path } from '../../../utils/api';


export default function Utilisateur() {


    const [popupData, setPopupData] = useState({ visible: false, top: 0, left: 0 });
    const plusInfoRefs = useRef([]);
    const popupRef = useRef(null);
    const [pasUtilisateur, SetPasUtilisateur] = useState(false);

    const estAdmin = JSON.parse(sessionStorage.getItem('user')).role === "Administrateur";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && popupData.visible) {
                setPopupData({ ...popupData, visible: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupData.visible]);

    const handlePopupToggle = (index) => {
        const rect = plusInfoRefs.current[index].getBoundingClientRect();
        setPopupData({
            visible: !popupData.visible,
            top: rect.top - 22,
            left: rect.left - 220,
        });
    };

    //REQUETTES
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id_user');
    const user = JSON.parse(sessionStorage.getItem('user'));

    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    const [utilisateurs, setUtilisateurs] = useState([]);
    const recupUtilisateurs = async () => {
        try {
            istoken();
            const res = await validateAxios.get(`${path}/api/utilisateurs`);
            setUtilisateurs(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        sessionStorage.setItem('email_user', user.email);
        recupUtilisateurs();
    }, []);

    const supprimeAutreUtilisateur = async () => {
        try {
            istoken()
            const response = await validateAxios.delete(`${path}/api/utilisateurs/supprimer_autre/${id}`);
            console.log('Utilisateur supprimé');
            sessionStorage.setItem('id_user', user._id);


            recupUtilisateurs();


        } catch (error) {
            console.log('Utilisateur non supprimé');
        }
    };


    return (
        <div className='utilisateur'>
            <h2>Utilisateur(s)</h2>

            {!pasUtilisateur &&
                (<div className='liste-utilisateur'>
                    {utilisateurs.map((user, index) => (
                        <>
                            {user.email != sessionStorage.getItem('email_user') &&
                                <div className="utilisateur-info" key={index}>
                                    <div className="utilisateur-info-photo">
                                        <img src="./admin.jpg" alt="Admin" />
                                    </div>
                                    <div className="utilisateur-nom-mail">
                                        <p>{user.nom}</p>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="utilisateur-role">
                                        <span>{user.role}</span>
                                    </div>
                                    <div className='plusInfo' onClick={
                                        () => {
                                            handlePopupToggle(index);
                                            sessionStorage.setItem('id_user', user._id);
                                        }}
                                        ref={el => plusInfoRefs.current[index] = el}>
                                        <MoreVertRoundedIcon />
                                    </div>
                                    {
                                        popupData.visible && (
                                            <div className='utilisateur-popup'
                                                onClose={() => setPopupData({ ...popupData, visible: false })}
                                                style={{ top: popupData.top, left: popupData.left }}
                                                ref={popupRef}
                                            >
                                                <NavLink to={'/profile'} className="utilisateur-popup-child"
                                                    onMouseDown={() => {
                                                        setTitle('Profile');
                                                    }}
                                                >
                                                    <p>Voir le profil</p>
                                                </NavLink>
                                                {estAdmin &&
                                                    <p className='utilisateur-popup-child supp'

                                                        onMouseDown={() => {
                                                            supprimeAutreUtilisateur();
                                                            setPopupData({ visible: false });
                                                        }}
                                                    >
                                                        Supprimer l'utilisateur
                                                    </p>
                                                }
                                            </div>
                                        )
                                    }
                                </div>}

                        </>))}

                </div>)
            }

            {
                pasUtilisateur && (<div className='utilisateur-rien'>
                    <button
                        className='pasUtilisateur'
                    >

                        <AccountCircleIcon className='iconNot' fontSize='large' />
                    </button>
                    Il n'y a pas d'autre utilisateur.

                </div>)
            }
            <div className='utilisateur-footer'>
            </div>

        </div>
    )
}
