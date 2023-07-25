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
  CircularProgress
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../Utils/axios';
import Swal from 'sweetalert2';
import { AiOutlineSend } from "react-icons/ai";
import { LoaderAction } from "../Redux/Loader";
import { useSelector, useDispatch } from 'react-redux';

export const Details = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [tickets, setTickets] = useState([]);
  const [isProjectManager, setIsProjectManager] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [linkedQuestion, setLinkedQuestion] = useState({});
  const dispatch = useDispatch();
  const loader = useSelector(state => state.loader.loader);


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
      dispatch(LoaderAction.loaderStart());
      setChatResponse('');
      setChatHistory([]);
      const time = new Date();
      let res = await API.post('/send-message', { message });
      dispatch(LoaderAction.loaderStop());
      setChatResponse(res.data.result);
      setChatHistory([{ chatType: "SA", timestamp: generateTime(time), chatItem: { ans: res.data.result } }])
      if (res?.data?.linkedQuestion) {
        setLinkedQuestion(res.data.linkedQuestion);
        setChatHistory((prev) => { return [...prev, { chatType: 'SQ', chatItem: res.data.linkedQuestion, timestamp: generateTime(time) }] });
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
      dispatch(LoaderAction.loaderStart());
      let res = await API.post('/fire-action', { actionId });
      dispatch(LoaderAction.loaderStop());
      const time = new Date();
      setChatHistory((prev) => {
        return [...prev, {
          chatType: "UA", timestamp: generateTime(time), chatItem: {
            ans: "Yes"
          }
        }]
      }
      );
      setChatHistory((prev) => {
        return [...prev, { chatType: "SA", timestamp: generateTime(time), chatItem: { ans: res.data.message } }]
      });
      if (linkedQuestion?.linkedQuestion) {

        setChatHistory((prev) => {
          return [...prev, { chatType: "SQ", chatItem: linkedQuestion?.linkedQuestion, timestamp: generateTime(time) }]
        });
        setLinkedQuestion({});
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

  const generateTime = (time) => {
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  }
  return (
    <>
      <Box display="flex" justifyContent="flex-end" marginRight="50px" alignItems="center" position="absolute" right="0" top="25">

        <Text fontSize='xl' color="#2B4865" cursor="pointer" paddingRight="10px">{`Hi ${data?.firstName || ""}`}</Text>
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
          width="60%"
          margin="40px auto"
          boxShadow="lg"
          p="6"
          rounded="md"
          bg="#d9d9d9"
          display="flex"
        >
          <Input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            type="text"
            placeholder="Enter your query here"
            bg="white"
            marginRight={'20px'}
          />
          <Button colorScheme="green" fontSize="30px" type="submit">
            <AiOutlineSend />
          </Button>

        </Box>
        {loader ? <Box display="flex" justifyContent="center">
          <CircularProgress
            isIndeterminate
            color="blue.600"
            size="200px"
            thickness="5px"
          />
        </Box> : chatHistory.length > 0 && (<Box width="60%" m="auto" bg="#DDE6ED" padding="20px" rounded="md">

          {chatHistory.length > 0 && chatHistory?.map((item) => {
            if (item?.chatType === "SA") {
              return (<Box display="flex" justifyContent="space-between"><Text fontSize="xl">{item.chatItem.ans}</Text>
                <Text fontSize="sm">{item.timestamp}</Text>
              </Box>)
            }
            else if (item?.chatType === "SQ") {
              return (<Box display="flex" justifyContent="space-between"><Text fontSize="xl" color='rgb(0, 123, 255)	' fontWeight="bold">{item?.chatItem?.question}</Text> <Text fontSize="sm">{item.timestamp}</Text>
              </Box>)
            }
            else if (item?.chatType === "UA") {
              return (<Box display="flex" justifyContent="space-between"><Text fontSize="xl">{item?.chatItem?.ans}</Text>
                <Text fontSize="sm">{item.timestamp}</Text>
              </Box>)
            }
          }
          )}
          {chatHistory?.length > 0 &&
            chatHistory[chatHistory.length - 1].chatType == "SQ" && (<>
              <Button colorScheme="green" onClick={() => { fireAction(chatHistory[chatHistory?.length - 1].chatItem?.action) }}>
                Yes
              </Button>
              <Button colorScheme="red" onClick={() => {
                const time = new Date();
                setChatHistory((prev) => {
                  return [...prev, {
                    chatType: "UA", timestamp: generateTime(time), chatItem: {
                      ans: "No"
                    }
                  }]
                }
                );
              }}>No</Button></>
            )
          }



          {/* <Text fontSize="xl">{chatResponse}</Text>
          {isBotQuestion && (<><Text fontSize="xl" color='rgb(0, 123, 255)	' fontWeight="bold">{botQuestion?.question}</Text>
            <Button colorScheme="green" onClick={() => { fireAction(botQuestion?.action) }}>
              Yes
            </Button>
            <Button colorScheme="red" onClick={() => {
              setIsBotQuestion(false);
            }}>No</Button></>)}
          {
            isBotQuestion &&
            <Text fontSize="xl">{botResponse}</Text>
          }
          {isAnotherBotQuestion && (<><Text fontSize="xl" color='rgb(0, 123, 255)	' fontWeight="bold">{anotherBotQuestion?.question}</Text>
            <Button colorScheme="green" onClick={() => { fireAction(anotherBotQuestion?.action) }}>
              Yes
            </Button>
            <Button colorScheme="red" onClick={() => {
              setIsBotQuestion(false);
            }}>No</Button></>)} */}
        </Box>)}

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
