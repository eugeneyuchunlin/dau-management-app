import React, { useState, useEffect } from 'react';
import Nvbar from './components/nvbar.js'
import JobList from './components/JobList.js';
import { LoginProvider } from './contexts/LoginContext';




export default function JobsPage() {


    return (
        <>
            <LoginProvider>
                <Nvbar />
                {/* <div className='maincontainer'> */}
                    <JobList />
                {/* </div> */}
            </LoginProvider>

        </>
    )

}
