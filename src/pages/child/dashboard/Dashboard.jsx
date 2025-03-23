import './Dashboard.css';
import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Calendrier from '../../../components/calendrier/Calendrier';
// import { LineChart } from '@mui/x-charts/LineChart';
import { path } from '../../../utils/api';


import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import validateAxios from '../../../validateAxios';




export function Dashboard() {
    useEffect(() => {
        document.title = 'Tableau de bord';
        nombreCourriers();
        nombreCourriersMois();
        nombreUtilisateurs();
        courriersRegroupes();
    }, []);


    const tab = () => {
        var conge = document.querySelectorAll("main .analyse .emp-conge svg circle")[0];
        var total = document.querySelectorAll("main .analyse .sales svg circle")[0];
        var trav = document.querySelectorAll("main .analyse .emp-trav svg circle")[0];

        let i = -224;
        const val = setInterval(() => {
            total.style.strokeDashoffset = i;
            conge.style.strokeDashoffset = i;
            trav.style.strokeDashoffset = i;
            i++;
            if (i == -13) {
                clearInterval(val);
            }
        }, 10);
    };





    useEffect(() => {
        if (nbrUtil && courrierMois) {
            tab();
        }
    })



    const colorDark = getComputedStyle(document.documentElement).getPropertyValue('--color-dark-variant').trim();
    const colorLine = getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim();

    const token = sessionStorage.getItem('token');
    const istoken = () => {
        if (!token) {
            console.error('Token non trouvé');
            return;
        }
    }

    const [totalCourrier, setTotalCourrier] = useState(0)
    const [courrierMois, setCourrierMois] = useState(0)
    const [nbrUtil, setNbrUtil] = useState(1)
    const nombreCourriers = async () => {
        try {
            istoken();
            const response = await validateAxios.get(`${path}/api/courriers/nombre`);
            setTotalCourrier(response.data.total);
        } catch (err) {
            console.error('Erreur lors de la récupération du nombre de courriers', err);
        }
    };
    const nombreCourriersMois = async () => {
        try {
            istoken();
            const response = await validateAxios.get(`${path}/api/courriers/nombre_mois_recent`);
            setCourrierMois(response.data.total);
        } catch (err) {
            console.error('Erreur lors de la récupération du nombre de courriers', err);
        }
    };

    const nombreUtilisateurs = async () => {
        try {
            istoken();

            const response = await validateAxios.get(`${path}/api/utilisateurs/nombre`);
            setNbrUtil(response.data.total);
        } catch (err) {
            console.error('Erreur lors de la récupération du nombre d\'utilisateurs', err);
        }
    };


    const [courriersParDate, setCourriersParDate] = useState([]);

    const courriersRegroupes = async () => {
        try {
            istoken();

            const response = await validateAxios.get(`${path}/api/courriers/regroupes_par_date`);

            getValuesForLastTenDays(getDixJours(), response.data);

            setCourriersParDate(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des courriers regroupés par date', err);
        }
    };

    const data = [
        { name: '22 sept', value: 0 },
        { name: '23 sept', value: 2 },
        { name: '24 sept', value: 5 },
        { name: '25 sept', value: 3 },
        { name: '26 sept', value: 1 },
        { name: '27 sept', value: 4 },
        { name: '28 sept', value: 0 },
    ];
    const [courriers, setCourriers] = useState([]);

    const getDixJours = () => {
        const today = new Date();
        const lastTenDays = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayString = dayjs(date).format('D MMM').toLowerCase();
            lastTenDays.push(dayString);
        }
        console.log(lastTenDays)
        return lastTenDays.reverse();
    };

    const getValuesForLastTenDays = (lastTenDays, tab) => {
        const values = lastTenDays.map(day => {
            const found = tab.find(item => dayjs(item._id).format('D MMM').toLowerCase() === day);
            return {
                name: day,
                value: found ? found.count : 0
            };
        });
        setCourriers(values);
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            <main>
                <h1>Tableau de bord</h1>
                <div className="analyse">
                    <div className="sales">
                        <div className="status">
                            <div className="info">
                                <h3>Total de courriers</h3>
                                <h1>{totalCourrier}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>{totalCourrier}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="emp-trav">
                        <div className="status">
                            <div className="info">
                                <h3>Courrier du mois</h3>
                                <h1>{courrierMois}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>{courrierMois}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="emp-conge">
                        <div className="status">
                            <div className="info">
                                <h3>Nombre des utilisateurs</h3>
                                <h1>{nbrUtil}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>{nbrUtil}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className='basdash'>
                <div className='calendar'>
                    <Calendrier className='calendar1' />
                </div>
                <div className="chart">
                    <h3>Courrier du semaine</h3>
                    <ResponsiveContainer className="chart-child">
                        <LineChart data={courriers}>
                            <XAxis
                                dataKey="name"
                                stroke={colorDark}
                                tick={{ fill: colorDark }}
                            />
                            <YAxis
                                stroke={colorDark}
                                tick={{ fill: colorDark }}
                            />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={colorLine} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    )
}