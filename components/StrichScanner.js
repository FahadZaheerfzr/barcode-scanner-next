import React from "react";
import {
  BarcodeReader,
  CodeDetection,
  Configuration,
  SdkError,
  StrichSDK
} from "@pixelverse/strichjs-sdk";

export default function StrichBarcodeScanner({setData}) {
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
            duplicateInterval: 350
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
          },
          locator: {
            regionOfInterest: { left: 0.1, right: 0.1, top: 0.4, bottom: 0.4 }
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
              barcodeReader.stop().then((r) => {
                setInterval(() => {
                    barcodeReader.start().then((r) => {
                        console.log(r);
                    });
                    }, 3000);
              });
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
  }, []);

  return (
    <React.Fragment>
      <div
      ref={myRef}
        className="scanner"
        id="scanner"
        style={{ position: "relative", height: "65vh", width: "100vw" }}
      ></div>
    </React.Fragment>
  );
}

