// Both entry points use the same application and the six components in this folder.
import { createRoot } from "react-dom/client";
import App from "../mechdoctor-main/frontend/src/App.jsx";
import "../mechdoctor-main/frontend/src/index.css";

createRoot(document.getElementById("root")).render(<App />);
