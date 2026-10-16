# MechDoctor

Open http://localhost:5000 while the local server is running.

To start it again on Windows, double-click Start-MechDoctor.cmd. Keep its window open while using the app; press Ctrl+C to stop.

## Project connections

The canonical frontend is frontend/index.html. Its application directly imports all six React components from ../TANVI doc using the @components alias. The TANVI entry point also uses this same application. React is deduplicated across the folders.

Flask serves the production HTML, CSS, JavaScript, and API from port 5000. Machine definitions and every field option come from GET /api/machines. Both scenarios submit to POST /api/diagnose. There is no invented frontend diagnosis fallback: failed requests show a clear error. AI provider failure uses the existing backend template fallback, labeled in the report.

Reports contain AI summary, ranked weighted scores, qualitative confidence, symptoms, reasoning, inspection steps, maintenance actions, fault-specific safety, general precautions, uncertainty, and the disclaimer. Dashboard, input reset, edit, print/PDF, help pages, mobile navigation, and connection retry are connected.

## Run and test

Dependencies are already installed in this workspace. Backend Python is backend/.venv/Scripts/python.exe. Backend credentials remain in backend/.env and are never included in the frontend build.

    backend/.venv/Scripts/python.exe backend/app.py

Frontend development (keep Flask running):

    cd frontend
    npm.cmd run dev

Vite proxies /api to port 5000. VITE_API_URL optionally overrides development API origin. Production uses the Flask origin unless VITE_PRODUCTION_API_URL is explicitly set.

Build and verification:

    backend/.venv/Scripts/python.exe -m pytest backend/test -q
    cd frontend
    npm.cmd run build
    npm.cmd run test:e2e

Browser checks use installed Chrome or Edge. Set MECHDOCTOR_BROWSER to another Chromium executable if needed. Screenshots are written to frontend/test-artifacts/.

For a new installation: create backend/.venv with an installed Python, install backend/requirements.txt, run npm.cmd install in frontend, and build the frontend. See backend/.env.example for AI settings.

Scores are weighted rule matches, not probabilities. Confidence is Low, Medium, or High. Preliminary guidance only, not a certified engineering diagnosis.

## Final Gemini integration and ZIP setup

The default model is `gemini-3.1-flash-lite`. Each click on **Analyse machine** sends the current readings and notes to Gemini in a fresh request. After editing inputs, select **Analyse machine** again to generate the updated report. Diagnosis responses are not cached. The emergency backend explanation also includes the current observations if external AI services are unavailable.

On a new machine, install Python 3.11+ and Node.js 20.19+ (or 22.12+), then double-click **Setup-MechDoctor.cmd**. Add your existing Gemini API key to `backend/.env`, using `backend/.env.example` as the template. Then double-click **Start-MechDoctor.cmd** and open **http://localhost:5000**.

The final ZIP includes source, production HTML/CSS/JavaScript, backend knowledge bases, tests, setup scripts, and the original Stitch references. Keep `mechdoctor-main` and `TANVI doc` beside each other as provided. API keys, installed dependencies, logs, and caches are excluded from the ZIP; your current local `backend/.env` is preserved.

The backend regression suite contains 48 tests. Browser checks include changing the temperature from 95 to 96 and verifying that both the API response and displayed summary change. To require live Gemini success during browser checks, set `MECHDOCTOR_REQUIRE_GEMINI=1` before running `npm.cmd run test:e2e`.

To recreate the release ZIP after building: `backend/.venv/Scripts/python.exe scripts/package_project.py`.
