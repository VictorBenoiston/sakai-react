/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/layout/context/authcontext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const [loading, setLoading] = useState(false);

    const { loginAuth } = useAuth();

    const toast = useRef<Toast | null>(null);

    useEffect(() => {
        localStorage.clear()
    }, [])


    const handleLogin = async () => {
        const request: any = {
            email: email,
            password: password
        }

        setLoading(true);

        try {
            const result = await loginAuth(request)

            if (!result.accessToken) {
                setLoginError('Please, provide valid e-mail and password');
                throw new Error(`Request Error: ${result.statusText}`);
            }

            router.push('/')
        } catch (error) {
            if (!request.email || !request.password) {
                setLoginError('Please, provide valid e-mail and password');
            } else { setLoginError('Invalid E-mail or Password') }
        } finally {
            setLoading(false)
        }
    }

    const checkEnter = (e: React.KeyboardEvent) => {
        e.key === 'Enter' ? handleLogin() : ''
    }

    const [passwordInputType, setPasswordInputType] = useState('password')


    const togglePasswordVisibility = () => {
        setPasswordInputType(passwordInputType === 'password' ? 'text' : 'password');
    };



    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const [loginError, setLoginError] = useState('')

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/flair_logo_white.png`} alt="Flair Logo" className="mb-5 w-10rem flex-shrink-0" />
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)' }}>
                        <div className="text-center mb-5">
                            <small>Specialty Medication Reimbursement Made Easier</small>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email" onChange={(e: any) => setEmail(e.target.value)} type="text" style={{ width: '100%' }} className={`w-full ${loginError.length && 'p-invalid'}`} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mt-4 mb-2">
                                Password
                            </label>
                            <div className='mb-5' style={{position: 'relative'}}>
                                <InputText onKeyDown={(e) => checkEnter(e)} id="password1" onChange={(e: any) => setPassword(e.target.value)} type={`${passwordInputType}`} style={{ width: '100%' }} className={`w-full ${loginError.length && 'p-invalid'}`} />
                                <i
                                    className={`pi ${passwordInputType === 'password' ? 'pi-eye-slash' : 'pi-eye'}`}
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        top: '24px',
                                        right: '20px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                />
                                {loginError.length ?
                                    <small id="nome" className='flex mt-2 align-items-center' style={{ color: "red" }}>
                                        {<i className="pi pi-fw pi-exclamation-circle"></i>}
                                        {loginError}
                                    </small> : ''}
                            </div>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                {/* <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div> */}
                                <a onClick={(e) => {
                                    toast.current?.show({ severity: 'info', summary: 'Not implemented yet!', detail: 'This funcitonality is yet to be implemented' });
                                }} className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin}></Button>
                        </div>
                    </div>
                </div>


                <div className='h-5rem w-full flex justify-content-between' style={{ position: 'fixed', bottom: 0, borderTop: '1px solid black' }}>
                    <div className='h-full flex align-items-center ml-6'>
                        <i className='mr-1 pi pi-file' />
                        <strong>Privacy Policy</strong>
                    </div>
                    <div className='h-full flex align-items-center'>
                        <i className='mr-1 pi pi-file-pdf' />
                        <strong>Terms of Service</strong>
                    </div>
                    <div className='h-full flex align-items-center mr-6'>
                        <img className='h-2rem w-2rem' src='/layout/images/hippa-logo.png'></img>
                        <strong>HIPAA Compliant</strong>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default LoginPage;
