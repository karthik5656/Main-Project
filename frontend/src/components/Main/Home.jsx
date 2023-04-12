import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/Home.css'

const Home = () => {
    return (
        <div>
            <div className='image'>
                <img src='./hero.gif' alt="" />
            </div>
            <div className='content'>
                <div className='details'>
                    <p>
                        Book a ride now by finding an ideal travel partner
                    </p>
                    <Link to='/search'><button>Book Now</button></Link>
                </div>
                <img src='/illustration-1.png' alt="" />
            </div>
            <div className='content'>
                <img src='/illustration-2.png' alt="" />
                <div className='details'>
                    <p>
                        Get suggestions for the best route to pick up your partner and reach the destination
                    </p>
                </div>
            </div>
            <div className='content'>
                <div className='details'>
                    <p>
                        Easy communication for ease of travel
                    </p>
                </div>
                <img src='/illustration-3.png' alt="" />
            </div>
        </div>
    )
}
export default Home;
