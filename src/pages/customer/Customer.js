// Customers.js
import React, { useEffect, useState } from 'react';
import CreateCustomer from '../../components/CreateCustomer';
import { db } from "../../firebase"
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  where
} from 'firebase/firestore';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, createData, deleteData, fetchDataFromDb } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { copyDataWithProgressBar } from '../../services/specialFunctions';

function Customers() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length -1];
  const { myCollection } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const customer = adminCollection(collections.ADMINCUSTOMERS)
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [currentTenant, setCurrentTenant] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const handleProgress = (percent, text, current, total) => {
    // Update state to reflect progress and tenant count
    setProgressPercent(percent);
    setProgressText(text);
    setCurrentTenant(current);
    setTotalTenants(total);
  };
  
  const startSync = async () => {
    setIsSyncing(true)
    try {
      copyDataWithProgressBar(collections.ADMINCUSTOMERS, collections.CUSTOMERS, handleProgress).then(() => {
        toast.success(' Vendors Successfully Syncronized For Tenants', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setIsSyncing(false)
        setShowSyncModal(false)
        setProgressPercent(0);
        setProgressText('');
        setCurrentTenant(0);
      
      })
    } catch (error) {
      toast.error(' ERROR, syncing Vendors', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    setData([])
    setColumns(
      tableFields.CUSTOMERS.map((col) => ({
        header: col.heading,
        accessorKey: col.item
      }))
    );
    getData();
  }, [])
   useEffect(()=>{
    setShowCreateForm(false);
   }, [model])
  useEffect(() => {
    let sort = searchParams.get("sort");
    const whereQuery = where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V');
      getData(sort?.split(",").map((el) => el.split(":")), whereQuery)

  }, [searchParams, model])

  const getData = async (sort, whereQuery) => {
    setIsLoading(true)
    
    fetchDataFromDb(sort, whereQuery, await customer, tableFields.CUSTOMERS)
      .then((servicefetch) => {
        setData(servicefetch);
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

  const handleCreateCustomer = async (newCustomer) => {
    createData(await customer, newCustomer)
      .then((servicefetch) => {
        setShowCreateForm(false)
        const whereQuery = where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V');
        console.log('fetch');
        getData([], whereQuery);
        toast.success(`${model} Customer Successfully Created`, {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  }
  const showDeleteConfirmation = (id) => {
    setCustomerIdToDelete(id);
    setShowDeleteModal(true);
  };

  // Function to cancel the delete action
  const cancelDelete = () => {
    setCustomerIdToDelete(null);
    setShowDeleteModal(false);
  };
  const handleDelete = (id) => {
    deleteData(customer, id)
    .then(() => {
        getData([], where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V'));
        toast.success('Customer Successfully Deleted', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  };
  const handleView = (data) => {
    navigate(`/${model}/${data}`)
  }

  return (
    <div className='container p-2 '>
      <h2 className="text-xl font-bold mb-4">{model.charAt(0).toUpperCase() + model.slice(1)}s</h2>
      <Modal className="" show={showDeleteModal} onHide={cancelDelete}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <p className="text-gray-700 text-white">Are you sure you want to delete this Customer?</p>
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelDelete} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleDelete(customerIdToDelete);
                cancelDelete();
              }}>
                Delete
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
      <Modal show={showSyncModal} onHide={() => !isSyncing && setShowSyncModal(false)}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Product Syncronization</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            {isSyncing ?
              <div>
                <p className="text-gray-700 text-white">{progressText}</p>
                <div className="progress" style={{ height: '20px', marginTop: '10px' }}>
                  <div id="progress-bar" className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercent}%` }} aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <p id="progress-message" className="text-white mt-2">{`Syncing... ${progressPercent.toFixed(2)}%`}</p>
              </div> :
              <>
                <p className="text-gray-700 text-white">
                  All tenants will be syncronised with Vendor details
                </p>
              </>}
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button
                variant="danger"
                disabled={isSyncing}
                onClick={() => setShowSyncModal(false)} className="mr-2">
                Cancel
              </Button>
              <Button variant="primary"
                className='w-40'
                disabled={isSyncing}
                onClick={startSync}>
                {isSyncing ?
                  <div>
                    Syncronizing
                    <span className='ms-2'>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true" />
                    </span>
                  </div> : 'Syncronize'}
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
      {showCreateForm ? (
        <CreateCustomer onCreate={handleCreateCustomer} onCancel={() => { setShowCreateForm(false) }} customers={data} model={model}/>
      ) : (
      <div className='flex justify-between'>
        <Button className='mb-2 drop-shadow' onClick={() => setShowCreateForm(true)}> Add {model}</Button>
        <Button
            className='mb-2 drop-shadow w-40'
            disabled={isSyncing}
            onClick={() => { setShowSyncModal(true) }}>
            {isSyncing ?
              <div>
                Syncronizing
                <span className='ms-2'>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true" />
                </span>
              </div> : 'Syncronize'}
          </Button>
        </div>
      )}
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
                ...columns,
                {
                  header: 'Actions',
                  cell: (rowData) => {
                    return (<div className="flex justify-between">
                      <button onClick={() => handleView(rowData?.row?.original?.id)} className="btn btn-primary btn-sm me-2" > View </button>
                      <button onClick={() => showDeleteConfirmation(rowData?.row?.original?.id)} className="btn btn-danger btn-sm" > Delete </button>
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
    </div>
  );
}

export default Customers;
