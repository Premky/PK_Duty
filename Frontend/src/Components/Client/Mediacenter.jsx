import React, { Fragment } from 'react'
import np_flag from '../../assets/nepal_flag.gif';

const Mediacenter = () => {
    return (
        <>
            <div class="card" style={{ width: "18rem" }}>
                <img className="card-img-top" src={{ np_flag }} alt="Card image cap" />
                <div className="card-body">
                    <p className="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                    </p>
                </div>
            </div>
        </>
    )
}

export default Mediacenter