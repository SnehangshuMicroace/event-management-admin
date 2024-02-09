import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup
  .object({
    CUSTCODE: yup.string(),
    NAME: yup.string().required('Name Must be between 3 to 50 charcters'),
    CPERSON: yup.string(),
    MOBPHONE: yup
    .string()
    .test('is-ten-digit-number', 'Mobile number must be a 10-digit number', (value) => {
      if (/^\d{10}$/.test(value) || /^\d{0}$/.test(value)) {
        return true;
      }
      return false;
    }),
    AGENTCODE: yup.string(),
    AGENTNAME: yup.string(),
    GSTIn: yup.string().test('is-fifteen-digit-number', 'GST must be 15 in characters', (value) => {
        return /^\w{15}$/.test(value) || /^\w{0}$/.test(value)
    }),
    ADDRESS: yup.string(),
    CITY: yup.string(),
    PINCODE:  yup.number().nullable().moreThan(0, "Pincode can't be negative").transform((_, val) => (val !== "" ? Number(val) : null)),
    STATE: yup.string(),
    COUNTRY: yup.string(),
    BankName: yup.string(),
    AccountNo: yup.number().nullable().moreThan(0, "Floor area cannot be negative").transform((_, val) => (val !== "" ? Number(val) : null)),
    BBranch: yup.string(),
    IFSC: yup.string(),
    Opening: yup.string(),
    CLimite: yup.number(),
  })
  .required();

function CreateCustomer({ onCreate, onCancel, customers, model }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isDirty, isValid, errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    data.CUST_VEND = model == 'customer' ? 'C' : 'V';
    onCreate(data)
  }

  useEffect(() => {
    const existingCustomertCodes = customers.map((customer) => customer.CUSTCODE);
    const maxCustomerCode = Math.max(...existingCustomertCodes, 0);
    const nextCode = Number(1 + maxCustomerCode);
    setValue('CUSTCODE', nextCode)
    setValue('CLimite', 0)
    setValue('Opening', 0)
  }, [customers]);

  return (
    <div className='bg-slate-200 p-4 drop-shadow rounded-xl'>
      <h2 className="text-xl font-semibold ">Create {model}</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className=' py-2'>
          <Row >
            <Col lg={3} md={6} sm={12} className="">
              <Form.Group controlId="CUSTCODE">
                <Form.Label className="block text-gray-700 font-medium">CUSTCODE</Form.Label>
                <Form.Control
                  type="text"
                  name="CUSTCODE"
                  disabled
                  {...register('CUSTCODE')}
                />
              </Form.Group>
            </Col>
            <Col lg={9} md={6} sm={12} className="">
              <Form.Group controlId="name">
                <Form.Label className="block text-gray-700 font-medium">Name</Form.Label>
                <Form.Control
                  type="name"
                  name="NAME"
                  {...register('NAME')}
                  placeholder="Enter Customer/vendor Name"
                />
                {errors.NAME && <span className="text-danger h-0">{errors.NAME.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="CPERSON">
                <Form.Label className="block text-gray-700 font-medium">Con Person</Form.Label>
                <Form.Control
                  type="text"
                  name="CPERSON"
                  {...register('CPERSON')}
                  placeholder="Enter Contact Person Name"
                />
                {errors.CPERSON && <span className="text-danger h-0">{errors.CPERSON.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="MOBPHONE">
                <Form.Label className="block text-gray-700 font-medium">Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="MOBPHONE"
                  {...register('MOBPHONE')}
                  placeholder="Enter Mobile Number"
                />
                {errors.MOBPHONE && <span className="text-danger h-0">{errors.MOBPHONE.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="AGENTCODE">
                <Form.Label className="block text-gray-700 font-medium">Agent Code</Form.Label>
                <Form.Control
                  type="text"
                  name="AGENTCODE"
                  {...register('AGENTCODE')}
                  placeholder="Enter Agent Code"
                />
                {errors.AGENTCODE && <span className="text-danger h-0">{errors.AGENTCODE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="AGENTNAME">
                <Form.Label className="block text-gray-700 font-medium">Agent Name</Form.Label>
                <Form.Control
                  type="string"
                  name="AGENTNAME"
                  {...register('AGENTNAME')}
                  placeholder="Enter Agent Name"
                />
                {errors.AGENTNAME && <span className="text-danger h-0">{errors.AGENTNAME.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={8} md={8} sm={12} className="">
              <Form.Group controlId="GSTIn">
                <Form.Label className="block text-gray-700 font-medium">Gst Number</Form.Label>
                <Form.Control
                  type="text"
                  name="GSTIn"
                  {...register('GSTIn')}
                  placeholder="Enter Gst number"
                />
                {errors.GSTIn && <span className="text-danger h-0">{errors.GSTIn.message}</span>}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className=' py-2'>
          <h2 className="text-lg font-semibold ">Address Details:</h2>
          <Row >
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="ADDRESS">
                <Form.Label className="block text-gray-700 font-medium">address</Form.Label>
                <Form.Control
                  as="textarea" rows={4}
                  className='my-1'
                  type="text"
                  name="ADDRESS"
                  placeholder="Enter ADDRESS"
                  {...register('ADDRESS')}
                />
                {errors.ADDRESS && <span className="text-danger h-0">{errors.ADDRESS.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Row>
                <Col sm={12}>
                  <Form.Group controlId="CITY">
                    <Form.Label className="block text-gray-700 font-medium">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="CITY"
                      {...register('CITY')}
                      placeholder="Enter City name"
                    />
                    {errors.CITY && <span className="text-danger h-0">{errors.CITY.message}</span>}
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group controlId="STATE">
                    <Form.Label className="block text-gray-700 font-medium">State</Form.Label>
                    <Form.Control
                      type="text"
                      name="STATE"
                      {...register('STATE')}
                      placeholder="Enter State name"
                    />
                    {errors.STATE && <span className="text-danger h-0">{errors.STATE.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="PINCODE">
                <Form.Label className="block text-gray-700 font-medium">Pin</Form.Label>
                <Form.Control
                  type="number"
                  name="PINCODE"
                  {...register('PINCODE')}
                  placeholder="Enter Pincode"
                />
                {errors.PINCODE && <span className="text-danger h-0">{errors.PINCODE.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="COUNTRY">
                <Form.Label className="block text-gray-700 font-medium">Country</Form.Label>
                <Form.Control
                  type="text"
                  name="COUNTRY"
                  {...register('COUNTRY')}
                  placeholder="Enter Country name"
                />
                {errors.COUNTRY && <span className="text-danger h-0">{errors.COUNTRY.message}</span>}
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className=' py-2'>
          <h2 className="text-lg font-semibold ">Bank Details:</h2>
          <Row >
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="BankName">
                <Form.Label className="block text-gray-700 font-medium">Bank Name</Form.Label>
                <Form.Control
                  className='my-1'
                  type="text"
                  name="BankName"
                  {...register('BankName')}
                  placeholder="Enter Bank Name"
                />
                {errors.BankName && <span className="text-danger h-0">{errors.BankName.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="AccountNo">
                <Form.Label className="block text-gray-700 font-medium">Account number</Form.Label>
                <Form.Control
                  type="number"
                  name="AccountNo"
                  {...register('AccountNo')}
                  placeholder="Enter Account Number"
                />
                </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="BBranch">
                <Form.Label className="block text-gray-700 font-medium">Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="BBranch"
                  {...register('BBranch')}
                  placeholder="Enter Branch name"
                />
                {errors.BBranch && <span className="text-danger h-0">{errors.BBranch.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="IFSC">
                <Form.Label className="block text-gray-700 font-medium">IFSC Code</Form.Label>
                <Form.Control
                  type="text"
                  name="IFSC"
                  {...register('IFSC')}
                  placeholder="Enter IFSC code"
                />
                {errors.IFSC && <span className="text-danger h-0">{errors.IFSC.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="Opening">
                <Form.Label className="block text-gray-700 font-medium">Opening Balance</Form.Label>
                <Form.Control
                  type="number"
                  name="Opening"
                  {...register('Opening')}
                  placeholder="Enter Opening Balance"
                />
                {errors.Opening && <span className="text-danger h-0">{errors.Opening.message}</span>}
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12} className="">
              <Form.Group controlId="CLimite">
                <Form.Label className="block text-gray-700 font-medium">Credit Limit</Form.Label>
                <Form.Control
                  type="number"
                  name="CLimite"
                  {...register('CLimite')}
                  placeholder="Set Credit Limit"
                />
                {errors.CLimite && <span className="text-danger h-0">{errors.CLimite.message}</span>}
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

export default CreateCustomer;
