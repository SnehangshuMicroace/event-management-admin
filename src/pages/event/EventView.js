// EventView.js
import React, { useEffect, useState } from 'react'
import { db } from "../../firebase"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Button from 'react-bootstrap/esm/Button';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, fetchDataFromDb } from '../../services';
import { MdQrCodeScanner } from "react-icons/md";
import {QrScanner} from '@yudiel/react-qr-scanner';

import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";


// import { QrReader } from 'react-qr-reader';


function EventView() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false); 
    const [scanResult, setScanResult] = useState('');
    const [alreadyCheckedModal, setAlreadyCheckedModal] = useState(false); 

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

  
  const handleQRDecode = async (result) => {
    setIsLoading(true);

    if (result) {
        try {
            const q = query(customer, where("MobileNumber", "==", result));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('No member found with this mobile number.');
            } else {
                const memberData = querySnapshot.docs[0].data();
                if (!memberData.entry) {
                    await updateDoc(querySnapshot.docs[0].ref, { entry: true });
                    setShowModal(true);
                    setScanResult(result);
                } else {
                    setAlreadyCheckedModal(true);
                }
            }
        } catch (error) {
            console.error('Error updating entry:', error);
        } finally {
            setIsScanning(false);
            setIsLoading(false);
        }
    } else {
        alert('No QR Code detected.');
        setIsLoading(false);
    }
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
         onDecode={handleQRDecode}
          onError={(error) => console.log(error?.message)}
        />
               <Modal show={showModal} onHide={() => setShowModal(false)} style={{marginTop:"42%" }}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color:"green"}}>Check-in Success</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:"flex",justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
                  <IoCheckmarkDoneCircle style={{fontSize:"100x", color:"green"}}/>
                  <h1>successfully Checked In</h1>
                </Modal.Body>
                <div style={{display:"flex", justifyContent:"space-around", marginBottom:"3%"}}>
                      <Button onClick={()=>{setIsScanning(false)}}>Close</Button>
                      <Button onClick={() => setShowModal(false)}>Re Scan</Button>
                    </div>
            </Modal>
            <Modal show={alreadyCheckedModal} onHide={() => setAlreadyCheckedModal(false)} style={{marginTop:"42%" }}>
                <Modal.Header closeButton>
                    <Modal.Title  style={{color:"red"}}>Already Checked In</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:"flex",justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
                  <RxCrossCircled style={{fontSize:"100px", color:"red"}}/>
                    <p>You're already checked in. Have a great time!</p>
                </Modal.Body>
                <div style={{display:"flex", justifyContent:"space-around", marginBottom:"3%"}}>
                      <Button onClick={()=>{setIsScanning(false)}}>Close</Button>
                      <Button onClick={() => setAlreadyCheckedModal(false)}>Re Scan</Button>
                    </div>
            </Modal>
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
                      <button className={`${rowData?.row?.original?.entry ? 'bg-green-600' : 'bg-red-600'}
                        py-1 text-xs rounded text-white w-20 shadow`}>
                        {rowData?.row?.original?.entry ? 'Yes' : 'No'}
                      </button>
                    </td>)
                  }
                },
                // {
                //   header: 'Actions',
                //   cell: (rowData) => {
                //     return (<div className="flex justify-between">
                //       <button onClick={() => handleView(rowData?.row?.original?.id)} className="btn btn-primary btn-sm me-2" > Attend </button>
                //     </div>)
                //   }
                // }
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
