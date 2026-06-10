import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ReportViewer } from "@/components/ReportViewer";

export const ReportViewerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportID = searchParams.get("id");

  if (!reportID) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">No report ID provided</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReportViewer
      reportID={reportID}
      onBack={() => navigate("/")}
    />
  );
};

export default ReportViewerPage;
