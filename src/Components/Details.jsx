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
  CircularProgress, Spinner
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
  const [chatHistory, setChatHistory] = useState([]);
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
      setChatHistory([]);
      const time = new Date();
      let res = await API.post('/send-message', { message });
      dispatch(LoaderAction.loaderStop());
      setChatHistory([{ chatType: "SA", timestamp: generateTime(time), chatItem: { ans: res.data.result } }])
      if (res?.data?.action) {
        await automatedFireAction(res?.data?.action);
      }
      if (res?.data?.linkedQuestion) {
        setChatHistory((prev) => { return [...prev, { chatType: 'SQ', chatItem: res.data.linkedQuestion, timestamp: generateTime(time) }] });
      }

    } catch (error) {
      dispatch(LoaderAction.loaderStop());
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
  const automatedFireAction = async (actionId) => {
    try {
      dispatch(LoaderAction.loaderStart());
      let res = await API.post('/fire-action', { actionId });
      dispatch(LoaderAction.loaderStop());
      const time = new Date();
      setChatHistory((prev) => {
        return [...prev, { chatType: "SA", timestamp: generateTime(time), chatItem: { ans: res.data.message } }]
      });
      if (res.data?.linkedQuestion) {
        setChatHistory((prev) => {
          return [...prev, { chatType: "SQ", chatItem: res.data?.linkedQuestion, timestamp: generateTime(time) }]
        });
      }
    } catch (error) {
      dispatch(LoaderAction.loaderStop());
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
  const fireAction = async (actionId, linkedQuestion) => {
    try {
      dispatch(LoaderAction.loaderStart());
      let res = await API.post('/fire-action', { actionId, linkedQuestion });
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
      if (res.data?.linkedQuestion) {
        setChatHistory((prev) => {
          return [...prev, { chatType: "SQ", chatItem: res.data?.linkedQuestion, timestamp: generateTime(time) }]
        });
      }
    } catch (error) {
      dispatch(LoaderAction.loaderStop());
      Swal.fire({
        title: 'Failed!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  const generateTime = (time) => {
    return time.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  }
  return (
    <>
      <Box display="flex" justifyContent="flex-end" marginRight="50px" alignItems="center" position="absolute" right="0" top="25">

        <Text fontSize='xl' cursor="pointer" paddingRight="10px" >{`Hi ${data?.firstName || ""}`}</Text>
        <Button
          backgroundColor={'#EE6CAC'}
          color={'white'}
          fontStyle={'italic'}
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
          bg="#ECECEC"
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
          <Button backgroundColor={'#44A6F5'} color='white' fontSize="30px" type="submit">
            <AiOutlineSend />
          </Button>

        </Box>
        <Box width="60%" m="auto" >
          {chatHistory.length > 0 && chatHistory?.map((item) => {
            if (item?.chatType === "SA") {
              return (<Box display="flex" justifyContent="space-between" backgroundColor={'#f0f0f2'} maxWidth={'100%'} width={'max-content'} rounded="md" padding={'20px'}><Text fontSize="l">{item.chatItem.ans}</Text>
                <Text fontSize="sm" marginLeft='10px' alignSelf={'end'} whiteSpace={'nowrap'}>{item.timestamp}</Text>
              </Box>)
            }
            else if (item?.chatType === "SQ") {
              return (<Box display="flex" width={'max-content'} justifyContent={'space-between'} maxWidth={'100%'} marginBottom={'15px'} backgroundColor={'#f0f0f2'} rounded="md" padding={'20px'} marginTop={'15px'}><Text fontSize="l" fontWeight="bold">{item?.chatItem?.question}</Text> <Text fontSize="sm" marginLeft='10px' alignSelf={'end'} whiteSpace={'nowrap'}>{item.timestamp}</Text>
              </Box>)
            }
            else if (item?.chatType === "UA") {
              return (<Box display={'flex'} justifyContent={'flex-end'}>
                <Box display="flex" marginBottom={'10px'} alignItems={'center'} backgroundColor={'#dcefff'} rounded="md" padding={'20px'} width={'max-content'} ><Text fontSize="l" fontWeight={'bold'}>{item?.chatItem?.ans}</Text>
                  <Text fontSize="sm" marginLeft='10px' alignSelf={'end'}>{item.timestamp}</Text>
                </Box>
              </Box>)
            }
          }
          )}
          {!loader && chatHistory?.length > 0 &&
            chatHistory[chatHistory.length - 1].chatType == "SQ" && (<Box display={'flex'} justifyContent={'flex-end'} marginBottom={'20px'}>
              <Button backgroundColor={'#44A6F5'} color='white' marginRight={'20px'} padding={'0px 30px'} onClick={() => { fireAction(chatHistory[chatHistory?.length - 1].chatItem?.action, chatHistory[chatHistory?.length - 1].chatItem?.linkedQuestion) }}>
                Yes
              </Button>
              <Button backgroundColor={'#EE6CAC'} padding={'0px 30px'}
                color={'white'} onClick={() => {
                  const time = new Date();
                  setChatHistory((prev) => {
                    return [...prev, {
                      chatType: "UA", timestamp: generateTime(time), chatItem: {
                        ans: "No"
                      }
                    }]
                  }
                  );
                }}>No</Button></Box>
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

          {loader && <Box display={'flex'} justifyContent={'center'}> <Spinner size={'xl'} /></Box>}

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
