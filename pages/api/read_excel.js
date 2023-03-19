// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const readXlsxFile = require('read-excel-file/node')


export default async function handler(req, res) {
    let data = []
    const route = req.body.routeNumber;
    try {
        const rows = await readXlsxFile(`./public/excels/${route}/data_${route}.xlsx`);

        for (let i = 1; i < rows.length; i++) {
            data.push({
                "STOP NUMBER": rows[i][0],
                "CONSIGNMENT NUMBER": rows[i][2],
            })
        }
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json("error")
    }
    
}
