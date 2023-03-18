import Head from "next/head";
import React from "react";
import dynamic from 'next/dynamic'


const DynamicBarcodeScanner = dynamic(
  () => import('@/components/BarcodeScanner'),
  { ssr: false }
)

export default function Index() {
 
  return (
    <React.Fragment>
      <Head>
        <title>Barcode Scanner</title>
      </Head>
     <DynamicBarcodeScanner />
    </React.Fragment>
  );
}

