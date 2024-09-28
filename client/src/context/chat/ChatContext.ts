import { createContext } from "react";

export interface IChatContext {

}

export const ChatContext = createContext<IChatContext | undefined>(undefined)