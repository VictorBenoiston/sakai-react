'use client'
import Loading from '@/app/(full-page)/auth/login/Loading';
import { IPatient } from '@/app/models/Patient';
import { useAuth } from '@/layout/context/authcontext';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export const emptyPatient: IPatient = {
    id: '',
    full_name: '',
    birthdate: null,
    ssn: '',
    contact_number: '',
    email: '',
    medical_history: '',
    address: '',
    gender: '',
    has_insurance: null,
    user_id: null,
}

export const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' }
];

export const hasInsuranceOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];


const Patients = () => {

    const router = useRouter();

    const navigateToPatientDashboard = () => {
        router.push('/pages/patients')
    }

    const [fullNameError, setFullNameError] = useState('');
    const [birthdateError, setBirthdateError] = useState('');
    const [ssnError, setSsnError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [medicalHistoryError, setMedicalHistoryError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [hasInsuranceError, setHasInsuranceError] = useState('');

    const validatePatientForm = (updatedForm: IPatient): boolean => {
        let isValid = true;

        if (!updatedForm.full_name) {
            setFullNameError('Full Name is required');
            isValid = false;
        } else {
            setFullNameError('');
        }
        if (!updatedForm.birthdate) {
            setBirthdateError('Birthdate is required');
            isValid = false;
        } else {
            setBirthdateError('');
        }
        if (!updatedForm.ssn) {
            setSsnError('SSN is required');
            isValid = false;
        } else {
            setSsnError('');
        }
        if (!updatedForm.contact_number) {
            setContactNumberError('Contact Number is required');
            isValid = false;
        } else {
            setContactNumberError('');
        }
        if (!updatedForm.email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }
        if (!updatedForm.medical_history) {
            setMedicalHistoryError('Medical History is required');
            isValid = false;
        } else {
            setMedicalHistoryError('');
        }
        if (!updatedForm.address) {
            setAddressError('Address is required');
            isValid = false;
        } else {
            setAddressError('');
        }
        if (!updatedForm.gender) {
            setGenderError('Gender is required');
            isValid = false;
        } else {
            setGenderError('');
        }
        if (updatedForm.has_insurance === null) {
            setHasInsuranceError('Has Insurance is required');
            isValid = false;
        } else {
            setHasInsuranceError('');
        }

        return isValid;
    };

    const { authenticatedAuth } = useAuth();
    const isAuth = authenticatedAuth();

    const toast = useRef<Toast | null>(null);


    const [patient, setPatient] = useState(emptyPatient)


    const handleSubmit = async (event: any) => {
        event.preventDefault()

        console.log('as: ', validatePatientForm(patient))

        if (!validatePatientForm(patient)) {
            return
        }


        const updatedPatient = {
            ...patient,
            user_id: String(localStorage.getItem('uid'))
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPatient)
            });
            if (!response.ok) {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Operação falhou. Erro de servidor' });
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            toast.current?.show({ severity: 'success', summary: 'Success!', detail: 'The patient has been successfully created!' });

        } catch (error) {
            console.error('Erro:', error);
            toast.current?.show({ severity: 'error', summary: 'Error!', detail: 'An error has occurred! Try again later' });
        };

        setPatient(emptyPatient)
    }


    return (
        <>
            {isAuth ? (
                <div className="" >
                    <div className='card'>
                        <div className='grid'>
                            <div className='col-12 md:col-12 lg:col-12 xl:col-12 sm:col-12 md:col-12 flex justify-content-between'>
                                <h2>Create Patient</h2>
                                <Button label='Back to Patients' icon='pi pi-chevron-left' type='button' onClick={() => navigateToPatientDashboard()} />
                            </div>
                            <Divider className='mb-6' />
                            <div className=''>
                                <form>
                                    <div className='grid gap-4 ml-1'>

                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputText required className={`w-full ${fullNameError && 'p-invalid'}`} id="nome" value={patient.full_name} onChange={(e) => setPatient({ ...patient, full_name: e.target.value })} />
                                                <label htmlFor="username">Full Name*</label>
                                            </FloatLabel>
                                        </div>
                                        <div className='w-full'>
                                            <FloatLabel>
                                                <Calendar required className={`w-full ${birthdateError && 'p-invalid'}`} id="nome" value={patient.birthdate} onChange={(e: any) => setPatient({ ...patient, birthdate: e.value })} />
                                                <label htmlFor="username">Birth Date*</label>
                                            </FloatLabel>
                                        </div>
                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputMask
                                                    required
                                                    className={`w-full ${ssnError && 'p-invalid'}`}
                                                    id="ssn"
                                                    value={patient.ssn}
                                                    mask="999-99-9999"
                                                    placeholder="123-45-6789"
                                                    onChange={(e: any) => setPatient({ ...patient, ssn: e.target.value })}
                                                />
                                                <label htmlFor="ssn">SSN*</label>
                                            </FloatLabel>
                                        </div>

                                        <div className={`w-full ${contactNumberError && 'p-invalid'}`}>
                                            <FloatLabel>
                                                <InputMask
                                                    required
                                                    className={`w-full ${contactNumberError && 'p-invalid'}`}
                                                    id="phone"
                                                    value={patient.contact_number}
                                                    mask="(999) 999-9999"
                                                    placeholder="(123) 456-7890"
                                                    onChange={(e: any) => setPatient({ ...patient, contact_number: e.target.value })}
                                                />
                                                <label htmlFor="phone">Phone Number*</label>
                                            </FloatLabel>
                                        </div>

                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputText required placeholder='mark@gmail.com' className={`w-full ${emailError && 'p-invalid'}`} id="nome" value={patient.email} onChange={(e) => setPatient({ ...patient, email: e.target.value })} />
                                                <label htmlFor="username">E-mail*</label>
                                            </FloatLabel>
                                        </div>

                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputTextarea required className={`w-full ${medicalHistoryError && 'p-invalid'}`} id="nome" value={patient.medical_history} onChange={(e) => setPatient({ ...patient, medical_history: e.target.value })} />
                                                <label htmlFor="username">Medical History*</label>
                                            </FloatLabel>
                                        </div>

                                        <div className='w-full'>
                                            <FloatLabel>
                                                <InputText required className={`w-full ${addressError && 'p-invalid'}`} id="nome" value={patient.address} onChange={(e) => setPatient({ ...patient, address: e.target.value })} />
                                                <label htmlFor="username">Address*</label>
                                            </FloatLabel>
                                        </div>

                                        <div className='w-full'>
                                            <FloatLabel>
                                                <Dropdown
                                                    required
                                                    options={genderOptions}
                                                    className={`w-full ${genderError && 'p-invalid'}`}
                                                    id="gender"
                                                    value={patient.gender}
                                                    onChange={(e) => setPatient({ ...patient, gender: e.value })}
                                                    placeholder="Select Gender"
                                                />
                                                <label htmlFor="gender">Gender*</label>
                                            </FloatLabel>
                                        </div>
                                        <div className='w-full'>
                                            <FloatLabel>
                                                <Dropdown options={hasInsuranceOptions} required className={`w-full ${hasInsuranceError && 'p-invalid'}`} id="nome" value={patient.has_insurance} onChange={(e) => setPatient({ ...patient, has_insurance: e.value })} />
                                                <label htmlFor="username">Has Insurance*</label>
                                            </FloatLabel>
                                        </div>
                                        {
                                            patient.has_insurance &&
                                            <div className='w-full'>
                                                <FloatLabel>
                                                    <InputText required className='w-full' id="nome" value={patient.insurance_carrier} onChange={(e) => setPatient({ ...patient, insurance_carrier: e.target.value })} />
                                                    <label htmlFor="username">Insurance Carrier*</label>
                                                </FloatLabel>
                                            </div>
                                        }
                                        <div className='col-12 md:col-12 lg:col-12 xl:col-12 sm:col-12'>
                                            <Button label="Create" className='w-full' onClick={handleSubmit} type='submit' />
                                        </div>


                                    </div>
                                </form>
                            </div>
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

export default Patients;





// {
//     "created_at": "2024-11-24T00:09:04.490Z",
//     "address": "asdasd",
//     "contact_number": "(124) 124-1241",
//     "full_name": "Roberto",
//     "email": "2wasd@gmail.com",
//     "gender": "other",
//     "ssn": "234-12-4124",
//     "updated_at": "2024-11-24T00:09:04.490Z",
//     "user_id": "16a6d862-0ad0-4beb-9d33-906a9dab44b8",
//     "birthdate": "2024-11-13T03:00:00.000Z",
//     "has_insurance": true,
//     "insurance_carrier": "flair",
//     "medical_history": "asdasd",
//     "id": "3430b011-0a6d-44de-9a8e-ca59d33fbe57"
// }
