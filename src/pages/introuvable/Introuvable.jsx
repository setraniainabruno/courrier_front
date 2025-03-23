import React from 'react'
import './Introuvable.css'
import { NavLink } from 'react-router-dom'

export default function Introuvable() {
    return (
        <div className='introuvableMain'>
                <img src="./404-error.png" />
                <p>Page introuvable, <NavLink to={'/dashboard'} className="redirige-dash">retour à l'acceuil</NavLink></p>
        </div>
    )
}
