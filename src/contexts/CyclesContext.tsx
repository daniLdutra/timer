import { createContext, ReactNode, useReducer, useState } from 'react';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
  amountSecondsPassed: number;
  setAmountSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycleId: string | null;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // setCycles funciona como método para disparar a action e não mais para alterar o valor de cycles, alterado nome para dispatch.
  //state: irá receber tanto o valor do novo ciclo, quanto o ciclo ativo, ambos serão controlados pelo mesmo estado. Sem a necessidade de vários estados dentro do componente.
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      if (action.type === 'ADD_NEW_CYCLE') {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        };
      }
      if (action.type === 'INTERRUPT_CURRENT_CYCLE') {
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, interruptedDate: new Date() };
            } else {
              return cycle;
            }
          }),
          activeCycleId: null,
        };
      }
      if(action.type === 'MARK_CURRENT_CYCLE_AS_FINISHED'){
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCycleId) {
              return { ...cycle, finishedDate: new Date() };
            } else {
              return cycle;
            }
          }),
          activeCycleId: null,
        };
      }
      return state;
    },
    {
      cycles: [],
      activeCycleId: null,
    }
  );

  //novo estado criado irá armazenar a quantidade de segundos que já se passaram, desde que o ciclo foi criado
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { cycles, activeCycleId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    });
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    });
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setAmountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
