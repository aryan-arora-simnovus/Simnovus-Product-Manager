import React, { createContext, useContext, useState } from "react";

type Nullable<T> = T | null;

interface DashboardState {
  ueSimOpen: boolean;
  setUeSimOpen: (v: boolean) => void;
  networkEmulatorOpen: boolean;
  setNetworkEmulatorOpen: (v: boolean) => void;
  ueSimIP: string;
  setUeSimIP: (v: string) => void;
  ueSimNumberOfUEs: string;
  setUeSimNumberOfUEs: (v: string) => void;
  networkEmulatorIP: string;
  setNetworkEmulatorIP: (v: string) => void;
  networkEmulatorUsername: string;
  setNetworkEmulatorUsername: (v: string) => void;
  networkEmulatorPassword: string;
  setNetworkEmulatorPassword: (v: string) => void;
  ueSimConnected: Nullable<boolean>;
  setUeSimConnected: (v: Nullable<boolean>) => void;
  networkEmulatorConnected: Nullable<boolean>;
  setNetworkEmulatorConnected: (v: Nullable<boolean>) => void;
  ueSimLoading: boolean;
  setUeSimLoading: (v: boolean) => void;
  networkEmulatorLoading: boolean;
  setNetworkEmulatorLoading: (v: boolean) => void;
  ueSimSDR50: Nullable<number>;
  setUeSimSDR50: (v: Nullable<number>) => void;
  ueSimSDR100: Nullable<number>;
  setUeSimSDR100: (v: Nullable<number>) => void;
  networkEmulatorSDR50: Nullable<number>;
  setNetworkEmulatorSDR50: (v: Nullable<number>) => void;
  networkEmulatorSDR100: Nullable<number>;
  setNetworkEmulatorSDR100: (v: Nullable<number>) => void;
  ueSimTestsRunning: boolean;
  setUeSimTestsRunning: (v: boolean) => void;
  networkEmulatorTestsRunning: boolean;
  setNetworkEmulatorTestsRunning: (v: boolean) => void;
  ueSimTestProgress: Nullable<string>;
  setUeSimTestProgress: (v: Nullable<string>) => void;
  networkEmulatorTestProgress: Nullable<string>;
  setNetworkEmulatorTestProgress: (v: Nullable<string>) => void;
  ueSimTestResults: Nullable<any[]>;
  setUeSimTestResults: (v: Nullable<any[]>) => void;
  networkEmulatorTestResults: Nullable<any[]>;
  setNetworkEmulatorTestResults: (v: Nullable<any[]>) => void;
  ueSimBuildLoading: boolean;
  setUeSimBuildLoading: (v: boolean) => void;
  ueSimBuildStatus: Nullable<string>;
  setUeSimBuildStatus: (v: Nullable<string>) => void;
  ueSimBuildError: Nullable<string>;
  setUeSimBuildError: (v: Nullable<string>) => void;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ueSimOpen, setUeSimOpen] = useState(true);
  const [networkEmulatorOpen, setNetworkEmulatorOpen] = useState(false);
  const [ueSimIP, setUeSimIP] = useState("");
  const [ueSimNumberOfUEs, setUeSimNumberOfUEs] = useState("");
  const [networkEmulatorIP, setNetworkEmulatorIP] = useState("");
  const [networkEmulatorUsername, setNetworkEmulatorUsername] = useState("");
  const [networkEmulatorPassword, setNetworkEmulatorPassword] = useState("");
  const [ueSimConnected, setUeSimConnected] = useState<Nullable<boolean>>(null);
  const [networkEmulatorConnected, setNetworkEmulatorConnected] = useState<Nullable<boolean>>(null);
  const [ueSimLoading, setUeSimLoading] = useState(false);
  const [networkEmulatorLoading, setNetworkEmulatorLoading] = useState(false);
  const [ueSimSDR50, setUeSimSDR50] = useState<Nullable<number>>(null);
  const [ueSimSDR100, setUeSimSDR100] = useState<Nullable<number>>(null);
  const [networkEmulatorSDR50, setNetworkEmulatorSDR50] = useState<Nullable<number>>(null);
  const [networkEmulatorSDR100, setNetworkEmulatorSDR100] = useState<Nullable<number>>(null);
  const [ueSimTestsRunning, setUeSimTestsRunning] = useState(false);
  const [networkEmulatorTestsRunning, setNetworkEmulatorTestsRunning] = useState(false);
  const [ueSimTestProgress, setUeSimTestProgress] = useState<Nullable<string>>(null);
  const [networkEmulatorTestProgress, setNetworkEmulatorTestProgress] = useState<Nullable<string>>(null);
  const [ueSimTestResults, setUeSimTestResults] = useState<Nullable<any[]>>(null);
  const [networkEmulatorTestResults, setNetworkEmulatorTestResults] = useState<Nullable<any[]>>(null);
  const [ueSimBuildLoading, setUeSimBuildLoading] = useState(false);
  const [ueSimBuildStatus, setUeSimBuildStatus] = useState<Nullable<string>>(null);
  const [ueSimBuildError, setUeSimBuildError] = useState<Nullable<string>>(null);

  return (
    <DashboardContext.Provider
      value={{
        ueSimOpen,
        setUeSimOpen,
        networkEmulatorOpen,
        setNetworkEmulatorOpen,
        ueSimIP,
        setUeSimIP,
        ueSimNumberOfUEs,
        setUeSimNumberOfUEs,
        networkEmulatorIP,
        setNetworkEmulatorIP,
        networkEmulatorUsername,
        setNetworkEmulatorUsername,
        networkEmulatorPassword,
        setNetworkEmulatorPassword,
        ueSimConnected,
        setUeSimConnected,
        networkEmulatorConnected,
        setNetworkEmulatorConnected,
        ueSimLoading,
        setUeSimLoading,
        networkEmulatorLoading,
        setNetworkEmulatorLoading,
        ueSimSDR50,
        setUeSimSDR50,
        ueSimSDR100,
        setUeSimSDR100,
        networkEmulatorSDR50,
        setNetworkEmulatorSDR50,
        networkEmulatorSDR100,
        setNetworkEmulatorSDR100,
        ueSimTestsRunning,
        setUeSimTestsRunning,
        networkEmulatorTestsRunning,
        setNetworkEmulatorTestsRunning,
        ueSimTestProgress,
        setUeSimTestProgress,
        networkEmulatorTestProgress,
        setNetworkEmulatorTestProgress,
        ueSimTestResults,
        setUeSimTestResults,
        networkEmulatorTestResults,
        setNetworkEmulatorTestResults,
        ueSimBuildLoading,
        setUeSimBuildLoading,
        ueSimBuildStatus,
        setUeSimBuildStatus,
        ueSimBuildError,
        setUeSimBuildError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardState => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};

export default DashboardContext;
