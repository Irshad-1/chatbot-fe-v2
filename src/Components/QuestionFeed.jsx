import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, useToast, FormErrorMessage, Select, Switch } from '@chakra-ui/react';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import { getAllDepartments, getAllDesignation, getAllActions, getAllSystemQuestions } from '../services/getMasterData';
import Swal from 'sweetalert2';
import API from '../Utils/axios';

const QuestionFeed = () => {
  const [departments, setDepartments] = useState([]);
  const [actions, setActions] = useState([]);
  const [systemQuestion, setSystemQuestion] = useState([]);

  useEffect(() => {
    getAllDepartments().then((res) => {
      setDepartments(res);
    });
    getAllActions().then((res) => { setActions(res); });
    getAllSystemQuestions().then((res) => { setSystemQuestion(res); });
  }, [])
  const handleSubmit = async ({ question, answer, department, status, isAction, action, isSystemQuestion, linkedQuestion }, helpers) => {
    console.log("I am action ", action);
    try {
      await API.post('/add-question-answer', {
        question, answer, departmentId: department, status: status == "active" ? true : false,
        isSystemQuestion: isSystemQuestion == "yes" ? true : false,
        isAction: isAction === "yes" ? true : false,
        action,
        linkedQuestion
      });
      helpers.resetForm();
      Swal.fire({
        title: "Success",
        text: "Data added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  return (
    <Box width="1000px" margin="50px auto" backgroundColor="#9BCDD2" padding="40px" borderRadius="10px">
      <Formik initialValues={{
        question: "",
        answer: "",
        status: "active",
        department: "",
        isAction: "yes",
        action: "",
        isSystemQuestion: "no",
        linkedQuestion: "",
      }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          question: Yup.string().required('Required'),
          department: Yup.string().required('Required'),
        })}>
        {({ values, errors, touched, setFieldValue }) => {
          return (

            <Form>
              <FormControl padding="20px 0px">
                <FormLabel>Is System Question ?</FormLabel>
                <Box display="flex">
                  <Switch id='isChecked' isChecked={values?.isSystemQuestion === "yes" ? true : false} onChange={() => {
                    if (values?.isSystemQuestion === "yes") {
                      setFieldValue('isSystemQuestion', 'no');
                    }
                    else {
                      setFieldValue('isSystemQuestion', 'yes');
                    }
                  }} />
                </Box>
              </FormControl>
              <FormControl padding="20px 0px" isInvalid={errors.question && touched.question}>
                <FormLabel>Question</FormLabel>
                <Field type="text" name="question" placeholder='Enter Question' variant="filled" _focusVisible={{ backgroundColor: "white" }} as={Input} />
                <FormErrorMessage>{errors.question}</FormErrorMessage>
              </FormControl>
              {values.isSystemQuestion !== "yes" && <FormControl padding="20px 0px" isInvalid={errors.answer && touched.answer}>
                <FormLabel>Answer</FormLabel>
                <Field type="text" name="answer" placeholder='Enter Answer' variant="filled" _focusVisible={{ backgroundColor: "white" }} as={Input} />
                <FormErrorMessage>{errors.answer}</FormErrorMessage>
              </FormControl>}
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
                <FormErrorMessage>{errors.department}</FormErrorMessage>
              </FormControl>
              <FormControl padding="20px 0px">
                <FormLabel>Status</FormLabel>
                <Box display="flex">
                  <FormLabel><Field type="radio" name="status" value="active" style={{ marginRight: "10px" }} />
                    Active</FormLabel>
                  <FormLabel><Field type="radio" name="status" value="inactive" style={{ marginRight: "10px" }} />
                    Inactive</FormLabel>
                </Box>
              </FormControl>
              <FormControl marginRight="20px 0px">
                <FormLabel>Is there any Action?</FormLabel>

                <Box display="flex">
                  <FormLabel><Field type="radio" name="isAction" value="yes" style={{ marginRight: "10px" }} />
                    Yes</FormLabel>
                  <FormLabel><Field type="radio" name="isAction" value="no" style={{ marginRight: "10px" }} />
                    No</FormLabel>
                </Box>
              </FormControl>
              {
                values.isAction === "yes" && (
                  <FormControl padding="20px 0px" isInvalid={errors.action && touched.action}>
                    <FormLabel>Action Type</FormLabel>
                    <Field name="action" as={Select} variant="filled" _focusVisible={{ backgroundColor: "white" }} >
                      <option value="">Choose your option</option>
                      {actions.length > 0 && actions.map((item) => {
                        return (<option value={item._id} key={item._id}>
                          {item.actionName}
                        </option>)
                      })}
                    </Field>
                    <FormErrorMessage>{errors.action}</FormErrorMessage>
                  </FormControl>
                )
              }
              <FormControl padding="20px 0px">
                <FormLabel>Follow-up Question</FormLabel>
                <Field name="linkedQuestion" as={Select} variant="filled" _focusVisible={{ backgroundColor: "white" }} >
                  <option value="">Choose your option</option>
                  {systemQuestion.length > 0 && systemQuestion.map((item) => {
                    return (<option value={item._id} key={item._id}>
                      {item.question}
                    </option>)
                  })}
                </Field>
                <FormErrorMessage>{errors.linkedQuestion}</FormErrorMessage>
              </FormControl>

              <Button colorScheme="blue" type="submit">Submit</Button>
            </Form>

          )
        }}
      </Formik>
    </Box>
  )
}

export default QuestionFeed