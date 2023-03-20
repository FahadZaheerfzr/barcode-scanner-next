import React from "react";
import axios from "axios";


export default function BarcodeScanner() {
    const [data, setData] = React.useState("Not Found");
    const [excelData, setExcelData] = React.useState(undefined);
    const [foundNumber, setFoundNumber] = React.useState(undefined)
    const [found, setFound] = React.useState(false);
    const [scannedButNotinExcel, setScannedButNotinExcel] = React.useState(false);


    const [routeNumber, setRouteNumber] = React.useState(null);
    const [startScanning, setStartScanning] = React.useState(false);
    const myRef = React.useRef(null);
    React.useEffect(() => {
        const btn = document.getElementById("scanner");
        // setTest(btn);
        StrichSDK.initialize(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZTE2NjhkNi00MjRlLTQ2MWEtODkyNS0wYjAzY2NjNDA1MzUiLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cHM6Ly9wZm9yY2Uub255LXguY28udWsvIl0sImlhdCI6MTY3OTM0MDYzMCwibmJmIjoxNjc5MzQwNjMwLCJjYXBhYmlsaXRpZXMiOnsib2ZmbGluZSI6ZmFsc2UsImFuYWx5dGljc09wdE91dCI6ZmFsc2V9LCJ2ZXJzaW9uIjoxfQ.SJa-SVmwV_U-Vq91lG5y6GbiBFVnsrIYkcaEBE_9sfw"
        )
            .then(() => {
                console.log(`SDK initialized`);
                const configuration = {
                    // selector: '.barcode-reader',
                    // selector: myContainer.current,
                    selector: btn,
                    engine: {
                        symbologies: ["code128"],
                        numScanlines: 10,
                        minScanlinesNeeded: 3,
                        invertedCodes: true,
                        duplicateInterval: 750
                    },
                    frameSource: {
                        resolution: "full-hd" // full-hd is recommended for more challenging codes
                    },
                    overlay: {
                        showCameraSelector: true,
                        showFlashlight: true,
                        showDetections: true
                    },
                    feedback: {
                        audio: true,
                        vibration: true
                    }
                };
                console.log("here1");

                const barcodeReader = new BarcodeReader(configuration);
                console.log("here");
                barcodeReader
                    .initialize()
                    .then((result) => {
                        console.log(result);
                        // setDummy(result)

                        // register detection hook, run it in the Angular zone so change detection works
                        barcodeReader.detected = (detections) => {
                            //   this.ngZone.run(() => {
                            //     this.codeDetection = detections[0];
                            //   });
                            console.log(detections[0].data);

                            setData(detections[0].data);
                        };

                        // start reading codes
                        barcodeReader.start().then((r) => {
                            console.log(r);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [myRef?.current]);


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
        }, 10000);
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
                    <div className="my-container flex flex-col justify-center items-center">


                        <div className="">
                            {
                                (!scannedButNotinExcel) ? (
                                    /* <BarcodeScannerComponent
                                        width={600}
                                        height={500}
                                        onUpdate={(err, result) => {
                                            if (result) setData(result.text);
                                            else setData("Not Found");
                                        }}
                                    /> */
                                    <div
                                        ref={myRef}
                                        className="scanner"
                                        id="scanner"
                                        style={{ position: "relative", height: "240px", width: "240px" }}
                                    ></div>) : null
                            }
                        </div>

                        {/* <h1 className="text-4xl lg:text-6xl mt-[50px] mb-[30px]">{(!found && !scannedButNotinExcel) ? "Scanning..." : "Scanned !!!"}</h1>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "This might take a few seconds!" : null}</p>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "Note: Move the Camera a bit closer and focus on the barcode. Keep it still!" : null}</p> */}

                        {
                            scannedButNotinExcel && (
                                <>
                                    <h1 className="uppercase text-lg lg:text-4xl">But Could not find in the database.</h1>
                                    {/* <button onClick={scanAgain}>Scan Again</button> */}
                                </>
                            )
                        }


                        <p className="uppercase text-lg lg:text-4xl">Please place the barcode in camera view</p>
                        <p className="uppercase text-base lg:text-4xl">Please keep the camera still and focus on the barcode</p>
                        <p className="uppercase text-base lg:text-4xl font-bold">Drop Number:</p>
                        <p className="uppercase text-3xl lg:text-4xl font-bold">{found ? foundNumber["STOP NUMBER"] : "XX"}</p>
                    </div>
            }
        </React.Fragment>
    )
}
