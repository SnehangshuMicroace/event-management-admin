// Customers.js
import React, { useEffect, useState } from 'react';
import CreateProduct from '../../components/CreateProduct';
import { db } from "../../firebase"
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  doc
} from 'firebase/firestore';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../config';
import { Spinner, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, createData, deleteData, fetchDataFromDb } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { addProductsToAllTenants, addProductsToProductsAdmin, copyDataToSpecificTenant, copyDataWithProgressBar, copyProductToAllTenants, deleteDataFromAllTenants, deleteDataFromAllTenantsWithCondition, isProductCodeUnique } from '../../services/specialFunctions';

function Products() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const { myCollection } = useAuth();
  const products = adminCollection('ProductsAdmin')
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [currentTenant, setCurrentTenant] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [selectedTenantId, setSelectedTenantId] = useState('');

  useEffect(() => {
    let sort = searchParams.get("sort");
    if (sort) {
      getData(sort.split(",").map((el) => el.split(":")))
    }
  }, [searchParams])

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
      copyDataToSpecificTenant(selectedTenantId, handleProgress).then(() => {
        toast.success(' All Products Successfully Syncronized For Tenant', {
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
        setSelectedTenantId('')
      })
    } catch (error) {
      toast.error(' ERROR, syncing products', {
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

  const getData = async (sort) => {
    setIsLoading(true)
    fetchDataFromDb(sort, '', await products)
      .then((servicefetch) => {
        setData(servicefetch);
        console.log(servicefetch);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });
  }

  useEffect(() => {
    setColumns(
      tableFields.PRODUCTS.map((col) => ({
        header: col.heading,
        accessorKey: col.item
      }))
    );
    getData();
  }, []);

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_PRODUCTS', payload: data });
    }
  }, [data]);

  const handleCreateProduct = async (mewProduct) => {
    const checkUniqueCode = await isProductCodeUnique(mewProduct.PRODCODE)
    if (checkUniqueCode) {
      addProductsToProductsAdmin(mewProduct).then((res) => {
        copyProductToAllTenants(res).then(() => {
          setShowCreateForm(false)
          getData();
          toast.success('Product Successfully Created to all', {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        });
      }).catch((error) => {
        console.log('error creating product', error);
      })
    } else {
      toast.error('Product code is not unique', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }
  }

  const showDeleteConfirmation = (id) => {
    setProductIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setProductIdToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async (id) => {
    console.log(id);
    deleteDataFromAllTenantsWithCondition(collections.PRODUCTS, 'PRODCODE', id)
      .then(() => {
        getData();
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
        console.error('Error deleting Product: ', error);
      });
  };

  const handleView = (data) => {
    navigate(`/products/${data}`)
  }

  return (
    <div className='container p-2 '>
      <h2 className="text-xl font-bold mb-4">Products</h2>
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
                  Enter a valid Tenant Id then Continue Syncronization,
                  It will syncronize all the Products to this Particular Tenant. <br />
                  While Syncronization do not back or Refresh, It may take few Seconds.
                </p>
                <label className="text-white mt-2">Enter Tenant ID:</label>
                <input
                  type="text"
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="form-control mt-2" />
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
      <Modal className="" show={showDeleteModal} onHide={cancelDelete}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <p className="text-gray-700 text-white">Are you sure you want to delete this Product?</p>
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelDelete} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleDelete(productIdToDelete);
                cancelDelete();
              }}>
                Delete
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
      {showCreateForm ? (
        <CreateProduct onCreate={handleCreateProduct} onCancel={() => { setShowCreateForm(false) }} products={data} />
      ) : (
        <div className='flex justify-between'>
          <Button className='mb-2 drop-shadow' onClick={() => setShowCreateForm(true)}> Add Product</Button>
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
        (data.length > 0 ?
          <div className='drop-shadow'>
            <Table
              data={data}
              columns={[
                {
                  header: 'AVAILABLE',
                  cell: (rowData) => {
                    return (
                      <td>
                        <button className={`${rowData?.row?.original?.AVAILABLE ==
                          true ? 'bg-green-600' : 'bg-red-600'}
                          py-1 text-xs rounded text-white w-20 shadow`}>
                          {rowData?.row?.original?.AVAILABLE ? 'Yes' : 'No'}
                        </button>
                      </td>)
                  }
                },
                ...columns,
                {
                  header: 'Actions',
                  cell: (rowData) => {
                    return (<div className="flex justify-between">
                      <button onClick={() => handleView(rowData?.row?.original?.id)} className="btn btn-primary btn-sm me-2" > View </button>
                      <button onClick={() => showDeleteConfirmation(rowData?.row?.original?.PRODCODE)} className="btn btn-danger btn-sm" > Delete </button>
                    </div>)
                  }
                }
              ]}
              pageLimit={10}
            />
          </div>
          :
          (!isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Product Data</p>
            : '')
        )}
    </div>
  );
}

export default Products;
