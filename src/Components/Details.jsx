import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../Utils/axios';
import Swal from 'sweetalert2';

export const Details = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [isProjectManager, setIsProjectManager] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [botQuestion, setBotQuestion] = useState("");
  const [isBotQuestion, setIsBotQuestion] = useState(false);


  async function getUser(token) {
    try {
      let res = await API.get('/getuser');
      setData(res.data);
      if (res.data.role === 'project manager') {
        setIsProjectManager(true);
        getUsersData(token);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleLogout = () => {
    sessionStorage.removeItem('intechnology');

    navigate('/login');
  };
  const getUsersData = async token => {
    try {
      let res = await API.get('/get-tickets');
      res = res.data;
      console.log(res);
      setTickets(res);
    } catch (error) {
      console.log(error);
    }
  };
  async function chat(message) {
    try {
      setChatResponse('');
      let res = await API.post('/send-message', { message });
      setChatResponse(res.data.result);
      if (res?.data?.linkedQuestion) {
        setIsBotQuestion(true);
        setBotQuestion(
          res?.data?.linkedQuestion
        );
      }
      else {
        setIsBotQuestion(false);
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  React.useEffect(() => {
    let token = sessionStorage.getItem('intechnology');

    if (!token) navigate('/login');
    else {
      getUser(token);
    }
  }, []);
  const fireAction = async (actionId) => {
    try {
      let res = await API.post('/fire-action', { actionId });
      console.log(res);
      setChatResponse(res.data.message);
      setIsBotQuestion(false);
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
    <>
      <Box display="flex" justifyContent="flex-end" marginRight="50px" alignItems="center" position="absolute" right="0" top="25">

        <Text fontSize='xl' color="#2B4865" cursor="pointer">{`Hi ${data?.firstName || ""}`}</Text>
        <Button
          colorScheme="red"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <form
        onSubmit={e => {
          e.preventDefault();
          chat(inputText);
        }}
      >
        {/* <Box width="40%" margin="40px auto" position="relative">

          <Heading size="lg" color="#256D85">{`Name:    ${data?.name || ''
            }`}</Heading>
          <Heading size="lg" color="#256D85">{`Age:    ${data?.age || ''
            }`}</Heading>
          <Heading size="lg" color="#256D85">{`Gender:    ${data?.gender || ''
            }`}</Heading>
          <Heading size="lg" color="#256D85">{`Role:    ${data?.role || ''
            }`}</Heading>
          <Heading size="lg" color="#256D85">{`Email:    ${data?.email || ''
            }`}</Heading>
        </Box> */}
        <Box
          width="40%"
          margin="40px auto"
          boxShadow="lg"
          p="6"
          rounded="md"
          bg="#d9d9d9"
        >
          <Input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            type="text"
            placeholder="Enter your query here"
            bg="white"
          />
          <Button colorScheme="green" type="submit">
            Send
          </Button>
        </Box>
        <Box width="60%" m="auto">
          <Text fontSize="xl">{chatResponse}</Text>
          {isBotQuestion && (<><Text fontSize="xl" color='rgb(0, 123, 255)	' fontWeight="bold">{`Chatbot:${botQuestion?.question}`}</Text>
            <Button colorScheme="green" onClick={() => { fireAction(botQuestion?.action) }}>
              Yes
            </Button>
            <Button colorScheme="red" onClick={() => {
              setChatResponse("");
              setIsBotQuestion(false);
            }}>No</Button></>)}
        </Box>

        {isProjectManager && (
          <Box width="80%" margin="40px auto">
            <Table colorScheme="facebook" variant="striped">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Name</Th>
                  <Th>Role</Th>
                  <Th>Email</Th>
                  <Th>Ticket</Th>
                  <Th>Department</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tickets.map((ele, index) => {
                  return (
                    <Tr key={ele._id}>
                      <Td>{index + 1}</Td>
                      <Td>{ele.userId.name}</Td>
                      <Td>{ele.userId.role}</Td>
                      <Td>{ele.userId.email}</Td>
                      <Td>{ele.question}</Td>
                      <Td>{ele.category}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </form>
    </>
  );
};
