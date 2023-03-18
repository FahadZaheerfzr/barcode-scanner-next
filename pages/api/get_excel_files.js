// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'

export default async function handler(req, res) {
    let data = []
    fs.readdir("./public/excels", function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            let dataEntry = {}
            dataEntry["route"] = file

            let files = fs.readdirSync(`./public/excels/${file}`)
            dataEntry["excels"] = files
            data.push(dataEntry)
            // Do whatever you want to do with the file
        });

        res.status(200).json(data)
    });
    
}
