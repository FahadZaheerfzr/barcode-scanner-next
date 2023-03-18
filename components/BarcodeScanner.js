import BarcodeScannerComponent from "react-qr-barcode-scanner";
import React from "react";


export default function BarcodeScanner() {
    const [data, setData] = React.useState("Not Found");
    const [excelData, setExcelData] = React.useState(undefined);
    const [foundNumber, setFoundNumber] = React.useState(undefined)
    const [found, setFound] = React.useState(false);
    const [scannedButNotinExcel, setScannedButNotinExcel] = React.useState(false);


    const getExcelData = async () => {
        const res = await fetch("/api/read_excel");
        const json = await res.json();
        console.log(json);
        setExcelData(json)
    }

    React.useEffect(() => {
        getExcelData()
    }, []);

    React.useEffect(() => {
        if (excelData !== undefined && data !== undefined && data !== "Not Found") {
            let FoundInExcel = false;
            for (let i = 0; i < excelData.length; i++) {
                const element = excelData[i];
                console.log(data)
                console.log(element["CONSIGNMENT NUMBER"])
                if (data.includes(element["CONSIGNMENT NUMBER"])) {
                    setFound(true);
                    setFoundNumber(element["STOP NUMBER"]);
                    FoundInExcel = true;
                }
            }
            if (!FoundInExcel) {
                setScannedButNotinExcel(true);
            }
        }
    }, [data])

    const scanAgain = () => {
        setFound(false);
        setScannedButNotinExcel(false)
    }
    // console.log(foundNumber);


    return (
        <div className="my-container">
            <div className="">
                {
                    (!found && !scannedButNotinExcel) ? (
                        <BarcodeScannerComponent
                            width={600}
                            height={500}
                            onUpdate={(err, result) => {
                                if (result) setData(result.text);
                                else setData("Not Found");
                            }}
                        />
                    ) : null
                }
            </div>

            <h1 className="text-4xl lg:text-6xl mt-[50px] mb-[30px]">{(!found && !scannedButNotinExcel) ? "Scanning..." : "Scanned !!!"}</h1>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "This might take a few seconds!" : null}</p>
            <p className="text-2xl lg:text-4xl">{(!found && !scannedButNotinExcel) ? "Note: Move the Camera a bit closer and focus on the barcode. Keep it still!" : null}</p>

            {
                scannedButNotinExcel && (
                    <>
                        <h1>But Could not find in the database.</h1>
                        <button onClick={scanAgain}>Scan Again</button>
                    </>
                )
            }

            {
                found && (
                    <>
                        <p>{found ? "Here's the data you wanted" : null}</p>
                        <p>{found ? `PREFIX: ${foundNumber["PREFIX"]}` : null}</p>
                        <p>{found ? `CONSIGNMENT NUMBER: ${foundNumber["CONSIGNMENT NUMBER"]}` : null}</p>
                        <p style={{ fontSize: "65px" }}>{found ? `STOP NUMBER: ${foundNumber["STOP NUMBER"]}` : null}</p>
                        {
                            found ?
                                (
                                    <button className="bg-indigo-600 text-white py-2 px-3" onClick={scanAgain}>Scan Again</button>
                                ) : null
                        }
                    </>
                )
            }
        </div>
    )
}