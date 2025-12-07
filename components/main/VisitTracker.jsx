import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function VisitTracker() {
  useEffect(() => {
    axios.get(`${API_URL}/api/analytics/visit`, {
      withCredentials: true
    }).catch(err => console.log("Visit error:", err));
  }, []);

  return null;
}

export default VisitTracker;
