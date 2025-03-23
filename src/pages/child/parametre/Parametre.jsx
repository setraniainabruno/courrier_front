import React, { useEffect, useRef, useState } from 'react'
import './Parametre.css'
import Information from '../../para_child/information/Information';
import Mail from '../../para_child/mail/Mail';
import Mdp from '../../para_child/mdp/Mdp';
import Utilisateur from '../../para_child/utilisateur/Utilisateur';
import Ajout_util from '../../para_child/ajout_util/Ajout_util';
import Sauvegarde from '../../avance_child/sauvegarde/Sauvegarde';
import Supprime_compte from '../../avance_child/supprime_compte/Supprime_compte';

export default function Parametre() {
    useEffect(() => {
        document.title = 'Parametre';

    }, []);

    const estAdmin = JSON.parse(sessionStorage.getItem('user')).role === "Administrateur";
    
    const [info, setInfo] = useState(false);
    const activeInfo = () => {
        setInfo(true)
        setMail(false)
        setMdp(false)
        setUser(false)
        setNewUser(false)
        setAvance(false);
        af();
    }

    const [mail, setMail] = useState(false);
    const activeMail = () => {
        setInfo(false)
        setMail(true)
        setMdp(false)
        setUser(false)
        setNewUser(false)
        setAvance(false);
        af();
    }
    const [mdp, setMdp] = useState(false);
    const activeMdp = () => {
        setMail(false)
        setInfo(false)
        setMdp(true)
        setUser(false)
        setNewUser(false)
        setAvance(false);
        af();
    }

    const [user, setUser] = useState(false);
    const activeUser = () => {
        setMail(false)
        setInfo(false)
        setMdp(false)
        setUser(true)
        setNewUser(false)
        setAvance(false);
        af();
    }

    const [newUser, setNewUser] = useState(false);
    const activeNewUser = () => {
        setMail(false)
        setInfo(false)
        setMdp(false)
        setUser(false)
        setNewUser(true)
        setAvance(false);
        af();
    }
    const [avance, setAvance] = useState(false);
    const activeAvance = () => {
        setMail(false)
        setInfo(false)
        setMdp(false)
        setUser(false)
        setNewUser(false)
        setAvance(true);
        a();
    }


    const [avanceClick, setAvanceClick] = useState(false);
    const avanceRef = useRef(null);
    const a = () => {
        setAvanceClick((a) => !a);
        avanceRef.current.style.left = !avanceClick ? "4rem" : "-110%";
    };
    const af = () => {
        setAvanceClick(false);
        setSauvegarde(false);
        setSupprimerCompte(false);
        avanceRef.current.style.left = "-110%";
    };
    const [sauvegarde, setSauvegarde] = useState(false);
    const activeSauve = () => {
        setSauvegarde(true);
        setSupprimerCompte(false);
    };
    const [supprimerCompte, setSupprimerCompte] = useState(false);
    const activeSupp = () => {
        setSauvegarde(false);
        setSupprimerCompte(true);
    };
    return (
        <div className='parametre-main'>
            <div className="menu-parametre">
                <div
                    onClick={activeInfo}
                    className={info && 'active-para'}
                >
                    <h3>Informations</h3>
                </div>
                <div
                    onClick={
                        () => {
                            activeMail();
                        }

                    }
                    className={mail && 'active-para'}
                >
                    <h3>Addresse e-mail</h3>
                </div>
                <div
                    onClick={activeMdp}
                    className={mdp && 'active-para'}
                >
                    <h3>Mot de passe</h3>
                </div>
                <div
                    onClick={activeUser}
                    className={user && 'active-para'}
                >
                    <h3>Les utilisateur</h3>
                </div>
                {estAdmin &&
                    <div
                        onClick={activeNewUser}
                        className={newUser && 'active-para'}
                    >
                        <h3>Nouveau utilisateur</h3>
                    </div>
                }
                {estAdmin &&
                    <div
                        id="avance"
                    >
                        <div
                            className={avance && 'active-para'}
                            id='avance-title'
                            onClick={activeAvance}
                        >
                            <h3>Avancé</h3>
                        </div>
                        <div className='avance-detail'
                            ref={avanceRef}
                        >
                            <div
                                onClick={activeSauve}
                                className={sauvegarde && 'active-para'}
                            >
                                Sauvegarde la base de données
                            </div>
                            <div
                                id='suppCompte'
                                onClick={activeSupp}
                                className={supprimerCompte && 'active-para'}
                            >
                                Supprimer votre compte
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="detail-parametre">
                {info &&
                    <Information />
                }
                {mail &&
                    <Mail />
                }
                {mdp &&
                    <Mdp />
                }
                {user &&
                    <Utilisateur />
                }
                {newUser &&
                    <Ajout_util />
                }
                {sauvegarde &&
                    <Sauvegarde />
                }
                {supprimerCompte &&
                    <Supprime_compte />
                }
            </div>
        </div>
    )
}
