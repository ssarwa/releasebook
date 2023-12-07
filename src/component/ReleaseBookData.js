import React, { useState, useEffect } from 'react';
import Data from '../ReleaseBook.csv';
import CategoriesData from '../Categories.csv';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Category.css'
import Papa from 'papaparse';
import '../App.css';


const ReleaseBookData = () => {

    const [catData, setCatData] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [func, setFunc] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [custVideo, setCustVideo] = useState(false);
    const [intVideo, setIntVideo] = useState(false);
    const [productVideo, setProductVideo] = useState(false);

    const titleStyles = {
        color: '#007bff',
        fontWeight: 'normal',
        paddingTop: '30px',
        minWidth: '1300px',
    };

    const searchStyles = {
        color: 'white',
    };

    const headerStyles = {
        borderLeft: 'thin solid',
        borderBottom: 'none',
        verticalAlign: 'middle',
        color: 'white',
    };

    const rowStyles = {
        borderLeft: 'thin solid',
        borderBottom: 'none',
        verticalAlign: 'middle',
        color: 'white',
    };

    const getCellStyle = (index) => {
        // Define your dynamic styles based on the category
        switch (index) {
            case -1:
                return 'text-center bgs-an c3d';
            case 0:
                return 'text-center bgs-an c3d';
            case 1:
                return 'text-center bgs-mgmt c3d';
            case 2:
                return 'bgs-md c3d';
            case 3:
                return 'bgs-iot c3d';
            case 4:
                return 'bgs-int c3d';
            case 5:
                return 'bgs-dev c3d';
            case 6:
                return 'bgs-sec c3d';
            case 7:
                return 'bgs-ai c3d';
            case 8:
                return 'bgs-an c3d';
            case 9:
                return 'bgs-cmp c3d';
            case 10:
                return 'bgs-nw c3d';
            case 11:
                return 'bgs-st c3d';
            case 12:
                return 'bgs-md c3d';
            default:
                return 'bgs-md c3d';
        }
    };



    const [sortedData, setSortedData] = useState(filteredData);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
        sortData(key, direction);
    };

    const sortData = (key, direction) => {
        const sorted = [...data].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setSortedData(sorted);
        setFilteredData(sorted)

    };




    const handleCatClick = (cell) => {
        setFunc(cell);
    }

    const handleSearchData = (search) => {

        setSearch(search)
        const newData = data.filter((row) =>
            row.release_note.toLowerCase().includes(search.toLowerCase()) || row.release_summary.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredData(newData)
    }

    const handleSubProd = (val) => {
        const newData = data.filter((newval) => newval.sub_product === val)
        console.log(newData);
        setFilteredData(newData)
    }

    const handleFunc = (val) => {
        const newData = data.filter((newval) => newval.function === val)
        console.log(newData);
        setFilteredData(newData)
    }

    const handleFilterData = (search) => {
        const newData = filteredData.filter((newval) => newval.sub_product === 'Settings')
        setData(newData)
    }

    const handleCustVideo = () => {
        setCustVideo(!custVideo);
        if (!custVideo) {
            const newData = filteredData.filter((newval) => newval.cs_video_ext === 'Video')
            setFilteredData(newData);
        }
        else {
            handleSearchData(search);
        }
    }

    const handleIntVideo = () => {
        setIntVideo(!intVideo);
        if (!intVideo) {
            const newData = filteredData.filter((newval) => newval.cs_video_int === 'Video')
            setFilteredData(newData);
        }
        else {
            handleSearchData(search);
        }
    }

    const handleProductVideo = () => {
        setProductVideo(!productVideo);
        if (!productVideo) {
            const newData = filteredData.filter((newval) => newval.product_video === 'Video')
            setFilteredData(newData);
        }
        else {
            handleSearchData(search);
        }
    }


    useEffect(() => {
        const fetchData = async () => {

            //Fetch Category Data
            const response_cat = await fetch(CategoriesData);
            const reader_cat = response_cat.body.getReader();
            const result_cat = await reader_cat.read();
            const decoder_cat = new TextDecoder("utf-8");
            const csvData_cat = decoder_cat.decode(result_cat.value);
            var parsedData_cat = Papa.parse(csvData_cat, {
                header: true,
                skipEmptyLines: true
            }).data;

            // const data1 = parsedData_cat.map((row) => {
            //     const newRow = {};

            //     for (const key in row) {
            //         const newKey = key.replace(/\s+/g, '_').toLowerCase();
            //         newRow[newKey] = row[key];
            //     }
            //     return newRow;
            // });

            setCatData(parsedData_cat);

            //Fetch Release Book Data
            const response = await fetch(Data);
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder("utf-8");
            const csvData = decoder.decode(result.value);
            var parsedData = Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true
            }).data;

            const filteredData = parsedData.filter((row) => {
                return row.Category === 'Product Feature' && row.Product === 'Secure'
            })

            const sanitizedData = filteredData.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setData(sanitizedData);
            setFilteredData(sanitizedData)
        };
        fetchData();
    }, []);

    return (
        <div>

            <div>
                <h1 className="text-center" style={titleStyles}>
                    Sysdig Secure Product Feature Releases
                </h1>
                <br></br>

                {catData.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(catData[0]).map((header, index) => (
                                    <th scope="col" width="100px" key={index} style={headerStyles} className={getCellStyle(-1)} onClick={() => handleSubProd(header)}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {catData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        <td width="70" height="50" key={cellIndex} style={rowStyles} className={getCellStyle(cellIndex)} onClick={() => handleFunc(cell)}>{cell}</td>
                                    ))}
                                </tr>
                            ))}

                        </tbody>
                    </table>

                )}

            </div>
            <br></br>
            <div>
                &nbsp;
                <input onChange={(e) => handleSearchData(e.target.value)}></input>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={custVideo} onChange={handleCustVideo} className='checkbox-inline' style={searchStyles}></input>&nbsp;Customer Videos</label>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={intVideo} onChange={handleIntVideo} className='checkbox-inline'></input>&nbsp;Internal Videos</label>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={productVideo} onChange={handleProductVideo} className='checkbox-inline' id="checkboxSuccess"></input>&nbsp;Product Videos</label>

            </div>
            <br></br>
            <table className='table table-stripped table-bordered text-left table-hover table-condensed table-responsive' >
                <thead>
                    {filteredData.length > 0 && (
                        <tr>
                            <th>sub_product</th>
                            <th onClick={() => requestSort('function')}>function</th>
                            <th onClick={() => requestSort('sub_function')}>sub_function</th>
                            <th className='w-25'>release_summary</th>
                            <th className='max-width-150'>release_note</th>
                            <th onClick={() => requestSort('slack_link')}>slack_link</th>
                            <th onClick={() => requestSort('product_video')}>product_video</th>
                            <th onClick={() => requestSort('cs_video_int')} className='text-center'>cs_video_int</th>
                            <th onClick={() => requestSort('cs_video_ext')} className='text-center'>cs_video_ext</th>
                            <th onClick={() => requestSort('release_note_link')} className='text-center'>release_note_link</th>
                            <th onClick={() => requestSort('documentation')} className='text-center'>documentation</th>
                            <th onClick={() => requestSort('assigned_resource')} className='text-center'>assigned_resource</th>
                            <th onClick={() => requestSort('cs_video_added_date')} className='text-center'>cs_video_added_date</th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>

                            <td className='text-center'>{row.sub_product}</td>
                            <td className='text-center'>{row.function}</td>
                            <td className='text-center'>{row.sub_function}</td>
                            <td className="truncated-text" >{row.release_summary}</td>
                            <td className="truncated-text">{row.release_note}</td>
                            <td className='text-center'>{row.slack_link}</td>
                            <td className='text-center'>{row.product_video}</td>
                            <td className='text-center'>{row.cs_video_int}</td>
                            <td className='text-center'>{row.cs_video_ext}</td>
                            <td className='text-left'>{row.release_note_link}</td>
                            <td className='text-center'>{row.documentation}</td>
                            <td className='text-center'>{row.assigned_resource}</td>
                            <td className='text-center'>{row.cs_video_added_date}</td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default ReleaseBookData;
