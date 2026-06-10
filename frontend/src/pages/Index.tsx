import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/contexts/DashboardContext";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Index = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
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
  } = useDashboard();

  const connectToServer = async (
    ip: string,
    type: "ue_sim" | "network_emulator",
    setConnected: (value: boolean | null) => void,
    setLoading: (value: boolean) => void,
    setSDR50: (value: number | null) => void,
    setSDR100: (value: number | null) => void
  ) => {
    if (!ip) return;
    // Clear previous test state when connecting to a new server
    if (type === "ue_sim") {
      setUeSimTestProgress(null);
      setUeSimTestResults(null);
      setUeSimTestsRunning(false);
      setUeSimBuildStatus(null);
      setUeSimBuildError(null);
      try { delete (window as any).ueSimReportID } catch {}
    } else {
      setNetworkEmulatorTestProgress(null);
      setNetworkEmulatorTestResults(null);
      setNetworkEmulatorTestsRunning(false);
      try { delete (window as any).networkEmulatorReportID } catch {}
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverIP: ip, type }),
      });

      const data = await response.json();
      setConnected(data.connected);
      if (data.connected) {
        setSDR50(data.sdr50Count || 0);
        setSDR100(data.sdr100Count || 0);
      } else {
        setSDR50(null);
        setSDR100(null);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnected(false);
      setSDR50(null);
      setSDR100(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUeSimKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      connectToServer(ueSimIP, "ue_sim", setUeSimConnected, setUeSimLoading, setUeSimSDR50, setUeSimSDR100);
    }
  };

  const handleNetworkEmulatorKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      connectToServer(networkEmulatorIP, "network_emulator", setNetworkEmulatorConnected, setNetworkEmulatorLoading, setNetworkEmulatorSDR50, setNetworkEmulatorSDR100);
    }
  };

  const connectNetworkEmulator = async (
    ip: string,
    setConnected: (value: boolean | null) => void,
    setLoading: (value: boolean) => void,
    setSDR50: (value: number | null) => void,
    setSDR100: (value: number | null) => void
  ) => {
    if (!ip) return;
    // Clear previous network emulator test state when connecting
    setNetworkEmulatorTestProgress(null);
    setNetworkEmulatorTestResults(null);
    setNetworkEmulatorTestsRunning(false);
    try { delete (window as any).networkEmulatorReportID } catch {}

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/connect-network-emulator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverIP: ip }),
      });

      const data = await response.json();
      setConnected(data.connected);
      if (data.connected) {
        setSDR50(data.sdr50Count || 0);
        setSDR100(data.sdr100Count || 0);
      } else {
        setSDR50(null);
        setSDR100(null);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setConnected(false);
      setSDR50(null);
      setSDR100(null);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async (
    ip: string,
    type: "ue_sim" | "network_emulator",
    setTestsRunning: (value: boolean) => void,
    setProgress: (value: string | null) => void,
    setResults: (value: any[] | null) => void
  ) => {
    if (!ip) return;

    try {
      setTestsRunning(true);
      setProgress("Starting tests...");
      
      // Start tests and get session ID
      const response = await fetch(`${API_BASE_URL}/api/run-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverIP: ip, type }),
      });

      const data = await response.json();
      const sessionID = data.sessionID;
      
      if (!sessionID) {
        throw new Error("No session ID returned");
      }

      // Poll for progress
      let testCompleted = false;
      while (!testCompleted) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Poll every 500ms
        
        try {
          const progressResponse = await fetch(`${API_BASE_URL}/api/test-progress?id=${sessionID}`);
          const progressData = await progressResponse.json();
          
          // Update progress text with test count and current test name
          const progressText = `${progressData.completedTests}/${progressData.totalTests} - ${progressData.currentTest}`;
          setProgress(progressText);
          
          if (progressData.status === "completed") {
            testCompleted = true;
            setResults(progressData.cardResults || []);
            
            // Store report ID for download
            if (type === "ue_sim") {
              (window as any).ueSimReportID = progressData.reportID;
            } else {
              (window as any).networkEmulatorReportID = progressData.reportID;
            }
          }
        } catch (pollError) {
          console.error("Error polling progress:", pollError);
        }
      }
    } catch (error) {
      console.error("Test error:", error);
      setProgress(null);
      setResults([{ cardID: "Error", tests: [{ name: "Error", status: "fail", summary: "Failed to run tests" }], passed: 0, failed: 1 }]);
    } finally {
      setTestsRunning(false);
    }
  };

  const downloadReport = (reportID: string) => {
    if (!reportID) {
      alert("No report available");
      return;
    }
    window.location.href = `${API_BASE_URL}/api/download-report?id=${reportID}`;
  };

  const viewReport = (reportID: string) => {
    if (!reportID) {
      alert("No report available");
      return;
    }
    navigate(`/report?id=${reportID}`);
  };

  const buildProduct = async () => {
    if (!ueSimIP) {
      alert("Please connect to a UE Sim first");
      return;
    }

    setUeSimBuildLoading(true);
    setUeSimBuildStatus(null);
    setUeSimBuildError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/build-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ueServerIP: ueSimIP }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        setUeSimBuildStatus("success");
      } else {
        setUeSimBuildError(data.error || "Build product failed");
        setUeSimBuildStatus("error");
      }
    } catch (error) {
      console.error("Build product error:", error);
      setUeSimBuildError(error instanceof Error ? error.message : "Unknown error occurred");
      setUeSimBuildStatus("error");
    } finally {
      setUeSimBuildLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      const uploadedFileID = `uploaded_${Date.now()}`;
      localStorage.setItem(`report_${uploadedFileID}`, fileContent);
      navigate(`/report?id=${uploadedFileID}`);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read file");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-black">
      <Card className="w-full h-full bg-black/[0.96] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="flex flex-col md:flex-row h-full">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center max-h-full overflow-y-auto">
            {/* Upload Button */}
            <div className="mb-6 flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white font-semibold px-6 py-2 transition-all hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                 Upload Report
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Simnovus Product Builder
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg">
              Build, simulate, and test next-gen telecom solutions with powerful
              emulation tools designed for speed and precision.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* UE Sim Section */}
              <div className="flex-1">
                <Button
                  onClick={() => setUeSimOpen(!ueSimOpen)}
                  className={`w-full text-white font-semibold px-6 transition-all duration-200 ${
                    ueSimOpen
                      ? 'bg-orange-700 hover:bg-orange-800 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                      : 'bg-orange-600 hover:bg-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  }`}
                >
                  UE Sim
                </Button>
                {ueSimOpen && (
                  <div className="space-y-3 pt-3">
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Server IP Address
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter server IP"
                          value={ueSimIP}
                          onChange={(e) => setUeSimIP(e.target.value)}
                          onKeyPress={handleUeSimKeyPress}
                          disabled={ueSimLoading}
                          className="w-full bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          Number of UEs
                        </label>
                        <Select value={ueSimNumberOfUEs} onValueChange={setUeSimNumberOfUEs}>
                          <SelectTrigger className="w-full bg-black text-white border-neutral-700">
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-neutral-700">
                            <SelectItem value="32" className="text-white">32</SelectItem>
                            <SelectItem value="64" className="text-white">64</SelectItem>
                            <SelectItem value="128" className="text-white">128</SelectItem>
                            <SelectItem value="256" className="text-white">256</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {ueSimLoading && (
                      <p className="text-sm text-neutral-400 mt-2">Connecting...</p>
                    )}
                    {ueSimConnected === true && (
                      <div className="mt-2 space-y-3">
                        <div>
                          <p className="text-sm text-green-400">✓ Connected</p>
                          <p className="text-sm text-neutral-300">SDR50: <span className="text-green-400 font-semibold">{ueSimSDR50}</span></p>
                          <p className="text-sm text-neutral-300">SDR100: <span className="text-green-400 font-semibold">{ueSimSDR100}</span></p>
                        </div>
                        {ueSimSDR50 === 0 && ueSimSDR100 === 0 ? (
                          <p className="text-sm text-yellow-400">No SDR cards found!</p>
                        ) : (
                          <Button
                            onClick={() => runTests(ueSimIP, "ue_sim", setUeSimTestsRunning, setUeSimTestProgress, setUeSimTestResults)}
                            disabled={ueSimTestsRunning}
                            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 transition-all hover:bg-blue-700 disabled:opacity-50"
                          >
                            {ueSimTestsRunning ? "Running Tests..." : "Run Tests"}
                          </Button>
                        )}
                        {ueSimTestProgress && (
                          <div className="mt-4 space-y-3">
                            {/* Parse progress string like "3/6 - Test Name" */}
                            {(() => {
                              const parts = ueSimTestProgress.split(' - ');
                              const [completed, total] = parts[0].split('/').map(Number);
                              const testName = parts[1] || 'Running...';
                              const percentage = Math.round((completed / total) * 100);
                              
                              return (
                                <>
                                  {/* Progress bar with gradient */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-semibold text-neutral-300">{completed}/{total} Tests</span>
                                      <span className="text-sm font-bold text-blue-400">{percentage}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden border border-neutral-600">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out rounded-full"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-1">Current: <span className="text-cyan-300 font-semibold">{testName}</span></p>
                                  </div>
                                </>
                              );
                            })()}
                            {ueSimTestResults && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  onClick={() => viewReport((window as any).ueSimReportID)}
                                  className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 transition-all hover:bg-blue-700"
                                >
                                   View Report
                                </Button>
                                <Button
                                  onClick={() => downloadReport((window as any).ueSimReportID)}
                                  className="flex-1 bg-green-600 text-white font-semibold px-4 py-2 transition-all hover:bg-green-700"
                                >
                                   Download Report
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="mt-4">
                          <Button
                            onClick={buildProduct}
                            disabled={ueSimBuildLoading}
                            className="w-full bg-orange-600 text-white font-semibold px-4 py-2 transition-all hover:bg-orange-700 disabled:opacity-50"
                          >
                            {ueSimBuildLoading ? "Building Product..." : "Build Product"}
                          </Button>
                          {ueSimBuildStatus === "success" && (
                            <p className="text-sm text-green-400 mt-2">✓ Product built successfully!</p>
                          )}
                          {ueSimBuildStatus === "error" && ueSimBuildError && (
                            <p className="text-sm text-red-400 mt-2">✗ Error: {ueSimBuildError}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {ueSimConnected === false && (
                      <p className="text-sm text-red-400 mt-2">✗ Connection failed</p>
                    )}
                  </div>
                  </div>
                )}
              </div>

              {/* Network Emulator Section */}
              <div className="flex-1">
                <Button
                  onClick={() => setNetworkEmulatorOpen(!networkEmulatorOpen)}
                  className={`w-full text-white font-semibold px-6 transition-all duration-200 ${
                    networkEmulatorOpen
                      ? 'bg-orange-700 hover:bg-orange-800 shadow-[0_0_20px_rgba(249,115,22,0.6)]'
                      : 'bg-orange-600 hover:bg-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  }`}
                >
                  Network Emulator
                </Button>
                {networkEmulatorOpen && (
                  <div className="space-y-3 pt-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Server IP Address
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter server IP and press Enter"
                      value={networkEmulatorIP}
                      onChange={(e) => setNetworkEmulatorIP(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          connectNetworkEmulator(networkEmulatorIP, setNetworkEmulatorConnected, setNetworkEmulatorLoading, setNetworkEmulatorSDR50, setNetworkEmulatorSDR100);
                        }
                      }}
                      disabled={networkEmulatorLoading}
                      className="w-full bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                    />
                    {networkEmulatorLoading && (
                      <p className="text-sm text-neutral-400 mt-2">Connecting...</p>
                    )}
                    {networkEmulatorConnected === true && (
                      <div className="mt-2 space-y-3">
                        <div>
                          <p className="text-sm text-green-400">✓ Connected</p>
                          <p className="text-sm text-neutral-300">SDR50: <span className="text-green-400 font-semibold">{networkEmulatorSDR50}</span></p>
                          <p className="text-sm text-neutral-300">SDR100: <span className="text-green-400 font-semibold">{networkEmulatorSDR100}</span></p>
                        </div>
                        {networkEmulatorSDR50 === 0 && networkEmulatorSDR100 === 0 ? (
                          <p className="text-sm text-yellow-400">No SDR cards found!</p>
                        ) : (
                          <Button
                            onClick={() => runTests(networkEmulatorIP, "network_emulator", setNetworkEmulatorTestsRunning, setNetworkEmulatorTestProgress, setNetworkEmulatorTestResults)}
                            disabled={networkEmulatorTestsRunning}
                            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 transition-all hover:bg-blue-700 disabled:opacity-50"
                          >
                            {networkEmulatorTestsRunning ? "Running Tests..." : "Run Tests"}
                          </Button>
                        )}
                        {networkEmulatorTestProgress && (
                          <div className="mt-4 space-y-3">
                            {/* Parse progress string like "3/6 - Test Name" */}
                            {(() => {
                              const parts = networkEmulatorTestProgress.split(' - ');
                              const [completed, total] = parts[0].split('/').map(Number);
                              const testName = parts[1] || 'Running...';
                              const percentage = Math.round((completed / total) * 100);
                              
                              return (
                                <>
                                  {/* Progress bar with gradient */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-semibold text-neutral-300">{completed}/{total} Tests</span>
                                      <span className="text-sm font-bold text-blue-400">{percentage}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden border border-neutral-600">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out rounded-full"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-neutral-400 mt-1">Current: <span className="text-cyan-300 font-semibold">{testName}</span></p>
                                  </div>
                                </>
                              );
                            })()}
                            {networkEmulatorTestResults && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  onClick={() => viewReport((window as any).networkEmulatorReportID)}
                                  className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 transition-all hover:bg-blue-700"
                                >
                                   View Report
                                </Button>
                                <Button
                                  onClick={() => downloadReport((window as any).networkEmulatorReportID)}
                                  className="flex-1 bg-green-600 text-white font-semibold px-4 py-2 transition-all hover:bg-green-700"
                                >
                                  Download Report
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {networkEmulatorConnected === false && (
                      <p className="text-sm text-red-400 mt-2">✗ Connection failed</p>
                    )}
                  </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 relative">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>


      </Card>
    </div>
  );
};

export default Index;
