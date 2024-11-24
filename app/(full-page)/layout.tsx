import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Flair Health',
    description: 'Flair Health is a virtual extension for medical practices, providing high-touch nutrition and health coaching services to patients with chronic conditions'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            {/* <AppConfig simple /> */}
        </React.Fragment>
    );
}
