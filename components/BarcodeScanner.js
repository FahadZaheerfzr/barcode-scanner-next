import React from "react";
import axios from "axios";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import StrichBarcodeScanner from "./StrichScanner";


export default function BarcodeScanner() {
    const [data, setData] = React.useState("Not Found");
    const [excelData, setExcelData] = React.useState(undefined);
    const [foundNumber, setFoundNumber] = React.useState(undefined)
    const [found, setFound] = React.useState(false);
    const [scannedButNotinExcel, setScannedButNotinExcel] = React.useState(false);


    const [routeNumber, setRouteNumber] = React.useState(null);
    const [startScanning, setStartScanning] = React.useState(false);



    const getExcelData = async () => {
        try {
            const res = await axios.post("/api/read_excel", {
                routeNumber: routeNumber
            });
            const json = await res.data;
            console.log(json);
            setExcelData(json)
            setStartScanning(true);
        } catch (e) {
            alert("No file for such route number");
            console.log(e)
        }

    }

    React.useEffect(() => {
        console.log(data)
        if (excelData !== undefined && data !== undefined && data !== "Not Found") {
            let FoundInExcel = false;
            for (let i = 0; i < excelData.length; i++) {
                const element = excelData[i];
                console.log(data)
                console.log(element["CONSIGNMENT NUMBER"])
                if (data.includes(element["CONSIGNMENT NUMBER"])) {
                    setFound(true);
                    setFoundNumber(element);
                    console.log(element)
                    FoundInExcel = true;
                }
            }
            if (!FoundInExcel) {
                setScannedButNotinExcel(true);
            }
        }
    }, [data])


    // console.log(foundNumber);

    const scanAgain = () => {
        setFound(false);
        setScannedButNotinExcel(false)
    }

    const OnStartScanning = (e) => {
        e.preventDefault();
        try {
            getExcelData()
        } catch (e) {
            console.log(e)
        }
    }


    // Will run after every 10 seconds scan is successful
    React.useEffect(() => {
        setTimeout(() => {
            // TODO:
            // Refresh all the useStates here
            // or call
            scanAgain()
        }, 3000);
    }, [found, scannedButNotinExcel]);


    return (
        <React.Fragment>
            {
                !startScanning ? (
                    <div className="my-container flex flex-col justify-center items-center">

                        <form onSubmit={OnStartScanning} className="flex flex-col justify-center items-center">
                            <div>
                                <label htmlFor="route_number" className="uppercase text-center block mb-2 text-sm font-medium text-gray-900 md:text-2xl lg:text-4xl mt-[20px] lg:mb-[20px]">Enter Route Number</label>
                                <input onChange={(e) => { setRouteNumber(e.target.value) }} type="text" id="route_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Route Number" required />
                            </div>
                            <button type="submit" className="uppercase bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-[30px]">
                                Start
                            </button>
                        </form>
                    </div>

                ) :
                    <div className="my-container flex flex-col">


                        <div className="mt-8">
                            {
                                <StrichBarcodeScanner setData={setData} />
                            }
                        </div>

                        {/* <h1 className="text-4xl lg:text-6xl mt-[50px] mb-[30px]">{(!found && !scannedButNotinExcel) ? "Scanning..." : "Scanned !!!"}</h1>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "This might take a few seconds!" : null}</p>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "Note: Move the Camera a bit closer and focus on the barcode. Keep it still!" : null}</p> */}

                        {
                            scannedButNotinExcel ? (
                                <>
                                    <h1 className="uppercase lg:text-4xl">But Could not find in the database.</h1>
                                    {/* <button onClick={scanAgain}>Scan Again</button> */}
                                </>
                            ) :


                                <div className="mt-5">
                                    <p className="uppercase text-base lg:text-4xl font-bold">Drop Number:</p>
                                    <p className="uppercase text-3xl lg:text-4xl font-bold">{foundNumber ? foundNumber["STOP NUMBER"] : "XX"}</p>
                                </div>
                        }
                    </div>
            }
        </React.Fragment>
    )
}
