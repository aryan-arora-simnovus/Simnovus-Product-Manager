# Welcome to your Lovable project
# Simnovus Product Builder — Frontend UI Reference

## Project info
This document describes **every user-facing control** in the frontend: what it does, which
component implements it, what happens when it is used, which backend calls it triggers, the
expected inputs/outputs, and the navigation flow.

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
Everything below is traced directly from the source code. Anything that exists in the code but
is not wired up or reachable is explicitly marked **Not Yet Implemented**.

## How can I edit this code?
---

There are several ways of editing your application.
## Tech stack & configuration

**Use Lovable**
- **Vite + React + TypeScript**, styled with **Tailwind CSS** and **shadcn-ui** components.
- Routing via **react-router-dom**. Global UI state via a React context (`DashboardContext`).
- Backend base URL: `import.meta.env.VITE_API_URL`, falling back to `http://localhost:8080`.
  Used in `src/pages/Index.tsx:17` and `src/components/ReportViewer.tsx:22`.

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.
### Local development

Changes made via Lovable will be committed automatically to this repo.
```sh
npm i
npm run dev
```

**Use your preferred IDE**
---

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lo
vable.
## Routing & navigation map

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
Routes are declared in `src/App.tsx`:

Follow these steps:
| Path       | Component (file)                          | Purpose                                  |
|------------|-------------------------------------------|------------------------------------------|
| `/`        | `Index` (`src/pages/Index.tsx`)           | Main dashboard — all primary controls    |
| `/report`  | `ReportViewerPage` (`src/pages/ReportViewerPage.tsx`) | Renders a saved/uploaded test report |
| `*`        | `NotFound` (`src/pages/NotFound.tsx`)     | 404 catch-all                            |

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>
The whole tree is wrapped in `DashboardProvider`, `TooltipProvider`, a TanStack
`QueryClientProvider`, and two toaster providers (`Toaster`, `Sonner`). The QueryClient and the
two toasters are mounted but **no component currently dispatches a toast or uses a query** — they
are scaffolding only.

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>
> ### Orphaned routes / pages — Not Yet Implemented
> - **`src/pages/UESim.tsx`** and **`src/pages/NetworkEmulator.tsx`** are full standalone pages
>   (each with a "Back to Home" button, a collapsible "Configuration Settings" panel, and a
>   "Server IP Address" input). **Neither is imported or routed in `App.tsx`**, so they are
>   unreachable in the running app. Their inputs use purely local `useState` and trigger **no
>   backend calls**. Treat these as dead/legacy pages — the live equivalents live inside the
>   `Index` dashboard (see below).
> - **`src/components/NavLink.tsx`** is a styled `react-router` `NavLink` wrapper. It is **not
>   imported anywhere**. Not Yet Implemented (no navigation bar uses it).

# Step 3: Install the necessary dependencies.
npm i
---

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```
## Global state — `DashboardContext`

**Edit a file directly in GitHub**
File: `src/contexts/DashboardContext.tsx`. Provides all dashboard state so it survives navigation
between `/` and `/report`. Notable initial values:

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.
- `ueSimOpen` defaults to **`true`** (UE Sim panel starts expanded).
- `networkEmulatorOpen` defaults to **`false`** (collapsed).
- IP fields, connection status, SDR counts, test progress/results, and build status all start
  `null`/empty.

**Use GitHub Codespaces**
> **Defined but unused (Not Yet Implemented):** `networkEmulatorUsername` /
> `setNetworkEmulatorUsername` and `networkEmulatorPassword` / `setNetworkEmulatorPassword` exist
> in the context but **no component reads or sets them**. Network Emulator credentials are instead
> hardcoded on the backend (`networkEmulatorCreds` in `backend/main.go`).

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
Report IDs for the download/view buttons are **not** stored in context — they are stashed on the
`window` object as `window.ueSimReportID` / `window.networkEmulatorReportID`.

## What technologies are used for this project?
---

This project is built with:
## Dashboard page (`/`) — `src/pages/Index.tsx`

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
The dashboard has a left control column and a right-side animated 3D scene
(`SplineScene`, loaded from `https://prod.spline.design/...`; decorative, no interaction).

## How can I deploy this project?
### 1. Upload Report button  ⭐ (focus item)

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.
- **Implements:** `Button` at `src/pages/Index.tsx:327`, paired with a hidden
  `<input type="file" accept=".txt">` at line 320 (ref: `fileInputRef`).
- **What it does:** Lets the user load a previously saved `.txt` test report from their local
  machine and view it in the Report Viewer.
- **What happens when clicked:** `onClick` calls `fileInputRef.current?.click()` (line 328),
  opening the OS file picker. Selecting a file fires `handleFileUpload` (line 287):
  1. Reads the file as text (`file.text()`).
  2. Generates an ID `uploaded_${Date.now()}`.
  3. Saves the content to `localStorage` under `report_<id>`.
  4. Navigates to `/report?id=<id>`.
  5. Resets the file input value.
- **Backend calls:** **None.** Upload is entirely client-side (localStorage). The report viewer
  later detects the `uploaded_` prefix and reads from localStorage instead of the API.
- **Inputs:** A single `.txt` file (only the first selected file is used; `accept=".txt"` is a
  hint only, not enforced).
- **Outputs:** Navigation to the Report Viewer rendering the uploaded content. On read error:
  `alert("Failed to read file")`.
- **Navigation flow:** `/` → `/report?id=uploaded_<timestamp>`.

## Can I connect a custom domain to my Lovable project?
### 2. UE Sim button  ⭐ (focus item)

Yes, you can!
- **Implements:** `Button` at `src/pages/Index.tsx:345`.
- **What it does:** Toggles the visibility of the **UE Sim** configuration panel. It is a
  show/hide toggle, **not** a connection or navigation action.
- **What happens when clicked:** `onClick` → `setUeSimOpen(!ueSimOpen)` (line 346). Styling
  changes between an "open" (brighter orange + glow) and "closed" state. When open, it reveals the
  Server IP field, Number of UEs dropdown, and (after connecting) the test/build controls.
- **Backend calls:** None.
- **Inputs/Outputs:** No input; output is the expanded/collapsed panel. Starts **expanded**
  (`ueSimOpen` defaults to `true`).
- **Navigation flow:** None (in-page toggle).

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.
### 3. Network Emulator button  ⭐ (focus item)

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
- **Implements:** `Button` at `src/pages/Index.tsx:484`.
- **What it does:** Toggles the visibility of the **Network Emulator** configuration panel.
  Toggle only — not a connect/navigate action.
- **What happens when clicked:** `onClick` → `setNetworkEmulatorOpen(!networkEmulatorOpen)`
  (line 485). Reveals the Network Emulator Server IP field and downstream controls.
- **Backend calls:** None.
- **Inputs/Outputs:** No input; output is the expanded/collapsed panel. Starts **collapsed**.
- **Navigation flow:** None (in-page toggle).

> Note: the standalone `Network Emulator` *page* (`src/pages/NetworkEmulator.tsx`) is unrelated to
> this button and is **Not Yet Implemented / unrouted** (see Orphaned routes above).

### 4. Server IP Address field (UE Sim)  ⭐ (focus item)

- **Implements:** `Input` at `src/pages/Index.tsx:363` (inside the UE Sim panel).
- **What it does:** Captures the IP address of the UE Sim server and, on **Enter**, initiates an
  SSH connection test.
- **What happens when used:**
  - `onChange` → `setUeSimIP(e.target.value)` (controlled input bound to `ueSimIP`).
  - `onKeyPress` → `handleUeSimKeyPress` (line 120): when the key is **Enter**, calls
    `connectToServer(ueSimIP, "ue_sim", ...)`.
  - Disabled while `ueSimLoading` is true.
- **Backend call:** `connectToServer` (line 69) does `POST ${API_BASE_URL}/api/connect` with body
  `{ serverIP, type: "ue_sim" }`. Before sending, it clears prior UE Sim test/build state and
  deletes `window.ueSimReportID`.
- **Expected input:** A server IP/hostname string. Empty input is ignored (`if (!ip) return`).
- **Outputs (from the JSON response):**
  - `data.connected` → drives `ueSimConnected`.
  - On success: `ueSimSDR50 = data.sdr50Count`, `ueSimSDR100 = data.sdr100Count`, and a green
    "✓ Connected" with SDR50/SDR100 counts (lines 393–399).
  - On failure / network error: "✗ Connection failed" (line 474), counts cleared.
  - While in-flight: "Connecting..." (line 390).
- **Navigation flow:** None; updates panel state in place.

### 5. Number of UEs dropdown  ⭐ (focus item)

- **Implements:** shadcn `Select` at `src/pages/Index.tsx:377` (UE Sim panel).
- **What it does:** Lets the user pick how many UEs to simulate.
- **Options:** `32`, `64`, `128`, `256` (lines 382–385). Placeholder "Select number"; no default
  selection (`ueSimNumberOfUEs` starts as `""`).
- **What happens when used:** `onValueChange` → `setUeSimNumberOfUEs(value)`, stored in
  `DashboardContext`.
- **Backend calls:** **None.**
- **⚠️ Important — Not Yet Implemented (effect):** The selected value is stored in state but is
  **never read or sent anywhere**. It is not included in the `/api/connect`, `/api/run-tests`, or
  `/api/build-product` request bodies. Selecting a UE count currently has **no functional effect**
  on connection, tests, or build.
- **Outputs:** Updated dropdown display only.

### 6. Run Tests button (UE Sim)

- **Implements:** `Button` at `src/pages/Index.tsx:403`. Only rendered when UE Sim is connected
  **and** at least one SDR card was found (`!(SDR50===0 && SDR100===0)`). If both counts are 0, a
  "No SDR cards found!" warning is shown instead (line 401).
- **What it does:** Runs the backend SDR test suite against the connected UE Sim server.
- **What happens when clicked:** `runTests(ueSimIP, "ue_sim", ...)` (line 173):
  1. `POST ${API_BASE_URL}/api/run-tests` with `{ serverIP, type: "ue_sim" }` → returns
     `sessionID`.
  2. Polls `GET ${API_BASE_URL}/api/test-progress?id=<sessionID>` every **500 ms** in a loop.
  3. Each poll updates a progress string `"<completedTests>/<totalTests> - <currentTest>"`.
  4. When `status === "completed"`: stores `cardResults` into `ueSimTestResults` and saves
     `reportID` to `window.ueSimReportID`.
- **Backend calls:** `POST /api/run-tests`, repeated `GET /api/test-progress`.
- **Inputs:** Connected `ueSimIP`. **Outputs:** A gradient progress bar with percentage and the
  current test name (lines 411–438), and on completion the View/Download Report buttons.
- **Button states:** label switches to "Running Tests..." and is disabled while
  `ueSimTestsRunning`. On error, results are set to a single failed "Error" card (line 231).
- **Navigation flow:** None directly; enables View Report (→ `/report`).

> Backend context: the suite runs **3 tests per SDR card** (DMA Loopback, GPS State, GPS Sync),
> so `totalTests = cardCount × 3` (`backend/main.go`).

### 7. View Report button (UE Sim)

- **Implements:** `Button` at `src/pages/Index.tsx:441`. Rendered only after `ueSimTestResults`
  exists.
- **What it does:** Opens the generated report in the Report Viewer.
- **What happens when clicked:** `viewReport(window.ueSimReportID)` (line 245) → if an ID exists,
  `navigate('/report?id=<reportID>')`; otherwise `alert("No report available")`.
- **Backend calls:** None at click time (the viewer fetches the report afterward).
- **Navigation flow:** `/` → `/report?id=<reportID>`.

### 8. Download Report button (UE Sim)

- **Implements:** `Button` at `src/pages/Index.tsx:447`.
- **What it does:** Downloads the generated report file.
- **What happens when clicked:** `downloadReport(window.ueSimReportID)` (line 237) → sets
  `window.location.href = ${API_BASE_URL}/api/download-report?id=<reportID>`, triggering a browser
  download. If no ID: `alert("No report available")`.
- **Backend call:** `GET /api/download-report?id=<reportID>`.
- **Navigation flow:** Browser file download (no SPA route change).

### 9. Build Product button (UE Sim)

- **Implements:** `Button` at `src/pages/Index.tsx:458`. Rendered once UE Sim is connected.
- **What it does:** Triggers a backend "build and install product" operation against the UE Sim
  server.
- **What happens when clicked:** `buildProduct` (line 253):
  - Guards: if `ueSimIP` empty → `alert("Please connect to a UE Sim first")`.
  - `POST ${API_BASE_URL}/api/build-product` with `{ ueServerIP: ueSimIP }`.
  - On `response.ok && data.status === "success"` → `ueSimBuildStatus = "success"` ("✓ Product
    built successfully!", line 466).
  - Otherwise → `ueSimBuildStatus = "error"` and shows `data.error` (or a fallback message)
    in red (line 468).
- **Backend call:** `POST /api/build-product`.
- **Button states:** label "Building Product..." and disabled while `ueSimBuildLoading`.
- **Inputs:** `ueSimIP`. **Outputs:** success/error status text. **Navigation:** none.

### 10. Server IP Address field (Network Emulator)

- **Implements:** `Input` at `src/pages/Index.tsx:500` (Network Emulator panel).
- **What it does:** Captures the Network Emulator server IP and, on **Enter**, connects.
- **What happens when used:**
  - `onChange` → `setNetworkEmulatorIP(e.target.value)`.
  - `onKeyPress` (inline, line 505): on **Enter**, calls `connectNetworkEmulator(...)` (line 132).
  - Disabled while `networkEmulatorLoading`.
- **Backend call:** `POST ${API_BASE_URL}/api/connect-network-emulator` with `{ serverIP }`.
  (Note: a **different endpoint** from UE Sim — credentials are applied server-side.)
- **Inputs:** IP string (empty ignored). **Outputs:** identical pattern to UE Sim — "Connecting…",
  then "✓ Connected" with SDR50/SDR100 counts (lines 516–522) or "✗ Connection failed" (line 582).
- **Navigation flow:** None.

### 11. Run Tests / View Report / Download Report (Network Emulator)

These mirror the UE Sim controls but use the Network Emulator state and
`window.networkEmulatorReportID`:

- **Run Tests** — `Button` at line 526; calls `runTests(networkEmulatorIP, "network_emulator", ...)`.
  Same `POST /api/run-tests` + `GET /api/test-progress` polling flow. Shown only when connected and
  SDR cards are present.
- **View Report** — `Button` at line 564; `viewReport(window.networkEmulatorReportID)` → `/report?id=...`.
- **Download Report** — `Button` at line 570; `downloadReport(window.networkEmulatorReportID)` →
  `GET /api/download-report?id=...`.

> The Network Emulator panel has **no "Number of UEs" dropdown and no "Build Product" button** —
> those exist only in the UE Sim panel.

---

## Report Viewer page (`/report`) — `src/pages/ReportViewerPage.tsx` + `src/components/ReportViewer.tsx`

`ReportViewerPage` reads the `id` query param. If missing, it renders a "No report ID provided"
message with a **"Back to Dashboard"** button (`navigate("/")`). Otherwise it renders
`ReportViewer`.

### Report loading behavior (`ReportViewer`, `src/components/ReportViewer.tsx`)

On mount (`useEffect`, line 29):
- If `reportID` starts with `uploaded_` → reads content from `localStorage["report_<id>"]`
  (no backend call). This is how the **Upload Report** flow renders.
- Otherwise → `GET ${API_BASE_URL}/api/view-report?id=<reportID>` and uses `data.content`.
- While loading: "Loading report..." (line 106).

The raw text report is parsed client-side into three sections by scanning for marker lines
(`SERVER INFORMATION`, `TEST RESULTS`, `CARD ID:`, etc.) and rendered as cards.

### Report Viewer controls

- **Back button (header)** — `Button` at line 96; `onClick={onBack}` → `navigate("/")`.
- **Expandable info cards** — the CPU Information, Memory Information, PCI Devices, and per-card
  Test Results blocks are clickable `div`s (e.g. lines 194, 208, 222, 271). Clicking calls
  `openExpandedView(title, content)` (line 63), which opens a modal `Dialog` showing the full text.
  - **Close button** inside the dialog (line 328) — wrapped in `DialogClose`, dismisses the modal.
- **Download Report button (footer)** — `Button` at line 294; `downloadReport()` (line 67):
  - For `uploaded_` reports → builds a `Blob` from the in-memory content and triggers a client-side
    `.txt` download (no backend).
  - For backend reports → `window.location.href = ${API_BASE_URL}/api/download-report?id=<id>`.
- **Back to Dashboard button (footer)** — `Button` at line 300; `onClick={onBack}` → `navigate("/")`.

### Navigation flow

`/report?id=<id>` → "← Back" / "Back to Dashboard" → `/`.
Modal expand/close is in-page only.

---

## 404 page (`*`) — `src/pages/NotFound.tsx`

- Logs the attempted path to `console.error` on mount.
- **"Return to Home" link** (`<a href="/">`, line 16) — a full-page navigation back to `/`.

---

## Backend API summary (called by the frontend)

All requests target `${VITE_API_URL || http://localhost:8080}`. Routes are registered in
`backend/main.go`.

| Frontend action                         | Method & endpoint                       | Request body / params              | Key respon
se fields |
|-----------------------------------------|-----------------------------------------|------------------------------------|-----------
----------|
| UE Sim "Server IP" + Enter              | `POST /api/connect`                     | `{ serverIP, type: "ue_sim" }`     | `connected
`, `sdr50Count`, `sdr100Count` |
| Network Emulator "Server IP" + Enter    | `POST /api/connect-network-emulator`    | `{ serverIP }`                     | `connected
`, `sdr50Count`, `sdr100Count` |
| Run Tests (both panels)                 | `POST /api/run-tests`                   | `{ serverIP, type }`               | `sessionID
` |
| Test progress polling                   | `GET /api/test-progress?id=<sessionID>` | query: `id`                        | `completed
Tests`, `totalTests`, `currentTest`, `status`, `cardResults`, `reportID` |
| Build Product (UE Sim)                  | `POST /api/build-product`               | `{ ueServerIP }`                   | `status` (
"success"/"error"), `error` |
| Download Report                         | `GET /api/download-report?id=<id>`      | query: `id`                        | file downl
oad |
| View Report (non-uploaded)              | `GET /api/view-report?id=<id>`          | query: `id`                        | `content`
|

### Backend endpoints with NO frontend caller (Not Yet Implemented in UI)

- `POST /api/connect-password` (`HandleConnectWithPassword`) — username/password SSH connect. The
  frontend never calls it (the unused `networkEmulatorUsername`/`Password` context fields hint at a
  planned UI that doesn't exist).
- `POST /api/sdr-cards` (`HandleSDRCards`) — standalone SDR card count endpoint; not invoked by any
  frontend control (card counts come back inline from the connect endpoints instead).

---

## Quick "Not Yet Implemented" checklist

- **Number of UEs dropdown** — value stored but never sent to the backend; no effect.
- **`UESim.tsx` page** — not routed; unreachable; no backend calls.
- **`NetworkEmulator.tsx` page** — not routed; unreachable; no backend calls.
- **`NavLink.tsx`** — defined but never imported.
- **`networkEmulatorUsername` / `networkEmulatorPassword`** context state — never read or set.
- **TanStack Query (`QueryClientProvider`)** and **toast providers** — mounted but unused.
- **`/api/connect-password`** and **`/api/sdr-cards`** backend endpoints — no frontend caller.
