import React, {
  useEffect,
  useMemo,
  useReducer,
  useContext,
  createContext,
} from "react";
import Layout from "components/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Text,
  Spacer,
  Button,
  Box,
} from "@chakra-ui/react";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const initialState = {
  counterInfo: {
    1: {
      name: "Amy",
      processing: null,
      processed: [],
      id: "1",
    },
    2: {
      name: "Bob",
      processing: null,
      processed: [],
      id: "2",
    },
    3: {
      name: "Cory",
      processing: null,
      processed: [],
      id: "3",
    },
    4: {
      name: "Dora",
      processing: null,
      processed: [],
      id: "4",
    },
  },
  countersOrder: ["1", "2", "3", "4"],
  idleCounters: ["1", "2", "3", "4"],
  currentNum: 0,
  totalNumber: 0,
};

const CounterContext = createContext();
const { Provider } = CounterContext;

const reducer = (state, { type, payload }) => {
  const { counterInfo, countersOrder, idleCounters, currentNum, totalNumber } =
    state;

  switch (type) {
    case "next":
      return {
        ...state,
        totalNumber: totalNumber + 1,
      };
    case "assign": {
      const counterId = idleCounters[0];
      return {
        ...state,
        counterInfo: {
          ...counterInfo,
          [counterId]: {
            ...counterInfo[counterId],
            processing: currentNum + 1,
          },
        },
        currentNum: currentNum + 1,
        idleCounters: idleCounters
          .slice(1)
          .sort((a, b) => countersOrder.indexOf(a) - countersOrder.indexOf(b)),
      };
    }
    case "done": {
      const counterId = payload;
      return {
        ...state,
        counterInfo: {
          ...counterInfo,
          [counterId]: {
            ...counterInfo[counterId],
            processing: null,
            processed: [
              ...counterInfo[counterId].processed,
              counterInfo[counterId].processing,
            ],
          },
        },
        idleCounters: [...idleCounters, counterId].sort(
          (a, b) => countersOrder.indexOf(a) - countersOrder.indexOf(b)
        ),
      };
    }
    default:
      return state;
  }
};

const CounterRow = ({ counter }) => {
  const { dispatch } = useContext(CounterContext);

  useEffect(() => {
    if (counter.processing !== null) {
      setTimeout(
        () => dispatch({ type: "done", payload: counter.id }),
        getRandomInt(5000)
      );
    }
  }, [counter.id, counter.processing, dispatch]);

  return (
    <Tr>
      <Td>{counter.name}</Td>
      <Td>{counter.processing || "idle"}</Td>
      <Td>{counter.processed.join(",")}</Td>
    </Tr>
  );
};

const CounterTable = () => {
  const { counterState } = useContext(CounterContext);

  return (
    <Box overflowX="auto" my="10px">
      <Box
        borderRadius="5px"
        overflow="hidden"
        border="solid 1px lightgray"
        minW="max-content"
      >
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>counter</Th>
                <Th>processing</Th>
                <Th>processed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {counterState.countersOrder.map((id) => (
                <CounterRow key={id} counter={counterState.counterInfo[id]} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const HomePage = () => {
  const [counterState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { currentNum, totalNumber, idleCounters } = counterState;
    if ((currentNum !== totalNumber) & (idleCounters.length !== 0)) {
      dispatch({ type: "assign" });
    }
  }, [counterState, dispatch]);

  const memoizedValue = useMemo(() => {
    return {
      counterState,
      dispatch,
    };
  }, [counterState, dispatch]);

  return (
    <Layout>
      <Provider value={memoizedValue}>
        <Text as="b" fontSize="24px">
          Bank Counter
        </Text>
        <CounterTable />
        <HStack mt="2">
          <Text>
            waitings: {counterState.totalNumber - counterState.currentNum}
          </Text>
          <Spacer />
          <Button onClick={() => dispatch({ type: "next" })}>
            NEXT {counterState.totalNumber + 1}
          </Button>
        </HStack>
      </Provider>
    </Layout>
  );
};

export default HomePage;
