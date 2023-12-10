import React, { useState, useEffect } from 'react';
import Data from '../data/ReleaseBook.csv';
import SecureCatCSV from '../data/Secure_Cat.csv'
import MonitorCatCSV from '../data/Monitor_Cat.csv'
import PlatformCatCSV from '../data/Platform_Cat.csv'
import UtilityCatCSV from '../data/Utility_Cat.csv'
import ComponentCatCSV from '../data/Component_Cat.csv'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Category.css'
import Papa from 'papaparse';
import '../App.css';


const ReleaseBookData = () => {

    const [catData, setCatData] = useState([]);
    const [secureCatData, setSecureCatData] = useState([]);
    const [monitorCatData, setMonitorCatData] = useState([]);
    const [platformCatData, setPlatformCatData] = useState([]);
    const [utilityCatData, setUtilityCatData] = useState([]);
    const [componentCatData, setComponentCatData] = useState([]);


    const [origData, setOrigData] = useState([]); //Stores original data - never changes
    const [data, setData] = useState([]); //stores data based on category clicked on the top (secure, monitor, platform, etc)
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [func, setFunc] = useState('');
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


    //Implement Sorting on every column...
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
        const sorted = [...filteredData].sort((a, b) => {
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

    const SearchReleaseBookData = (search) => {
        setSearch(search)
        const newData = data.filter((row) =>
            row.release_note.toLowerCase().includes(search.toLowerCase()) || row.release_summary.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredData(newData)
    }


    const SearchCustVideo = () => {
        setCustVideo(!custVideo);
        if (!custVideo) {
            const newData = filteredData.filter((newval) => newval.cs_video_ext === 'Video')
            setFilteredData(newData);
        }
        else {
            SearchReleaseBookData(search);
        }
    }

    const searchIntVideo = () => {
        setIntVideo(!intVideo);
        if (!intVideo) {
            const newData = filteredData.filter((newval) => newval.cs_video_int === 'Video')
            setFilteredData(newData);
        }
        else {
            SearchReleaseBookData(search);
        }
    }

    const searchProductVideo = () => {
        setProductVideo(!productVideo);
        if (!productVideo) {
            const newData = filteredData.filter((newval) => newval.product_video === 'Video')
            setFilteredData(newData);
        }
        else {
            SearchReleaseBookData(search);
        }
    }


    const filterCategories = (cat) => {

        const a = filterReleaseData(cat)
        setFilteredData(a);
        setData(a);




        switch (cat) {
            case 'all':
                return setCatData(secureCatData) // create csv for all and use that here...
            case 'secure':
                return setCatData(secureCatData);
            case 'monitor':
                return setCatData(monitorCatData);
            case 'platform':
                return setCatData(platformCatData);
            case 'utility':
                return setCatData(utilityCatData);
            default:
                return setCatData(secureCatData);
        }

    }

    const filterReleaseData = (cat, prod) => {
        switch (cat) {
            case 'all':
                return origData;
            case 'secure':
                var newData1 = origData.filter((newval) => {
                    return newval.category.toLowerCase() === 'product feature' && newval.product.toLowerCase() === 'secure';
                });
                return newData1;
            case 'monitor':
                var newData1 = origData.filter((newval) => {
                    return newval.category.toLowerCase() === 'product feature' && newval.product.toLowerCase() === 'monitor';
                });
                return newData1;
            case 'platform':
                var newData1 = origData.filter((newval) => {
                    return newval.category.toLowerCase() === 'product feature' && newval.product.toLowerCase() === 'platform';
                });
                return newData1;
            case 'utility':
                var newData1 = origData.filter((newval) => {
                    return newval.category.toLowerCase() === 'utility';
                });
                return newData1;
            default:
                var newData1 = origData.filter((newval) => {
                    return newval.category.toLowerCase() === 'product feature' && newval.product.toLowerCase() === 'secure';
                });
                return newData1;
        }

    }

    const handleProd = (val) => {

        const newData = data.filter((newval) => newval.product.toLowerCase() === val.toLowerCase())

        console.log(catData);
        const newCatData = catData.filter((newval) => newval.product.toLowerCase() === val.toLowerCase())

        setFilteredData(newData)
        setCatData(newCatData)
    }

    const handleSubProd = (val) => {
        const newData = data.filter((newval) => newval.sub_product.toLowerCase() === val.toLowerCase())
        setFilteredData(newData)
        setData(newData)
    }

    const handleFunc = (val) => {
        const newData = data.filter((newval) => newval.function.toLowerCase() === val.toLowerCase())
        setFilteredData(newData)
        setData(newData)
    }

    //Not working... need to check
    const csvToArray = async (fn) => {
        //Fetch Secure Category Data
        const response_sec_cat = await fetch(MonitorCatCSV);
        const reader_sec_cat = response_sec_cat.body.getReader();
        const result_sec_cat = await reader_sec_cat.read();
        const decoder_sec_cat = new TextDecoder("utf-8");
        const csvData_sec_cat = decoder_sec_cat.decode(result_sec_cat.value);
        var parsedData_sec_cat = Papa.parse(csvData_sec_cat, {
            header: true,
            skipEmptyLines: true
        }).data;

        // const sanitizedData_sec_cat = parsedData_sec_cat.map((row) => {
        //     const newRow = {};
        //     for (const key in row) {
        //         const newKey = key.replace(/\s+/g, '_').toLowerCase();
        //         newRow[newKey] = row[key];
        //     }
        //     return newRow;
        // });
        return parsedData_sec_cat;
    }

    useEffect(() => {
        const fetchData = async () => {

            //Fetch Secure Category Data
            const response_sec_cat = await fetch(SecureCatCSV);
            const reader_sec_cat = response_sec_cat.body.getReader();
            const result_sec_cat = await reader_sec_cat.read();
            const decoder_sec_cat = new TextDecoder("utf-8");
            const csvData_sec_cat = decoder_sec_cat.decode(result_sec_cat.value);
            var parsedData_sec_cat = Papa.parse(csvData_sec_cat, {
                header: true,
                skipEmptyLines: true
            }).data;

            const sanitizedData_sec_cat = parsedData_sec_cat.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setSecureCatData(sanitizedData_sec_cat);

            //Fetch Monitor Category Data
            const response_mon_cat = await fetch(MonitorCatCSV);
            const reader_mon_cat = response_mon_cat.body.getReader();
            const result_mon_cat = await reader_mon_cat.read();
            const decoder_mon_cat = new TextDecoder("utf-8");
            const csvData_mon_cat = decoder_mon_cat.decode(result_mon_cat.value);
            var parsedData_mon_cat = Papa.parse(csvData_mon_cat, {
                header: true,
                skipEmptyLines: true
            }).data;

            console.log(parsedData_mon_cat);
            const sanitizedData_mon_cat = parsedData_mon_cat.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setMonitorCatData(sanitizedData_mon_cat);

            //Fetch Platform Category Data
            const response_plat_cat = await fetch(PlatformCatCSV);
            const reader_plat_cat = response_plat_cat.body.getReader();
            const result_plat_cat = await reader_plat_cat.read();
            const decoder_plat_cat = new TextDecoder("utf-8");
            const csvData_plat_cat = decoder_plat_cat.decode(result_plat_cat.value);
            var parsedData_plat_cat = Papa.parse(csvData_plat_cat, {
                header: true,
                skipEmptyLines: true
            }).data;

            console.log(parsedData_plat_cat);
            const sanitizedData_plat_cat = parsedData_plat_cat.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setPlatformCatData(sanitizedData_plat_cat);

            //Fetch Utility Category Data
            const response_uti_cat = await fetch(UtilityCatCSV);
            const reader_uti_cat = response_uti_cat.body.getReader();
            const result_uti_cat = await reader_uti_cat.read();
            const decoder_uti_cat = new TextDecoder("utf-8");
            const csvData_uti_cat = decoder_uti_cat.decode(result_uti_cat.value);
            var parsedData_uti_cat = Papa.parse(csvData_uti_cat, {
                header: true,
                skipEmptyLines: true
            }).data;

            console.log(parsedData_uti_cat);
            const sanitizedData_uti_cat = parsedData_uti_cat.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setUtilityCatData(sanitizedData_uti_cat);

            setCatData(secureCatData)


            //setCatData(sanitizedData_sec_cat);

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

            // const filteredData = parsedData.filter((row) => {
            //     return row.Category === 'Product Feature' && row.Product === 'Secure'
            // })


            const sanitizedData = parsedData.map((row) => {
                const newRow = {};
                for (const key in row) {
                    const newKey = key.replace(/\s+/g, '_').toLowerCase();
                    newRow[newKey] = row[key];
                }
                return newRow;
            });

            setOrigData(sanitizedData);
            setData(sanitizedData);
            setFilteredData(sanitizedData)
        };
        fetchData();
    }, []);

    return (
        <div>


            <div>
                <table>
                    <thead>
                        <tr>
                            <td scope="col" width="100px" className={getCellStyle(5)} style={headerStyles} onClick={() => filterCategories('all')}>All</td>
                            <td scope="col" width="100px" className={getCellStyle(5)} style={headerStyles} onClick={() => filterCategories('secure')}>Secure</td>
                            <td scope="col" width="100px" className={getCellStyle(6)} style={headerStyles} onClick={() => filterCategories('monitor')}>Monitor</td>
                            <td scope="col" width="100px" className={getCellStyle(7)} style={headerStyles} onClick={() => filterCategories('platform')}>Platform</td>
                            <td scope="col" width="100px" className={getCellStyle(8)} style={headerStyles} onClick={() => filterCategories('utility')}>Utility</td>
                        </tr>
                    </thead>
                </table>

                <h1 className="text-center" style={titleStyles}>
                    Sysdig Secure Product Feature Releases
                </h1>
                <br></br>

                {catData.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(catData[0]).map((header, index) => (
                                    <td scope="col" width="100px" key={index} style={headerStyles} className={getCellStyle(-1)} onClick={() => handleSubProd(header)}>{header}</td>
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
                <input onChange={(e) => SearchReleaseBookData(e.target.value)}></input>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={custVideo} onChange={SearchCustVideo} className='checkbox-inline' style={searchStyles}></input>&nbsp;Customer Videos</label>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={intVideo} onChange={searchIntVideo} className='checkbox-inline'></input>&nbsp;Internal Videos</label>
                &nbsp;&nbsp;&nbsp;
                <label style={searchStyles}><input type="checkbox" checked={productVideo} onChange={searchProductVideo} className='checkbox-inline' id="checkboxSuccess"></input>&nbsp;Product Videos</label>

            </div>
            <br></br>
            <table className='table table-stripped table-bordered text-left table-hover table-condensed table-responsive' >
                <thead>
                    {filteredData.length > 0 && (
                        <tr>

                            <th onClick={() => requestSort('category')}>category</th>
                            <th onClick={() => requestSort('product')}>product</th>
                            <th onClick={() => requestSort('product')}>sub product</th>
                            <th onClick={() => requestSort('function')}>function</th>
                            <th onClick={() => requestSort('sub_function')}>sub function</th>
                            <th className='w-25'>release summary</th>
                            <th className='max-width-150'>release note</th>
                            <th onClick={() => requestSort('slack_link')}>slack link</th>
                            <th onClick={() => requestSort('product_video')}>product video</th>
                            <th onClick={() => requestSort('cs_video_int')} className='text-center'>cs video internal</th>
                            <th onClick={() => requestSort('cs_video_ext')} className='text-center'>cs video external</th>
                            <th onClick={() => requestSort('release_note_link')} className='text-center'>release note link</th>
                            <th onClick={() => requestSort('documentation')} className='text-center'>documentation</th>
                            <th onClick={() => requestSort('assigned_resource')} className='text-center'>assigned resource</th>
                            <th onClick={() => requestSort('cs_video_added_date')} className='text-center'>cs video added date</th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            <td className='text-center'>{row.category}</td>
                            <td className='text-center'>{row.product}</td>
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
