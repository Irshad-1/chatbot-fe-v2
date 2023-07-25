import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Input,
  useToast,
  FormErrorMessage, CircularProgress
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import API from "../Utils/axios";
import { useDispatch, useSelector } from 'react-redux';
import { LoaderAction } from "../Redux/Loader";

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const handleLogin = async ({ email, password }) => {
    try {

      let res = await API.post("login", { email, password });

      if (res.data.token) {
        sessionStorage.setItem('intechnology', res.data.token);
        toast({
          title: 'Log In successful',
          description: 'Logged In successfully redirecting to homepage',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        navigate('../');
      } else {
        toast({
          title: 'Invalid details',
          description: 'Wrong Login Details',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {

      console.log(error);
    }
  };
  React.useEffect(() => {
    let token = sessionStorage.getItem('intechnology');
    if (token) navigate('../');
  }, []);
  return (
    <Box
      width="600px"
      margin="50px auto"
      backgroundColor="#adf7c1"
      padding="40px"
      borderRadius="10px"
    >
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          handleLogin(values);
        }}
        validationSchema={Yup.object({
          email: Yup.string().email().required('Required'),
          password: Yup.string().required('Required'),
        })}
      >
        {({ handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit}>
            <FormControl
              padding="20px 0px"
              isInvalid={errors.email && touched.email}
            >
              <FormLabel>Email</FormLabel>
              <Field
                as={Input}
                variant="filled"
                type="text"
                name="email"
                placeholder="Enter email"
                _focusVisible={{ backgroundColor: "white" }}
                isInvalid={errors.email && touched.email}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              padding="20px 0px"
              isInvalid={errors.password && touched.password}
            >
              <FormLabel>Password</FormLabel>
              <Field
                as={Input}
                variant="filled"
                _focusVisible={{ backgroundColor: "white" }}
                type="password"
                name="password"
                placeholder="Enter password"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Box display="flex" justifyContent="space-around">
              <Button colorScheme="green" type="submit">
                Login
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  navigate('../signup');
                }}
              >
                Create an Account
              </Button>
            </Box>

          </form>
        )}
      </Formik>
    </Box>
  );
};
