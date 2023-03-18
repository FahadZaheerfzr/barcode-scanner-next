import Head from "next/head";
import React from "react";
import dynamic from 'next/dynamic'


const DynamicBarcodeScanner = dynamic(
  () => import('@/components/BarcodeScanner'),
  { ssr: false }
)

export default function Index() {
  const [data, setData] = React.useState("Not Found");
  const [excelData, setExcelData] = React.useState(undefined);
  const [foundNumber, setFoundNumber] = React.useState(undefined)
  const [found, setFound] = React.useState(false);
  const [scannedButNotinExcel, setScannedButNotinExcel] = React.useState(false);


  const getExcelData = async () => {
    const res = await fetch("/api/read_excel");
    const json = await res.json();

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
    <React.Fragment>
      <Head>
        <title>Barcode Scanner</title>
      </Head>
      <div className="container">
        {
          (!found && !scannedButNotinExcel) ? (
            <DynamicBarcodeScanner setData={setData} />
            ) : null
        }

        <h1 style={{ fontSize: "70px", marginTop: "50px", marginBottom: "30px" }}>{(!found && !scannedButNotinExcel) ? "Scanning..." : "Scanned !!!"}</h1>
        <p>{(!found && !scannedButNotinExcel) ? "This might take a few seconds!" : null}</p>
        <p>{(!found && !scannedButNotinExcel) ? "Note: Move the Camera a bit closer and focus on the barcode. Keep it still!" : null}</p>

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
                    <button onClick={scanAgain}>Scan Again</button>
                  ) : null
              }
            </>
          )
        }
      </div>
    </React.Fragment>
  );
}

