// EventView.js
import React, { useEffect, useState } from 'react'
import { db } from "../../firebase"
import { collection } from 'firebase/firestore';
import Button from 'react-bootstrap/esm/Button';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, fetchDataFromDb } from '../../services';
import { MdQrCodeScanner } from "react-icons/md";
import {QrScanner} from '@yudiel/react-qr-scanner';

function EventView() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length -1];
  const customer = collection(db, `Events/${model}/Members`)
  useEffect(() => {
    setData([])
    setColumns(
      tableFields.MEMBER.map((col) => ({
        header: col.heading,
        accessorKey: col.item
      }))
    );
    getData();
  }, [])


  const getData = async (sort, whereQuery) => {
    setIsLoading(true)
    
    fetchDataFromDb(sort || [], whereQuery || [], customer, [])
      .then((servicefetch) => {
        setData(servicefetch);
        console.log('1', servicefetch, customer);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });
  }

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
    }
  }, [data]);

  const handleView = (data) => {
    navigate(`/${model}/${data}`)
  }

  return (
    <div className='container p-2 '>
      {isScanning ? 
      <div>
        <div className='p-2 flex justify-end'>
          <Button variant='outline-primary' onClick={()=>{setIsScanning(false)}}>
            Close
          </Button>
        </div>
        <QrScanner
          onDecode={(result) => console.log(result)}
          onError={(error) => console.log(error?.message)}
      />
      </div> :
      <div>
      <h2 className="text-xl font-bold mb-4">{}</h2>
      
      <div className='flex justify-between'>
        <Button className='mb-2 drop-shadow' onClick={() => setIsScanning(true)}>
           <span className='flex items-center justify-around p-1 text-3xl'> <MdQrCodeScanner /></span>
          </Button>
        </div>
 
      {isLoading && !data[0] &&
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div>}
      {showCreateForm ? null :
        (data[0] ?
          <div className='drop-shadow'>
            <Table
              data={data}
              columns={[
                {
                  header: 'Sl No',
                  cell: (rowData) => {
                    return (
                      <td>
                        {rowData?.row?.index + 1}
                      </td>)
                  }
                },
                ...columns,
                {
                  header: 'Entry',
                  cell: (rowData) => {
                    return (
                      <td>
                        <button className={`${rowData?.row?.original?.entry ==
                          true ? 'bg-green-600' : 'bg-red-600'}
                          py-1 text-xs rounded text-white w-20 shadow`}>
                          {rowData?.row?.original?.AVAILABLE ? 'Yes' : 'No'}
                        </button>
                      </td>)
                  }
                },
                {
                  header: 'Actions',
                  cell: (rowData) => {
                    return (<div className="flex justify-between">
                      <button onClick={() => handleView(rowData?.row?.original?.id)} className="btn btn-primary btn-sm me-2" > Attend </button>
                    </div>)
                  }
                }
              ]}
              pageLimit={10}
            />
          </div> :
          (!isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Customer Data</p>
            : '')
        )}
      </div>}
    </div>
  );
}

export default EventView;
