import './Navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios, { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import validateAxios from '../../validateAxios';
import { path } from '../../utils/api';

import io from 'socket.io-client';

export function Navbar() {


    const [notifClick, setNotifClick] = useState(false);
    const [infoAdmin, setInfoAdmin] = useState(false);
    const notContenueRef = useRef(null);
    const notifRef = useRef(null);
    const infoAdminContenueRef = useRef(null);
    const infoAdminRef = useRef(null);
    const [popupData, setPopupData] = useState({ visible: false, top: 0, left: 0 });
    const plusInfoRefs = useRef([]);
    const popupRef = useRef(null);
    const util = JSON.parse(sessionStorage.getItem('user'));

    const estAdmin = JSON.parse(sessionStorage.getItem('user')).role === "Administrateur";


    const showHideDivNotif = () => {
        if (notifClick) {
            const notif = document.querySelector('.notContenue');
            notif.style.transition = "all 0.3s"
            notif.style.marginRight = "-26rem";
        }
        setTimeout(() => {
            setNotifClick(!notifClick);
        }, 300);
    }
    const showHideDivInfoAdmin = () => {
        if (infoAdmin) {
            const admin = document.querySelector('.infoAdminDiv1');
            admin.style.marginRight = "-26rem";
            admin.style.transition = "all 0.3s";
        }
        setTimeout(() => {
            setInfoAdmin(!infoAdmin);
        }, 300);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notContenueRef.current && !notContenueRef.current.contains(event.target) && !notifRef.current.contains(event.target)) {
                const notif = document.querySelector('.notContenue');
                notif.style.marginRight = "-26rem";
                notif.style.transition = "all 0.3s"
                setTimeout(() => {
                    setNotifClick(false);
                }, 300);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notifClick]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (infoAdminContenueRef.current && !infoAdminContenueRef.current.contains(event.target)) {
                const admin = document.querySelector('.infoAdminDiv1');
                admin.style.marginRight = "-26rem";
                admin.style.transition = "all 0.3s";
                setTimeout(() => {
                    setInfoAdmin(false);
                }, 300);
            }


        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [infoAdmin]);

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

    const deconnexion = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('id_user');
        setTimeout(() => {
            window.location.href = '/login';
        }, 300);
    }

    const setId = () => {
        const id = sessionStorage.getItem('user')
        sessionStorage.setItem('id_user', JSON.parse(id)._id);
    }

    const changeTheme = () => {
        if (localStorage.getItem('theme') == 'dark') {
            document.body.classList.add('dark-mode-variables');
            localStorage.setItem('theme', 'light');
            setEstSombre(true);
        } else if (localStorage.getItem('theme') == 'light') {
            document.body.classList.remove('dark-mode-variables');
            localStorage.setItem('theme', 'dark');
            setEstSombre(false);
        }
    }

    const handlePopupToggle = (index) => {
        const rect = plusInfoRefs.current[index].getBoundingClientRect();
        setPopupData({
            visible: !popupData.visible,
            top: rect.top - 107,
            left: rect.left - 170,
        });
    };

    const [estSombre, setEstSombre] = useState(false);
    const changeIcon = () => {
        if (localStorage.getItem('theme')) {
            if (localStorage.getItem('theme') == 'dark') {
                setEstSombre(false);
            } else if (localStorage.getItem('theme') == 'light') {
                setEstSombre(true);
            }
        } else {
            setEstSombre(true);
        }
    }
    useEffect(() => {
        changeIcon()
    }, [estSombre])
    const [pasDeNotif, setPasDeNotif] = useState(false);







    const setTitle = (titre) => {
        document.title = titre;
    }
    

    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }
    const [notifications, setNotifications] = useState([]);

    const selectNotifications = async () => {
        try {
            istoken();
            const response = await validateAxios.get(`${path}/api/notifications`);

            if (!response.data.notifications || response.data.notifications.length === 0) {
                console.warn('Aucune notification trouvée.');
                setNotifications([]);
                return;
            }

            setNotifications(response.data.notifications);
        } catch (err) {
            console.error('Erreur lors de la récupération des notifications:', err);
        }
    };

    const marqueNonLues = async () => {
        try {
            istoken();
            const response = await validateAxios.put(`${path}/api/notifications/marquer_comme_lues`)
            setNotificationCount("0");
            selectNotifications();
        } catch (error) {
            console.error('Erreur lors de la modification des notifications:', error);

        }
    };

    const [notificationCount, setNotificationCount] = useState("0");

    const compterNonLues = async () => {
        try {
            istoken();
            const response = await validateAxios.get(`${path}/api/notifications/compter_non_lues`);
            setNotificationCount(response.data.nombre);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications non lues :', error);
        }
    };


    useEffect(() => {
        document.documentElement.style.setProperty('--notification-content', Number(notificationCount) >= 1 ? `"${notificationCount}"` : "");
        document.documentElement.style.setProperty('--padding-notification-content', Number(notificationCount) >= 1 ? "0.2rem 0.4rem" : 0);
    }, [notificationCount]);


    useEffect(() => {
        const interval = setInterval(() => {
            compterNonLues();
            selectNotifications();
        }, 1000);
    }, []);



    const [notifId, setNotifId] = useState('');
    const suppNotification = async () => {
        try {
            istoken();
            const response = await validateAxios.delete(`${path}/api/notifications/supprimer/${notifId}`);
            setNotifId('');
            setPopupData({ visible: false });
        } catch (error) {
            console.log('Erreur lors de la suppression de la notification : ', error);
        }
    };

    const supprimerToutesLesNotifications = async () => {
        try {
            const response = await validateAxios.delete(`${path}/api/notifications/supprimer_tout`);
        } catch (error) {
            console.error('Erreur lors de la suppression des notifications:', error);
        }
    };


    return (

        <div className="right-section">
            {notifClick &&
                <motion.div className="notDiv">
                    <motion.div
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                        className='notContenue'
                        ref={notContenueRef}
                    >
                        <div className='titreNotif'>
                            <h2>Notification</h2>
                        </div>

                        {!pasDeNotif && notifications.length > 0 ?
                            (
                                <div className='notifChildParent'>
                                    {notifications.map((notif, index) => (
                                        <div className="notifChild" key={index}>
                                            <div className="notifChild-photo">
                                                <img src={`http://localhost:3723/utilisateurs/${notif.photo}`} alt="photo" />
                                            </div>
                                            <div className="infoNotifChild">
                                                <p>{notif.email}</p>
                                                <span>{notif.contenue}</span>
                                            </div>
                                            <div className='plusInfo'
                                                onClick={() => {
                                                    handlePopupToggle(index);
                                                    setNotifId(notif._id);
                                                }}
                                                ref={el => plusInfoRefs.current[index] = el}
                                            >
                                                <MoreVertRoundedIcon />
                                            </div>
                                            {popupData.visible && estAdmin &&
                                                (
                                                    <div className='popupNotif'
                                                        onClose={() => setPopupData({ ...popupData, visible: false })}
                                                        style={{ top: popupData.top, left: popupData.left }}
                                                        ref={popupRef}
                                                        onMouseDown={() => {
                                                            suppNotification();
                                                            selectNotifications();
                                                        }}
                                                    >
                                                        Supprimer cette notificaton
                                                    </div>
                                                )}
                                        </div>
                                    ))}

                                </div>
                            )
                            :
                            (
                                <div className='notifMes'>
                                    <button
                                        className='pasDeNotif'
                                    >
                                        <NotificationsIcon className='iconNot' fontSize='large' />
                                    </button>
                                    Il n'y a pas de notifications.

                                </div>
                            )
                        }
                        <div
                            className='footerNotif'
                            onClick={() => {
                                if (estAdmin) {
                                    supprimerToutesLesNotifications();
                                    setPasDeNotif(true);
                                    selectNotifications();
                                }
                            }}
                        >
                            <h2>Effacer toutes</h2>
                        </div>

                    </motion.div>
                </motion.div>
            }
            {infoAdmin &&
                <motion.div className="infoAdminDiv">
                    <motion.div
                        className='infoAdminDiv1'
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div

                            className='infoAdminContenue'
                            ref={infoAdminContenueRef}
                        >
                            <div className="profile">

                                <div className="profile-photo">
                                    <img src="./admin.jpg" />
                                </div>
                                <div className="info">
                                    <p>{util.email}</p>
                                </div>
                            </div>
                            <a href='/profile' className="profile"
                                onMouseDown={() => {
                                    setTitle('Profile');

                                }}
                            >
                                <button className='parametre'>
                                    <AccountCircleIcon className='iconParametre' fontSize='medium' />
                                </button>
                                <div className="info">
                                    <p>Votre profile</p>
                                </div>
                            </a>
                            <NavLink to={'parametre'} className="profile"
                                onMouseDown={() => {
                                    setId();
                                    setTitle('Paramètre');
                                }}
                            >
                                <button className='parametre'>
                                    <SettingsIcon className='iconParametre' fontSize='medium' />
                                </button>
                                <div className="info">
                                    <p>Paramètre</p>
                                </div>
                            </NavLink>



                            <div className="profile"
                                onClick={() => { changeTheme() }}
                            >
                                <button className='parametre'>
                                    {estSombre &&
                                        <ModeNightIcon className='iconParametre' fontSize='medium' />
                                    }
                                    {!estSombre &&
                                        <LightModeIcon className='iconParametre' fontSize='medium' />
                                    }
                                </button>
                                <div className="info">
                                    {estSombre &&
                                        <p>Desactiver le mode sombre</p>
                                    }
                                    {!estSombre &&
                                        <p>Activer le mode sombre</p>
                                    }
                                </div>
                            </div>




                            <div className="profile"
                                onClick={() => { deconnexion() }}
                            >
                                <button className='deconnexion'>
                                    <LogoutIcon className='iconDeconnexion' fontSize='medium' />
                                </button>
                                <div className="info">
                                    <p>Déconnexion</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }

            <div className="nav">
                <button id="menu-btn">
                    <MenuRoundedIcon fontSize='large' />
                </button>

                <button
                    className='notif'
                    ref={notifRef}
                    onClick={() => {
                        showHideDivNotif();
                        marqueNonLues();
                    }}
                >
                    <NotificationsIcon
                        className='iconNot'
                        fontSize='medium'
                        style={{ color: notifClick ? "#6C9BCF" : "" }}
                    />
                </button>


                <div className="profile">
                    <div
                        className="profile-photo"
                        ref={infoAdminRef}
                        onClick={() => {
                            showHideDivInfoAdmin();
                            setId();
                        }}
                    >
                        <img src="./admin.jpg" />
                    </div>
                </div>

            </div>
        </div >
    )
}