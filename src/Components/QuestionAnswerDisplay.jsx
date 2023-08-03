import React, { useEffect, useState } from 'react';
import {
  Input,
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Switch,
  Select,
  FormLabel,
} from '@chakra-ui/react';
import { AiFillPlusCircle } from "react-icons/ai";
import API from '../Utils/axios';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';

const QuestionAnswerDisplay = () => {
  const [allQuestionAnswer, setAllQuestionAnswer] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selctedDepartment, setSelectedDepartment] = useState("");
  const [active, setActive] = useState(false);
  useEffect(() => {
    getAllQuestionAnswer();
    getDepartments();
  }, [])
  const getAllQuestionAnswer = async () => {
    try {
      const res = await API.get('/get-all-question');
      res?.data?.forEach((item) => {
        setActive((prev) => {
          return {
            ...prev, [`${item.questionId._id}`]: item?.questionId?.status
          }
        })
      })
      setAllQuestionAnswer(res?.data);
      setFilteredData(res?.data);
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

  }
  const getDepartments = async () => {
    try {
      const res = await API.get('/get-all-department');
      setDepartments(res?.data);
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
  const filterData = (value) => {
    if (value === "" || value === null || value === undefined)
      setFilteredData(allQuestionAnswer);
    else {
      const data = allQuestionAnswer.filter((item) => {
        return item?.questionId?.departmentId._id === value
      })
      setFilteredData(data);
    }
  }
  const changeStatus = async (id) => {
    try {
      const res = await API.post('/change-status', {
        id
      });
      getAllQuestionAnswer();
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
    <Box>
      <Box width="90%" margin="auto" display="flex" justifyContent="space-between" alignItems={'center'}>
        <FormLabel>
          Filter by Department
          <Select placeholder='Select option' onChange={(e) => {
            setSelectedDepartment(e.target.value);
            filterData(e.target.value);
          }}>
            {departments.map((item) => {
              return (<option key={item?._id} value={item?._id}>{item?.departmentName}</option>)
            })}
          </Select>
        </FormLabel>
        <Button
          colorScheme={'blue'}
        ><AiFillPlusCircle />
          <NavLink to="/feed-question">Add Question answer</NavLink>
        </Button>
      </Box>

      <Box width="100%">

        <Table colorScheme="facebook" variant="striped">
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Question</Th>
              <Th>Answer</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((ele, index) => {
              return (
                <Tr key={ele._id}>
                  <Td>{index + 1}</Td>
                  <Td>{ele?.questionId?.question}</Td>
                  <Td>{ele?.answer}</Td>
                  <Td>{ele?.questionId?.departmentId?.departmentName}</Td>
                  <Td><Switch id='isChecked' isChecked={active?.[`${ele?.questionId._id}`]} onChange={() => {
                    setActive((prev) => {
                      return { ...prev, [`${ele?.questionId._id}`]: !prev?.[`${ele?.questionId._id}`] }
                    })
                    changeStatus(ele?.questionId._id);
                  }} /></Td>
                  {/* <Td>{ele?.questionId?.status ? "True" : "False"}</Td> */}
                  <Td>{ele?.isAction ? ele?.actionType : "NA"}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

    </Box>
  )
}

export default QuestionAnswerDisplay