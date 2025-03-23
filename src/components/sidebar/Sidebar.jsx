import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';


const nav = [
    {
        name: 'Tableau',
        path: 'dashboard',
        key: 'tableaudebord',
        icon: <DashboardSharpIcon />
    },
    {
        name: 'Couriers',
        path: 'courrier',
        key: 'courrier',
        icon: <EmailRoundedIcon />
    },
    {
        name: 'Rapport',
        path: 'rapport',
        key: 'rapport',
        icon: <BookmarkRoundedIcon />
    }
]


export function Sidebar() {



    useEffect(() => {
        const sideMenu = document.querySelector('aside');
        const sideBar = document.querySelector('.sidebar');
        const menuBtn = document.getElementById('menu-btn');
        const closeBtn = document.getElementById('close-btn');

        const handleMenuBtnClick = () => {
            sideMenu.style.left = '0';
            sideBar.style.left = '0';
        };

        const handleCloseBtnClick = () => {
            sideMenu.style.left = '-100%';
            sideBar.style.left = '-100%';
        };

        const handleWindowResize = () => {
            if (window.innerWidth < 768) {
                menuBtn.addEventListener('click', handleMenuBtnClick);
                closeBtn.addEventListener('click', handleCloseBtnClick);
            } else {
                handleMenuBtnClick();
            }
        };
        handleWindowResize();

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [window.innerWidth]);
    return (
        <aside>
            <div className="toggle">
                <div className="close" id="close-btn" >
                    <CloseRoundedIcon fontSize='large' />
                </div>
            </div>

            <div className="sidebar">
                {nav.map((item) => (
                    <NavLink to={item.path} key={item.key} className="a">
                        <span>{item.icon}</span>
                        <h3>{item.name}</h3>
                    </NavLink>
                ))}
            </div>


        </aside>
    )

}