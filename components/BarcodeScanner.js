import BarcodeScannerComponent from "react-qr-barcode-scanner";


export default function BarcodeScanner(setData) {
    
    return (
        <BarcodeScannerComponent
            width={600}
            height={500}
            onUpdate={(err, result) => {
                if (result) setData(result.text);
                else setData("Not Found");
            }}
        />
    )
}