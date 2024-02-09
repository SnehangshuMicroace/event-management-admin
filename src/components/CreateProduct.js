import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useEffect } from 'react';

const schema = yup
  .object({
    PRODCODE: yup.string().required('required'),
    DESCRIPT: yup.string().required('required'),
    SERVICE: yup.boolean().required('Please select Yes or No'),
    AVAILABLE: yup.boolean().required('Please select Yes or No'),
    UOM_PURCH: yup.string().required('required').max(5),
    UOM_STK: yup.string().required('required').max(5),
    UOM_SALE: yup.string().required('required').max(5),
    HSNCODE: yup.number().nullable().moreThan(0, "HSN Code cannot be negative").transform((_, val) => (val !== "" ? Number(val) : null)),
    IGST: yup.number(),
    RATE: yup.number(),
    BUY_RATE: yup.number().required('required'),
    MRP_RATE: yup.number().required('required'),
    DISCPER: yup.number(),
    GroupDesc: yup.string().required('required'),
    SGroupDesc: yup.string().required('required'),
    OPENING_Q: yup.number(),
    OPENING_V: yup.number(),
  })
  .required();

function CreateProduct({ onCreate, onCancel, products }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, isDirty, isValid, errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log(data);
    onCreate(data)
  }

  const handleServiceChange = (e) => {
    // Convert the selected option to a boolean value
    const isService = e.target.value;
    // console.log(e.target.value);
    setValue('SERVICE', isService);
  }
  return (
    <div className='bg-slate-200 p-4 drop-shadow rounded-xl'>
      <h2 className="text-xl font-semibold ">Create Product</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className=' py-2'>
          <Row >
            <Col lg={3} md={6} sm={12} className="">
              <Form.Group controlId="PRODCODE">
                <Form.Label className="block text-gray-700 font-medium">Product code</Form.Label>
                <Form.Control
                  type="text"
                  name="PRODCODE"
                  {...register('PRODCODE')}
                  placeholder="EX: P001"
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="AVAILABLE">
                <Form.Label className="block text-gray-700 font-medium">Is Available ?</Form.Label>
                <Form.Select aria-label="Default select example" onChange={handleServiceChange} {...register('AVAILABLE', { defaultValue: true })}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
                {errors.AVAILABLE && <span className="text-danger h-0">{errors.AVAILABLE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={9} md={6} sm={12} className="">
              <Form.Group controlId="DESCRIPT">
                <Form.Label className="block text-gray-700 font-medium">Description</Form.Label>
                <Form.Control
                  type="text"
                  name="DESCRIPT"
                  {...register('DESCRIPT')}
                  placeholder="Enter product Description"
                />
                {errors.DESCRIPT && <span className="text-danger h-0">{errors.DESCRIPT.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="SERVICE">
                <Form.Label className="block text-gray-700 font-medium">Service</Form.Label>
                <Form.Select aria-label="Default select example" onChange={handleServiceChange} {...register('SERVICE', { defaultValue: false })}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
                {errors.SERVICE && <span className="text-danger h-0">{errors.SERVICE.message}</span>}
              </Form.Group>
            </Col>

            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="UOM_PURCH">
                <Form.Label className="block text-gray-700 font-medium">UOM Purchase</Form.Label>
                <Form.Control
                  type="text"
                  name="UOM_PURCH"
                  {...register('UOM_PURCH')}
                  placeholder="Enter Purchase UOM"
                />
                {errors.UOM_PURCH && <span className="text-danger h-0">{errors.UOM_PURCH.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="UOM_SALE">
                <Form.Label className="block text-gray-700 font-medium">UOM Sale</Form.Label>
                <Form.Control
                  type="text"
                  name="UOM_SALE"
                  {...register('UOM_SALE')}
                  placeholder="Enter Sale UOM"
                />
                {errors.UOM_SALE && <span className="text-danger h-0">{errors.UOM_SALE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="UOM_STK">
                <Form.Label className="block text-gray-700 font-medium">UOM Stock</Form.Label>
                <Form.Control
                  type="text"
                  name="UOM_STK"
                  {...register('UOM_STK')}
                  placeholder="Enter Agent Code"
                />
                {errors.UOM_STK && <span className="text-danger h-0">{errors.UOM_STK.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="HSNCODE">
                <Form.Label className="block text-gray-700 font-medium">Hsn code</Form.Label>
                <Form.Control
                  type="text"
                  name="HSNCODE"
                  {...register('HSNCODE')}
                  placeholder="Enter Agent Code"
                />
                {errors.HSNCODE && <span className="text-danger h-0">{errors.HSNCODE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="IGST">
                <Form.Label className="block text-gray-700 font-medium">Gst Rate</Form.Label>
                <Form.Control
                  type="number"
                  step='0.01'
                  defaultValue="0.00"
                  name="IGST"
                  {...register('IGST')}
                  placeholder="Enter Gst number"
                />
                {errors.IGST && <span className="text-danger h-0">{errors.IGST.message}</span>}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className=' py-2'>
          <Row >
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="address">
                <Form.Label className="block text-gray-700 font-medium">Rate</Form.Label>
                <Form.Control
                  className='my-1'
                  type="number"
                  step='0.01'
                  defaultValue="0.00"
                  name="RATE"
                  {...register('RATE')}
                />
                {errors.RATE && <span className="text-danger h-0">{errors.RATE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} >
              <Form.Group controlId="BUY_RATE">
                <Form.Label className="block text-gray-700 font-medium">Buy Rate</Form.Label>
                <Form.Control
                  type="number"
                  step='0.01'
                  defaultValue="0.00"
                  name="BUY_RATE"
                  {...register('BUY_RATE')}
                  placeholder="Enter BUY_RATE name"
                />
                {errors.BUY_RATE && <span className="text-danger h-0">{errors.BUY_RATE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} >
            <Form.Group controlId="MRP_RATE">
              <Form.Label className="block text-gray-700 font-medium">Mrp Rate</Form.Label>
              <Controller
                name="MRP_RATE"
                control={control}
                defaultValue="0.00"
                render={({ field }) => (
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...field}
                    placeholder="Enter MRP_RATE name"
                  />
                )}
              />
              {errors.MRP_RATE && <span className="text-danger h-0">{errors.MRP_RATE.message}</span>}
            </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="DISCPER">
                <Form.Label className="block text-gray-700 font-medium">Discount Per Unit</Form.Label>
                <Form.Control
                  type="number"
                  step='0.01'
                  defaultValue="0.00"
                  name="DISCPER"
                  {...register('DISCPER')}
                  placeholder="Enter DISCPERcode"
                />
                {errors.DISCPER && <span className="text-danger h-0">{errors.DISCPER.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="GroupDesc">
                <Form.Label className="block text-gray-700 font-medium">Group Description</Form.Label>
                <Form.Control
                  type="text"
                  name="GroupDesc"
                  {...register('GroupDesc')}
                  placeholder="Enter GroupDesc name"
                />
                {errors.GroupDesc && <span className="text-danger h-0">{errors.GroupDesc.message}</span>}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className=' py-2'>
          <Row >
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="SGroupDesc">
                <Form.Label className="block text-gray-700 font-medium">S Group Description</Form.Label>
                <Form.Control
                  className='my-1'
                  type="text"
                  name="SGroupDesc"
                  {...register('SGroupDesc')}
                  placeholder="Enter Sub-group name"
                />
                {errors.SGroupDesc && <span className="text-danger h-0">{errors.SGroupDesc.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="OPENING_Q">
                <Form.Label className="block text-gray-700 font-medium">Opening Quantity</Form.Label>
                <Form.Control
                  type="number"
                  step='0.01'
                  defaultValue="0.00"
                  name="OPENING_Q"
                  {...register('OPENING_Q')}
                  placeholder="Enter Account Number"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="OPENING_V">
                <Form.Label className="block text-gray-700 font-medium">Opening Value</Form.Label>
                <Form.Control
                  type="number"
                  name="OPENING_V"
                  step='0.01'
                  defaultValue="0.00"
                  {...register('OPENING_V')}
                  placeholder="Enter Opening Value"
                />
                {errors.OPENING_V && <span className="text-danger h-0">{errors.OPENING_V.message}</span>}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant='danger'
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-4 py-2"
          >
            {isSubmitting ? 'Creating' : 'Create'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateProduct;
