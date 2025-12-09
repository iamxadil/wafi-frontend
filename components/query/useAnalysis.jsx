import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useAnalysis() {
  // ---------------------------
  // STATE
  // ---------------------------
  const [activeUsers, setActiveUsers] = useState(0);
  const [peakToday, setPeakToday] = useState(0);

  const [avgSessionTimeToday, setAvgSession] = useState(0);
  const [returningUsersToday, setReturning] = useState(0);
  const [totalVisitsToday, setTotalVisits] = useState(0);
  const [newVisitorsToday, setNewVisitors] = useState(0);

  const [devices, setDevices] = useState({});
  const [browsers, setBrowsers] = useState({});
  const [utm, setUTM] = useState({});

  // store previous for delta
  const previousActiveRef = useRef(0);

  // ---------------------------
  //  SOCKET HANDLERS (RUN ONCE)
  // ---------------------------
  useEffect(() => {
    const socket = io(API_URL, { withCredentials: true });

    // ACTIVE USERS
    socket.on("analytics:active-users", (data) => {
      previousActiveRef.current = activeUsers; // old value
      setActiveUsers(data.activeUsers);
      setPeakToday(data.peakToday);
    });

    // SESSION TIME
    socket.on("analytics:update-session", (data) => {
      setAvgSession(data.avgSessionTimeToday);
    });

    // VISITOR METRICS + DEVICES + BROWSERS + UTM
    socket.on("analytics:update-metrics", (data) => {
      setReturning(data.returningUsersToday);
      setNewVisitors(data.newVisitorsToday);
      setTotalVisits(data.totalVisitsToday);

      if (data.devices) setDevices(data.devices);
      if (data.browsers) setBrowsers(data.browsers);
      if (data.utm) setUTM(data.utm);
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <--- RUN ONLY ONCE!

  // ---------------------------
  // INITIAL SNAPSHOT
  // ---------------------------
  useEffect(() => {
    axios
      .get(`${API_URL}/api/analytics/analysis`, { withCredentials: true })
      .then((res) => {
        const d = res.data;

        previousActiveRef.current = d.activeUsers;
        setActiveUsers(d.activeUsers);
        setPeakToday(d.peakToday);

        setAvgSession(d.avgSessionTimeToday);
        setReturning(d.returningUsersToday);
        setTotalVisits(d.totalVisitsToday);
        setNewVisitors(d.newVisitorsToday);

        setDevices(d.devices || {});
        setBrowsers(d.browsers || {});
        setUTM(d.utm || {});
      })
      .catch(() => {});
  }, []);

  // ---------------------------
  // DELTA CALCULATION
  // ---------------------------
  const prev = previousActiveRef.current;
  const curr = activeUsers;

  const liveDelta =
    curr > prev ? `+${curr - prev}` :
    curr < prev ? `-${prev - curr}` :
    "0";

  const liveTone =
    curr > prev ? "positive" :
    curr < prev ? "negative" :
    "neutral";

  // ---------------------------
  // EXPORT
  // ---------------------------
  return {
    activeUsers,
    peakToday,

    avgSessionTimeToday,
    returningUsersToday,
    totalVisitsToday,
    newVisitorsToday,

    devices,
    browsers,
    utm,

    liveDelta,
    liveTone,
  };
}


export function useAnalyticsRange(range = "today") {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    range: "today",
    from: null,
    days: 1,

    totalVisits: 0,
    newVisitors: 0,
    returningVisitors: 0,

    avgSessionTime: 0,
    peakActiveUsers: 0,

    devices: {},
    browsers: {},
    utm: {}
  });

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_URL}/api/analytics/range?range=${range}`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Range analytics error:", err);
      })
      .finally(() => setLoading(false));
  }, [range]);

  return { loading, data };
}
