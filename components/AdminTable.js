import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AdminTable() {
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const fetchData = async () => {
        const response = await axios.get('/api/get_excel_files');
        let data = []        
        for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < response.data[i].excels.length; j++) {
                data.push(
                    {
                        id: j+response.data[i].route,
                        fileName: response.data[i].excels[j],
                        routeNumber: response.data[i].route
                    }
                )
            }
        }
        console.log(data)
        setData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRowSelect = (event, id) => {
        if (event.target.checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleBulkDelete = async () => {
        console.log(selectedRows)
        let routes = []
        let fileNames = []
        for (let i = 0; i < selectedRows.length; i++) {
            const routeNumber = data.filter(row => row.id === selectedRows[i])[0].routeNumber
            const fileName = data.filter(row => row.id === selectedRows[i])[0].fileName
            routes.push(routeNumber)
            fileNames.push(fileName)

        }

    
        axios.post('/api/delete_files', {
            routes: routes,
            fileNames: fileNames
        })
        
        setData(data.filter(row => !selectedRows.includes(row.id)));
        
        setSelectedRows([]);
    };

    const handleRowDelete = async id => {

        const routeNumber = data.filter(row => row.id === id)[0].routeNumber
        const fileName = data.filter(row => row.id === id)[0].fileName

        axios.post('/api/delete_file', {
            route: routeNumber,
            fileName: fileName
        })

        setData(data.filter(row => row.id !== id));
        setSelectedRows([]);
    };

    return (
        <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" onChange={event => setSelectedRows(event.target.checked ? data.map(row => row.id) : [])} />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Excel File Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.map(row => (
                    <tr key={row.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={event => handleRowSelect(event, row.id)} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.fileName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.routeNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleRowDelete(row.id)} className="text-red-600 hover:text-red-900">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="bg-gray-50">
                {selectedRows.length > 0 && (
                    <tr>
                        <td colSpan="4" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button onClick={handleBulkDelete} className="text-red-600 hover:text-red-900">
                                Delete selected rows
                            </button>
                        </td>
                    </tr>
                )}
            </tfoot>
        </table>
    );
}

export default AdminTable;
