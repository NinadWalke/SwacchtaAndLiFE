import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";

function CommitteeDashboard() {
  const [currCommittee, setCurrCommittee] = useState({});
  useEffect(() => {
    const getCommitteeData = async () => {
      try {
        const res = await api.get("/committee");
        console.log(res);
        
        setCurrCommittee(res.data.committee);
      } catch (e) {
        console.log(e);
      }
    };
    getCommitteeData();
  }, []);
  return (
    <>
      <h1>Committeee Dashboard</h1>
      <p>{currCommittee.committeeName}</p>
      <p>{currCommittee.leaderEmail}</p>
    </>
  );
}

export default CommitteeDashboard;
