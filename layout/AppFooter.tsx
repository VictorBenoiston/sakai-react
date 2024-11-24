/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <div>
                <img src={`/layout/images/flair_logo_rotational.png`} alt="Logo" height="20" className="mr-2" />
                <span className="font-medium ml-2">© 2024 Flair Health. All rights Reserved.</span>
            </div>
            <div className='flex'>
                <div className='mr-3'>
                    <strong>Privacy Policy</strong>
                </div>
                <div className='mr-3'>
                    <strong>Terms of Service</strong>
                </div>
                <div>
                    <strong>contact Us</strong>
                </div>
            </div>

        </div>
    );
};

export default AppFooter;
