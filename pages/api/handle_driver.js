// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IncomingForm } from "formidable";
import mv from "mv";
import fs from "fs";

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function handler(req, res) {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ multiples: true });
        console.log("hello")
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            try {
                const route = fields.routeNumber;
                const file = files.excelFile;

                fs.mkdirSync(`./public/excels/${route}`, { recursive: true })

                const oldPath = files.excelFile.filepath;
                const newPath = `./public/excels/${route}/data_${route}.xlsx`
                mv(oldPath, newPath, function (err) {
                    if (err) {
                        console.log(err)
                    }
                });


            } catch (e) {
                console.log("error")
                console.log(e)
            }

        });
    });
    res.status(200).json("okay")

}
