import React, { useEffect } from 'react'
import { Navbar } from '../../components/navbar/Navbar'
import { Sidebar } from '../../components/sidebar/Sidebar'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Login } from '../login/Login';

export default function Principal() {
    

    return (
        <>
            <Sidebar />
            <Navbar />
            <Outlet />
        </>

    )
}

