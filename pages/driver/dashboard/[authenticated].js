import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
    const router = useRouter();
    const { authenticated } = router.query;
    const [authenticatedState, setAuthenticatedState] = useState(false)

    const [routeNumber, setRouteNumber] = useState(undefined)
    const [excelFile, setExcelFile] = useState(undefined)

    const handleFileChange = (event) => {
        setExcelFile(event.target.files[0]);
    };

    useEffect(() => {
        if (authenticated !== 'QZwUunx3YmOM1xtsup8K') {
            router.push('/driver')
        } else {
            setAuthenticatedState(true)
        }
    }, [authenticated])


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("routeNumber", routeNumber);
        formdata.append("excelFile", excelFile);

        try {
            const res = axios.post('/api/handle_driver', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            alert("File uploaded successfully")
        } catch (e) {
            console.log(e)
        }


    }

    const logout = () => {
        router.push('/driver')
    }


    if (!authenticatedState) {

        return (
            <div>dashboard</div>
        )
    }

    return (
        <>
            <Head>
                <title>Driver Portal</title>
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
                        Welcome to the Driver&apos;s portal
                    </span>

                    <span className='mt-2 text-lg text-gray-700 ml-2'>
                        A simple portal to upload your excel sheet for your routes.
                    </span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-y-2 mt-10'>
                        <label className='text-xl'>
                            Route Number *
                        </label>

                        <input className="lg:w-1/2 h-12 px-4 mb-2 text-lg text-gray-700 placeholder-gray-600 border border-gray-700 rounded-lg focus:shadow-outline bg-transparent" type="text" placeholder="Route Number"
                            onChange={(e) => setRouteNumber(e.target.value)} />
                    </div>

                    <div className='flex flex-col gap-y-2 mt-5'>
                        <label className='text-xl'>
                            Excel File *
                        </label>
                        <div className="flex">
                            <div className="w-full lg:w-1/2 ">
                                <input
                                    className="relative h-12  m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 dark:border-neutral-600 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 dark:file:bg-neutral-700 file:px-3 file:py-[0.7rem] file:text-neutral-700 dark:file:text-neutral-100 file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
                                    type="file"
                                    id="formFile"
                                    onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-2 mt-5 lg:w-1/2'>
                        <button className='bg-gray-700 text-white px-4 py-2 rounded-lg'
                            type='submit' >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
