import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ReportViewerProps {
  reportID: string;
  onBack: () => void;
}

interface FullScreenBox {
  title: string;
  content: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const ReportViewer = ({ reportID, onBack }: ReportViewerProps) => {
  const [reportContent, setReportContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedBox, setExpandedBox] = useState<FullScreenBox | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        let content = "";
        
        // Check if this is an uploaded file stored in localStorage
        if (reportID.startsWith("uploaded_")) {
          const storedContent = localStorage.getItem(`report_${reportID}`);
          if (storedContent) {
            content = storedContent;
          } else {
            throw new Error("Uploaded report not found");
          }
        } else {
          // Fetch from backend API
          const response = await fetch(`${API_BASE_URL}/api/view-report?id=${reportID}`);
          if (!response.ok) {
            throw new Error("Failed to fetch report");
          }
          const data = await response.json();
          content = data.content;
        }
        
        setReportContent(content);
      } catch (error) {
        console.error("Error loading report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportID]);

  const openExpandedView = (title: string, content: string) => {
    setExpandedBox({ title, content });
  };

  const downloadReport = () => {
    if (!reportID) {
      alert("No report available");
      return;
    }
    
    if (reportID.startsWith("uploaded_")) {
      // For uploaded files, create a download from the content
      const element = document.createElement("a");
      const file = new Blob([reportContent], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `report_${reportID}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // For backend reports, use the API endpoint
      window.location.href = `${API_BASE_URL}/api/download-report?id=${reportID}`;
    }
  };

  return (
    <div className="w-full h-full bg-black overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            SDR Test Report
          </h1>
          <Button
            onClick={onBack}
            className="bg-neutral-700 text-white hover:bg-neutral-600"
          >
            ← Back
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-neutral-400">Loading report...</span>
          </div>
        ) : (
          <>
            {reportContent && (() => {
              const lines = reportContent.split('\n');
              const sections: { [key: string]: string[] } = {
                header: [],
                serverInfo: [],
                testResults: [],
              };

              let currentSection = 'header';

              lines.forEach((line) => {
                if (line.includes('SERVER INFORMATION')) {
                  currentSection = 'serverInfo';
                } else if (line.includes('TEST RESULTS')) {
                  currentSection = 'testResults';
                } else {
                  sections[currentSection]?.push(line);
                }
              });

              return (
                <div className="space-y-6">
                  {/* Header Section */}
                  <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-4">
                    <h2 className="text-xl font-bold text-blue-400">Overview</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {sections.header.map((line, idx) => {
                        if (line.includes('Server IP:')) {
                          const ip = line.split(':')[1]?.trim();
                          return (
                            <div key={idx} className="bg-black border border-neutral-700 rounded-lg p-4">
                              <p className="text-xs text-neutral-400 uppercase tracking-wider">Server IP</p>
                              <p className="text-xl font-bold text-cyan-300 mt-2">{ip}</p>
                            </div>
                          );
                        }
                        if (line.includes('Generated:')) {
                          const date = line.split(':').slice(1).join(':').trim();
                          return (
                            <div key={idx} className="bg-black border border-neutral-700 rounded-lg p-4">
                              <p className="text-xs text-neutral-400 uppercase tracking-wider">Generated</p>
                              <p className="text-lg font-semibold text-neutral-300 mt-2">{date}</p>
                            </div>
                          );
                        }
                        if (line.includes('Total Cards')) {
                          const count = line.split(':')[1]?.trim();
                          return (
                            <div key={idx} className="bg-black border border-neutral-700 rounded-lg p-4">
                              <p className="text-xs text-neutral-400 uppercase tracking-wider">Total Cards</p>
                              <p className="text-3xl font-bold text-green-400 mt-2">{count}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </Card>

                  {/* Server Information Section */}
                  {sections.serverInfo.length > 0 && (
                    <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-4">
                      <h2 className="text-xl font-bold text-blue-400 border-b border-blue-400 pb-2">
                        Server Information
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        {(() => {
                          let cpuText = '';
                          let memText = '';
                          let pciText = '';
                          let currentType = '';

                          sections.serverInfo.forEach((line) => {
                            if (line.includes('CPU Information')) currentType = 'cpu';
                            else if (line.includes('Memory Information')) currentType = 'mem';
                            else if (line.includes('PCI Devices')) currentType = 'pci';
                            else if (currentType === 'cpu' && line.trim()) cpuText += line + '\n';
                            else if (currentType === 'mem' && line.trim()) memText += line + '\n';
                            else if (currentType === 'pci' && line.trim()) pciText += line + '\n';
                          });

                          return (
                            <>
                              {cpuText && (
                                <div 
                                  onClick={() => openExpandedView("CPU Information", cpuText)}
                                  className="bg-black border border-neutral-700 rounded-lg p-4 space-y-2 cursor-pointer hover:border-cyan-400 transition-colors hover:bg-neutral-950"
                                >
                                  <h3 className="text-cyan-300 font-semibold flex items-center gap-2">
                                    CPU Information
                                    <span className="text-xs text-neutral-500 ml-auto">Click to expand</span>
                                  </h3>
                                  <pre className="text-xs text-neutral-400 whitespace-pre-wrap break-words font-mono overflow-auto max-h-48 bg-neutral-950 p-3 rounded border border-neutral-800">
                                    {cpuText}
                                  </pre>
                                </div>
                              )}
                              {memText && (
                                <div 
                                  onClick={() => openExpandedView("Memory Information", memText)}
                                  className="bg-black border border-neutral-700 rounded-lg p-4 space-y-2 cursor-pointer hover:border-cyan-400 transition-colors hover:bg-neutral-950"
                                >
                                  <h3 className="text-cyan-300 font-semibold flex items-center gap-2">
                                    Memory Information
                                    <span className="text-xs text-neutral-500 ml-auto">Click to expand</span>
                                  </h3>
                                  <pre className="text-xs text-neutral-400 whitespace-pre-wrap break-words font-mono overflow-auto max-h-48 bg-neutral-950 p-3 rounded border border-neutral-800">
                                    {memText}
                                  </pre>
                                </div>
                              )}
                              {pciText && (
                                <div 
                                  onClick={() => openExpandedView("PCI Devices", pciText)}
                                  className="bg-black border border-neutral-700 rounded-lg p-4 space-y-2 cursor-pointer hover:border-cyan-400 transition-colors hover:bg-neutral-950"
                                >
                                  <h3 className="text-cyan-300 font-semibold flex items-center gap-2">
                                    PCI Devices
                                    <span className="text-xs text-neutral-500 ml-auto">Click to expand</span>
                                  </h3>
                                  <pre className="text-xs text-neutral-400 whitespace-pre-wrap break-words font-mono overflow-auto max-h-48 bg-neutral-950 p-3 rounded border border-neutral-800">
                                    {pciText}
                                  </pre>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </Card>
                  )}

                  {/* Test Results Section */}
                  {sections.testResults.length > 0 && (
                    <Card className="bg-neutral-900 border-neutral-800 p-6 space-y-4">
                      <h2 className="text-xl font-bold text-green-400 border-b border-green-400 pb-2">
                        Test Results
                      </h2>
                      <div className="space-y-4">
                        {(() => {
                          const cardSections: { id: string; content: string }[] = [];
                          let currentCard = '';
                          let currentContent = '';

                          sections.testResults.forEach((line) => {
                            if (line.includes('CARD ID:')) {
                              if (currentCard) {
                                cardSections.push({ id: currentCard, content: currentContent });
                              }
                              currentCard = line.split('CARD ID:')[1]?.trim() || '';
                              currentContent = '';
                            } else if (line.trim()) {
                              currentContent += line + '\n';
                            }
                          });

                          if (currentCard) {
                            cardSections.push({ id: currentCard, content: currentContent });
                          }

                          return cardSections.map((card, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => openExpandedView(`Card ${card.id} Results`, card.content)}
                              className="bg-black border border-neutral-700 rounded-lg p-4 space-y-3 cursor-pointer hover:border-yellow-400 transition-colors hover:bg-neutral-950"
                            >
                              <div className="flex items-center gap-2">
                                <span className="inline-block bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded">
                                  Card {card.id}
                                </span>
                                <span className="text-xs text-neutral-500 ml-auto">Click to expand</span>
                              </div>
                              <pre className="text-xs text-neutral-300 whitespace-pre-wrap break-words font-mono bg-neutral-950 p-3 rounded border border-neutral-800 overflow-auto max-h-80">
                                {card.content}
                              </pre>
                            </div>
                          ));
                        })()}
                      </div>
                    </Card>
                  )}

                  {/* Footer Actions */}
                  <div className="flex gap-4 sticky bottom-0 bg-black pt-4 border-t border-neutral-700">
                    <Button
                      onClick={downloadReport}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 font-semibold py-3"
                    >
                       Download Report
                    </Button>
                    <Button
                      onClick={onBack}
                      className="flex-1 bg-neutral-700 text-white hover:bg-neutral-600 font-semibold py-3"
                    >
                      ← Back to Dashboard
                    </Button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Expanded Box Modal */}
      <Dialog open={expandedBox !== null} onOpenChange={() => setExpandedBox(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-black border-neutral-700">
          <DialogHeader className="border-b border-neutral-700 pb-4">
            <DialogTitle className="text-2xl font-bold text-cyan-300">
              {expandedBox?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <pre className="text-sm text-neutral-300 whitespace-pre-wrap break-words font-mono bg-neutral-950 p-4 rounded border border-neutral-800">
              {expandedBox?.content}
            </pre>
          </div>
          <div className="border-t border-neutral-700 pt-4 mt-4 flex gap-2">
            <DialogClose asChild>
              <Button className="flex-1 bg-neutral-700 text-white hover:bg-neutral-600">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportViewer;
