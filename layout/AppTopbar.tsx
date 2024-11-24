/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Avatar } from 'primereact/avatar';
import { useAuth } from './context/authcontext';
import { useRouter } from 'next/navigation';
import { Menu } from 'primereact/menu';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { logout } = useAuth();
    const routes = useRouter();
    const menuRight = useRef<any>(null);



    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const logOut = () => {
        logout()
        localStorage.clear()
        routes.push('/auth/login')
    }

    const menuOptions = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        logOut()
                    }
                },
            ]
        }
    ];

    const currentUser = localStorage.getItem('user')

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/flair_logo_white.png`} width="full" height={'45px'} alt="logo" />
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className='h-full flex justify-content-center align-items-center'>
                </div>
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button> */}
                <div className='flex align-items-center mr-2'>
                    <span> Welcome, {currentUser}</span>
                </div>
                <div onClick={(event: any) => menuRight?.current.toggle(event)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <Avatar label={currentUser?.charAt(0)} size="large" shape="circle" style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff' }} />
                </div>

                <Menu model={menuOptions} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />

            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
