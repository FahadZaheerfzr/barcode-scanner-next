// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const readXlsxFile = require('read-excel-file/node')


export default async function handler(req, res) {
    let data = []
    const rows = await readXlsxFile("./public/excels/235/DATA.xlsx");

    for (let i = 1; i < rows.length; i++) {
        data.push({
            "STOP NUMBER": rows[i][0],
            "CONSIGNMENT NUMBER": rows[i][2],
        })
    }
    res.status(200).json(data)
    
}
