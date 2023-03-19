import AdminTable from '@/components/AdminTable';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const router = useRouter();
    const { authenticated } = router.query;
    const [authenticatedState, setAuthenticatedState] = useState(false)

    useEffect(() => {
        if (authenticated !== 'umzCX1J6XeNXkqX134pOiQhlGHU5N5d0ohY9ECklpXCum5I9g4eEYk1DId8BJraX') {
            router.push('/admin')
        } else {
            setAuthenticatedState(true)
        }
    }, [authenticated])



    if (!authenticatedState) {

        return (
            <div>dashboard</div>
        )
    }

    const logout = () => {
        router.push('/admin')
    }

    return (
        <>
            <Head>
                <title>Admin Portal</title>
            </Head>


            <div className='w-screen h-screen px-10 bg-gray-100 text-gray-800'>
                <div className='flex w-full justify-end'>
                    <button className='mt-10 lg:absolute text-lg bg-gray-700 px-3 py-2 text-white rounded-lg'
                        onClick={logout}>
                        Logout
                    </button>
                </div>
                <div className='flex flex-col'>
                    <span className='text-5xl font-semibold mt-10'>
                        Welcome to the Admin&apos;s portal
                    </span>

                    <span className='mt-2 text-lg text-gray-700 ml-2'>
                        A simple portal to manage your excel sheet for your routes.
                    </span>
                </div>
                <div className='mt-8'>

                    <AdminTable />

                </div>
            </div>
        </>
    )
}
