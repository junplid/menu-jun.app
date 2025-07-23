import { createContext, Dispatch, SetStateAction } from "react";

interface IFlowContextProps {
  headerOpen: boolean;
  setHeaderOpen: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPrivateContext = createContext({} as IFlowContextProps);
