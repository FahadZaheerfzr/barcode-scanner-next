// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'

export default async function handler(req, res) {

    const routes = req.body.routes;
    const fileNames = req.body.fileNames;

    console.log(req.body)


    for (let i = 0; i < routes.length; i++) {
        fs.unlink(`./public/excels/${routes[i]}/` + fileNames[i], (err) => {
            if (err) {
                throw err;
            }

            console.log("Delete File successfully.");
        });
    }

}
