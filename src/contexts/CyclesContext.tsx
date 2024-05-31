import { ReactNode, createContext, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";


interface CreateCycleData {
    task: string;
    minutesAmount: number;
}


interface CyclesContextType {
    cycles: Cycle[],
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSeconsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}



export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode,
}



export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    }, (initialState) => {
        const storedStateAsJSON = localStorage.getItem('@timer:cycles-state-1.0.0');
        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON);
        }
        return initialState;
    });

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);


    const [amountSeconsPassed, setAmountSeconsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate),
            );
        }

        return 0;
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem('@timer:cycles-state-1.0.0', stateJSON);
    }, [cyclesState])


    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function setSecondsPassed(seconds: number) {
        setAmountSeconsPassed(seconds)
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle));
        setAmountSeconsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch(interruptCycleAction());
    }


    return (
        <CyclesContext.Provider value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSeconsPassed,
            setSecondsPassed,
            createNewCycle,
            interruptCurrentCycle,
            cycles,
        }}>
            {children}
        </CyclesContext.Provider>
    )
}
