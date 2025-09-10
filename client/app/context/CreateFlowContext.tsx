"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type CreateFlowData = {
  file?: File;
  encryptedFile?: any;
  encryptionKey?: string;
  price?: number;
  title?: string;
  description?: string;
  image? : File
};

type CreateFlowContextType = {
  data: CreateFlowData;
  setData: (updates: Partial<CreateFlowData>) => void;
};

const CreateFlowContext = createContext<CreateFlowContextType | undefined>(undefined);

export function CreateFlowProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<CreateFlowData>({});

  const setData = (updates: Partial<CreateFlowData>) => {
    setDataState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <CreateFlowContext.Provider value={{ data, setData }}>
      {children}
    </CreateFlowContext.Provider>
  );
}

export function useCreateFlow() {
  const context = useContext(CreateFlowContext);
  if (!context) throw new Error("useCreateFlow must be used inside CreateFlowProvider");
  return context;
}
