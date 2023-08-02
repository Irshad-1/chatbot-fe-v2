import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast, FormErrorMessage, Select } from '@chakra-ui/react';
import { Formik, Field, Form } from "formik";
import { useNavigate } from 'react-router-dom';
import API from "../Utils/axios";

import * as Yup from 'yup';
import { getAllDepartments, getAllDesignation } from '../services/getMasterData';

export const Signup = () => {
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    useEffect(() => {
        getAllDepartments().then((res) => {
            setDepartments(res);
        });
        getAllDesignation().then((res) => {
            setDesignations(res);
        })
    }, [])
    const toast = useToast();
    const navigate = useNavigate();

    const handleSignUp = async ({ firstName, lastName, employeeId, department, designation, email, password }) => {
        try {
            let res = await API.post('/createuser', { firstName, lastName, employeeId, departmentId: department, designationId: designation, email, password });
            let data = res.data;
            if (data.message)
                toast({
                    title: 'Email already Exist',
                    description: "User already exist with this email ID",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            else {
                toast({
                    title: 'Account created',
                    description: "Account created successfully going to login Page",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                navigate('../login');
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Box width="600px" margin="50px auto" backgroundColor="#9BCDD2" padding="40px" borderRadius="10px">
            <Formik initialValues={{
                firstName: "",
                lastName: "",
                employeeId: "",
                email: "",
                password: "",
                department: "",
                designation: "",
            }} onSubmit={(values) => { handleSignUp(values) }} validationSchema={Yup.object({
                firstName: Yup.string().required('Required'),
                lastName: Yup.string().required('Required'),
                employeeId: Yup.string().required('Required'),
                department: Yup.string().required('Required'),
                designation: Yup.string().required('Required'),
                email: Yup.string().email().required('Required'),
                password: Yup.string().required('Required'),
            })}>
                {({ handleSubmit, errors, touched }) => {

                    return (

                        <Form>
                            <FormControl padding="20px 0px" isInvalid={errors.firstName && touched.firstName}>
                                <FormLabel>First Name</FormLabel>
                                <Field type="text" name="firstName" placeholder='Enter First Name' variant="filled" _focusVisible={{ backgroundColor: "white" }} as={Input} />
                                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                            </FormControl>
                            <FormControl padding="20px 0px" isInvalid={errors.lastName && touched.lastName}>
                                <FormLabel>Last Name</FormLabel>
                                <Field type="text" name="lastName" placeholder='Enter Last Name' variant="filled" _focusVisible={{ backgroundColor: "white" }} as={Input} />
                                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                            </FormControl>
                            <FormControl padding="20px 0px">
                                <FormLabel>Department</FormLabel>
                                <Field name="department" as={Select} variant="filled" _focusVisible={{ backgroundColor: "white" }} >
                                    <option value="">Choose your option</option>
                                    {departments.length > 0 && departments.map((item) => {
                                        return (<option value={item._id} key={item._id}>
                                            {item.departmentName}
                                        </option>)
                                    })}
                                </Field>
                            </FormControl>
                            <FormControl padding="20px 0px">
                                <FormLabel>Designation</FormLabel>
                                <Field name="designation" as={Select} variant="filled" _focusVisible={{ backgroundColor: "white" }} >
                                    <option value="">Choose your option</option>
                                    {designations.length > 0 && designations.map((item) => {
                                        return (<option value={item._id} key={item._id}>
                                            {item.designationName}
                                        </option>)
                                    })}
                                </Field>
                            </FormControl>
                            <FormControl padding="20px 0px" isInvalid={errors.employeeId && touched.employeeId}>
                                <FormLabel>Employee ID</FormLabel>
                                <Field as={Input} variant="filled" _focusVisible={{ backgroundColor: "white" }} type="text" name="employeeId" placeholder='Enter Employee ID' />
                                <FormErrorMessage>{errors.employeeId}</FormErrorMessage>
                            </FormControl>
                            <FormControl padding="20px 0px" isInvalid={errors.email && touched.email}>
                                <FormLabel>Email</FormLabel>
                                <Field as={Input} variant="filled" _focusVisible={{ backgroundColor: "white" }} type="text" name="email" placeholder='Enter email' />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                            <FormControl padding="20px 0px" isInvalid={errors.password && touched.password}>
                                <FormLabel>Password</FormLabel>
                                <Field as={Input} variant="filled" _focusVisible={{ backgroundColor: "white" }} type="password" name="password" placeholder='Enter password' />
                                <FormErrorMessage>{errors.password}</FormErrorMessage>

                            </FormControl>
                            <Button colorScheme="blue" type="submit">Sign Up</Button>
                        </Form>

                    )
                }}
            </Formik>
        </Box>
    )
}