import React from "react";
import {
  BarcodeReader,
  CodeDetection,
  Configuration,
  SdkError,
  StrichSDK
} from "@pixelverse/strichjs-sdk";

export default function StrichBarcodeScanner(setData) {
  const myRef = React.useRef(null);
  React.useEffect(() => {
    const btn = document.getElementById("scanner");
    // setTest(btn);
    StrichSDK.initialize(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OTdiNGJiNy1jMDYxLTQ5MjYtYWNkOC0wMTg2NjUwMjM0YzQiLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwLyJdLCJpYXQiOjE2NzkzMjk1MzgsIm5iZiI6MTY3OTMyOTUzOCwiY2FwYWJpbGl0aWVzIjp7Im9mZmxpbmUiOmZhbHNlLCJhbmFseXRpY3NPcHRPdXQiOmZhbHNlfSwidmVyc2lvbiI6MX0.-aNYIJHCHI-AbpXkTPwmMP14c5fyURKCFhWpBdSXwuA"
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
              console.log(detections);
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

  return (
    <React.Fragment>
      <div
      ref={myRef}
        className="scanner"
        id="scanner"
        style={{ position: "relative", height: "240px", width: "240px" }}
      ></div>
    </React.Fragment>
  );
}

