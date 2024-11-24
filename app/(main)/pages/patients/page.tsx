'use client'
import Loading from '@/app/(full-page)/auth/login/Loading';
import { IPatient } from '@/app/models/Patient';
import { useAuth } from '@/layout/context/authcontext';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Menu } from 'primereact/menu';
import { useEffect, useRef, useState } from 'react';
import { emptyPatient, genderOptions, hasInsuranceOptions } from './create/page';

import './style.scss'
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';


const Lancamentos = () => {
    const { authenticatedAuth } = useAuth()
    const isAuth = authenticatedAuth()

    const toast = useRef<Toast | null>(null);

    const menuActions = useRef<any>(null);

    const [currentPatient, setCurrentPatient] = useState<IPatient>(emptyPatient);

    const [patients, setPatients] = useState<IPatient[]>([]);

    const [modalDeletePatient, setModalDeletePatient] = useState(false);

    const [modalUpdatePatient, setModalUpdatePatient] = useState(false);

    const [modalPatientProfile, setModalPatientProfile] = useState(false);

    async function fetchPatients(): Promise<IPatient[] | Error> {
        let data = null;

        try {
            const centrosDeCusto = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/patients`);
            if (!centrosDeCusto.ok) {
                throw new Error('Network response was not ok');
            }
            data = await centrosDeCusto.json();
            setPatients(data)
            data = await centrosDeCusto.json();
        } catch (error) {
            return Error('Error while selecting input');
        }

        console.log(data)
        return data
    }

    useEffect(() => {
        fetchPatients()
    }, [])

    const router = useRouter();

    const navigateToCreatePatient = () => {
        router.push('/pages/patients/create')
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const updateCurentPatient = async (currentPatient: IPatient) => {
        const { id, updated_at, created_at, ...updatedPatient } = currentPatient
        const finalPatient = { ...updatedPatient, birthdate: formatDate(String(currentPatient.birthdate)) }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/patients/${currentPatient.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalPatient)
            });
            if (!response.ok) {
                toast.current?.show({ severity: 'error', summary: 'Error!', detail: 'A server side error has occurred! Try again later' });
                return new Error(`Request error: ${response.statusText}`);
            }
            setModalUpdatePatient(false);
            toast.current?.show({ severity: 'success', summary: 'Success!', detail: 'The patient has been successfully updated!' });
            fetchPatients()
        } catch (error) {
            console.error('Erro:', error);
            toast.current?.show({ severity: 'error', summary: 'Error!', detail: 'A server side error has occurred! Try again later' });
        };
    }

    const deleteCurrentPatient = async (currentRowDataActions: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/patients/${currentRowDataActions.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                toast.current?.show({ severity: 'error', summary: 'Error!', detail: 'A server side error has occurred! Try again later' });
                return new Error(`Erro na requisição: ${response.statusText}`);
            }
            setModalDeletePatient(false);
            toast.current?.show({ severity: 'success', summary: 'Excluído com Sucesso!', detail: 'The patient has been successfully deleted' });
            fetchPatients()
        } catch (error) {
            console.error('Erro:', error);
            toast.current?.show({ severity: 'error', summary: 'Error Message', detail: 'A server side error has occurred! Try again later' });
        };
    }

    const footerDeletePatientDialog = (
        <div>
            <Button label="Cancel" text onClick={(e: any) => setModalDeletePatient(false)} autoFocus />
            <Button label="Delete" severity='danger' icon="pi pi-times" onClick={(e: any) => deleteCurrentPatient(currentPatient)} />
        </div>
    );

    const footerUpdatePatient = (
        <div>
            <Button label="Cancel" text onClick={(e: any) => setModalUpdatePatient(false)} autoFocus />
            <Button label="Update" severity='success' icon="pi pi-sync" onClick={(e: any) => updateCurentPatient(currentPatient)} />
        </div>
    );

    const tableActions = [
        {
            label: 'Update',
            icon: 'pi pi-pencil',
            command: () => {
                if (typeof window !== 'undefined') {
                    setModalUpdatePatient(true)
                }
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                if (typeof window !== 'undefined') {
                    setModalDeletePatient(true)
                }
            }
        },
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
                if (typeof window !== 'undefined') {
                    setModalPatientProfile(true)
                }
            }
        }
    ];

    const actionsBodyTemplate = (rowData: IPatient) => {
        return (
            <div className='flex align-items-center flex-row justify-content-center gap-2'>
                <Button icon="pi pi-ellipsis-h" text className="p-button-rounded buttonSmall" onClick={(event: any) => { menuActions?.current.toggle(event), setCurrentPatient(rowData) }} />
                <Menu model={tableActions} ref={menuActions} popup id="popup_menu_right" popupAlignment="right" />
            </div>
        );
    };

    const getSeverity = (rowData: any): 'success' | 'danger' => {
        return rowData.has_insurance ? 'success' : 'danger'
    };


    const statusBodyTemplate = (rowData: IPatient) => {
        return <Tag style={{ width: '100%', height: '100%', borderRadius: '0px', fontSize: '14px' }} value={rowData.has_insurance ? 'Yes' : 'No'} severity={getSeverity(rowData)} />;
    };

    const insuranceBodyTemplate = (rowData: IPatient) => {
        return <div>
            {!rowData.insurance_carrier ? 'N/A' : rowData.insurance_carrier}
        </div>
    }

    const birthDateBodyTemplate = (rowData: IPatient) => {
        return <div>
            {new Date(rowData.birthdate ? rowData.birthdate : '').toDateString()}
        </div>
    }

    const createdAtDateBodyTemplate = (rowData: IPatient) => {
        return <div>
            {new Date(rowData.created_at ? rowData.created_at : '').toDateString()}
        </div>
    }

    const currentUser = localStorage.getItem('user')
    return (
        <>
            {isAuth ? (
                <div className=''>
                    <div className="grid">
                        <div className='card mt-2 w-full h-full' style={{ padding: '1rem' }}>
                            <div>
                                <h2>Registered Patients:</h2>
                            </div>
                            <DataTable sortField="full_name" header={<div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={navigateToCreatePatient} icon='pi pi-plus' label='Create Patient'></Button>
                            </div>} value={patients} sortOrder={1} stripedRows paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50, 100]} tableStyle={{ minWidth: '50rem' }}>
                                <Column field="full_name" header="Full Name" sortable style={{ width: '10%' }}></Column>
                                <Column field="birthdate" body={birthDateBodyTemplate} header="Birth Date" sortable style={{ width: '8%' }}></Column>
                                <Column field="ssn" header="SSN" sortable style={{ width: '6%' }}></Column>
                                <Column field="contact_number" header="Phone Number" sortable style={{ width: '6%' }}></Column>
                                <Column field="email" header="E-mail" sortable style={{ width: '8%' }}></Column>
                                <Column field="medical_history" header="Medical History" sortable style={{ width: '10%' }}></Column>
                                <Column field="address" header="Address" sortable style={{ width: '6%' }}></Column>
                                <Column field="gender" header="Gender" style={{ width: '2%', textAlign: 'center' }}></Column>
                                <Column field="has_insurance" body={statusBodyTemplate} header="Has Insurance" style={{ width: '2%', textAlign: 'center' }}></Column>
                                <Column field="insurance_carrier" body={insuranceBodyTemplate} header="Insurance Carrier" style={{ width: '2%', textAlign: 'center' }}></Column>
                                <Column field="created_at" body={createdAtDateBodyTemplate} header="Created At" style={{ width: '2%', textAlign: 'center' }}></Column>
                                <Column header="Actions" body={actionsBodyTemplate} style={{ width: '2%', textAlign: 'center' }}></Column>
                            </DataTable>

                            <Dialog header="Do you really intend to delete the current patient?" visible={modalDeletePatient} style={{ width: '50vw' }} onHide={() => { if (!modalDeletePatient) return; setModalDeletePatient(false); }} footer={footerDeletePatientDialog}>
                                <p className="m-0">
                                    This action will delete the current patient.
                                </p>
                            </Dialog>

                            <Dialog header="Update Patient" visible={modalUpdatePatient} style={{ width: '66vw' }} onHide={() => { if (!modalUpdatePatient) return; setModalUpdatePatient(false); }} footer={footerUpdatePatient}>
                                <div className='grid mt-4 gap-4'>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText required className='w-full' id="nome" value={currentPatient.full_name} onChange={(e) => setCurrentPatient({ ...currentPatient, full_name: e.target.value })} />
                                            <label htmlFor="username">Full Name*</label>
                                        </FloatLabel>
                                    </div>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Calendar required className='w-full' id="nome" value={new Date(currentPatient.birthdate ? currentPatient.birthdate : '')} onChange={(e: any) => setCurrentPatient({ ...currentPatient, birthdate: e.value })} />
                                            <label htmlFor="username">Birth Date*</label>
                                        </FloatLabel>
                                    </div>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputMask
                                                required
                                                className='w-full'
                                                id="ssn"
                                                value={currentPatient.ssn}
                                                mask="999-99-9999"
                                                placeholder="123-45-6789"
                                                onChange={(e: any) => setCurrentPatient({ ...currentPatient, ssn: e.target.value })}
                                            />
                                            <label htmlFor="ssn">SSN*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputMask
                                                required
                                                className='w-full'
                                                id="phone"
                                                value={currentPatient.contact_number}
                                                mask="(999) 999-9999"
                                                placeholder="(123) 456-7890"
                                                onChange={(e: any) => setCurrentPatient({ ...currentPatient, contact_number: e.target.value })}
                                            />
                                            <label htmlFor="phone">Phone Number*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText required placeholder='mark@gmail.com' className='w-full' id="nome" value={currentPatient.email} onChange={(e) => setCurrentPatient({ ...currentPatient, email: e.target.value })} />
                                            <label htmlFor="username">E-mail*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputTextarea required className='w-full' id="nome" value={currentPatient.medical_history} onChange={(e) => setCurrentPatient({ ...currentPatient, medical_history: e.target.value })} />
                                            <label htmlFor="username">Medical History*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText required className='w-full' id="nome" value={currentPatient.address} onChange={(e) => setCurrentPatient({ ...currentPatient, address: e.target.value })} />
                                            <label htmlFor="username">Address*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Dropdown
                                                required
                                                options={genderOptions}
                                                className='w-full'
                                                id="gender"
                                                value={currentPatient.gender}
                                                onChange={(e) => setCurrentPatient({ ...currentPatient, gender: e.value })}
                                                placeholder="Select Gender"
                                            />
                                            <label htmlFor="gender">Gender*</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Dropdown options={hasInsuranceOptions} required className='w-full' id="nome" value={currentPatient.has_insurance} onChange={(e) => setCurrentPatient({ ...currentPatient, has_insurance: e.target.value })} />
                                            <label htmlFor="username">Has Insurance*</label>
                                        </FloatLabel>
                                    </div>
                                    {
                                        currentPatient.has_insurance &&
                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputText required className='w-full' id="nome" value={currentPatient.insurance_carrier} onChange={(e) => setCurrentPatient({ ...currentPatient, insurance_carrier: e.target.value })} />
                                                <label htmlFor="username">Insurance Carrier*</label>
                                            </FloatLabel>
                                        </div>
                                    }
                                </div>
                            </Dialog>

                            <Dialog header={`${currentPatient.full_name}'s profile`} visible={modalPatientProfile} style={{ width: '66vw' }} onHide={() => { if (!modalPatientProfile) return; setModalPatientProfile(false); }}>

                                <div className=" flex align-items-center justify-content-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Avatar
                                        label={currentUser?.charAt(0)}
                                        size="xlarge"
                                        shape="circle"
                                        style={{ backgroundColor: 'var(--primary-color)', color: '#ffffff', width: '100px', height: '100px', fontSize: '2rem' }}
                                    />
                                </div>
                                <div className='grid mt-8 gap-4'>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText disabled required className='w-full' id="nome" value={currentPatient.full_name} onChange={(e) => setCurrentPatient({ ...currentPatient, full_name: e.target.value })} />
                                            <label htmlFor="username">Full Name</label>
                                        </FloatLabel>
                                    </div>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Calendar disabled required className='w-full' id="nome" value={new Date(currentPatient.birthdate ? currentPatient.birthdate : '')} onChange={(e: any) => setCurrentPatient({ ...currentPatient, birthdate: e.value })} />
                                            <label htmlFor="username">Birth Date</label>
                                        </FloatLabel>
                                    </div>
                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputMask
                                                required
                                                disabled
                                                className='w-full'
                                                id="ssn"
                                                value={currentPatient.ssn}
                                                mask="999-99-9999"
                                                placeholder="123-45-6789"
                                                onChange={(e: any) => setCurrentPatient({ ...currentPatient, ssn: e.target.value })}
                                            />
                                            <label htmlFor="ssn">SSN</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputMask
                                                required
                                                disabled
                                                className='w-full'
                                                id="phone"
                                                value={currentPatient.contact_number}
                                                mask="(999) 999-9999"
                                                placeholder="(123) 456-7890"
                                                onChange={(e: any) => setCurrentPatient({ ...currentPatient, contact_number: e.target.value })}
                                            />
                                            <label htmlFor="phone">Phone Number</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText disabled required placeholder='mark@gmail.com' className='w-full' id="nome" value={currentPatient.email} onChange={(e) => setCurrentPatient({ ...currentPatient, email: e.target.value })} />
                                            <label htmlFor="username">E-mail</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputTextarea disabled required className='w-full' id="nome" value={currentPatient.medical_history} onChange={(e) => setCurrentPatient({ ...currentPatient, medical_history: e.target.value })} />
                                            <label htmlFor="username">Medical History</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <InputText disabled required className='w-full' id="nome" value={currentPatient.address} onChange={(e) => setCurrentPatient({ ...currentPatient, address: e.target.value })} />
                                            <label htmlFor="username">Address</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Dropdown
                                                required
                                                disabled
                                                options={genderOptions}
                                                className='w-full'
                                                id="gender"
                                                value={currentPatient.gender}
                                                onChange={(e) => setCurrentPatient({ ...currentPatient, gender: e.value })}
                                                placeholder="Select Gender"
                                            />
                                            <label htmlFor="gender">Gender</label>
                                        </FloatLabel>
                                    </div>

                                    <div className='w-full'>
                                        <FloatLabel>
                                            <Dropdown disabled options={hasInsuranceOptions} required className='w-full' id="nome" value={currentPatient.has_insurance} onChange={(e) => setCurrentPatient({ ...currentPatient, has_insurance: e.target.value })} />
                                            <label htmlFor="username">Has Insurance</label>
                                        </FloatLabel>
                                    </div>
                                    {
                                        currentPatient.has_insurance &&
                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputText disabled required className='w-full' id="nome" value={currentPatient.insurance_carrier} onChange={(e) => setCurrentPatient({ ...currentPatient, insurance_carrier: e.target.value })} />
                                                <label htmlFor="username">Insurance Carrier</label>
                                            </FloatLabel>
                                        </div>
                                    }
                                </div>
                            </Dialog>

                        </div>
                    </div>
                    <Toast ref={toast} />
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Lancamentos;
