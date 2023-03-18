// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'

export default async function handler(req, res) {

    console.log(req.body)
    fs.unlink(`./public/excels/${req.body.route}/` + req.body.fileName, (err) => {
        if (err) {
            throw err;
        }
    
        console.log("Delete File successfully.");
    });
    
}
