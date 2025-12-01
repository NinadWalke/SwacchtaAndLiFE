import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/axiosConfig";

const CommitteeAuthContext = createContext();

export function CommitteeAuthProvider({ children }) {
  const [committee, setCommittee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("committeeToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCommittee({
          id: decoded.id,
          email: decoded.leaderEmail,
        });

        api
          .get("/committees/committee")
          .then((res) => setCommittee(res.data.committee))
          .catch(() => logout());
      } catch (err) {
        logout();
      }
    } else {
      setCommittee(null);
    }
    setLoading(false);
  }, []);

  const login = (token, committeeData) => {
    localStorage.setItem("committeeToken", token);
    setCommittee(committeeData);
  };

  const logout = () => {
    localStorage.removeItem("committeeToken");
    setCommittee(null);
  };

  return (
    <CommitteeAuthContext.Provider
      value={{
        committee,
        isAuthenticated: !!committee,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </CommitteeAuthContext.Provider>
  );
}

export function useCommitteeAuth() {
  return useContext(CommitteeAuthContext);
}
