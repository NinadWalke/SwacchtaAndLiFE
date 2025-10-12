// ProtectedCommitteeRoute.js
import { useCommitteeAuth } from "./CommitteeAuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedCommitteeRoute({ children }) {
  const { committee, loading } = useCommitteeAuth();

  if (loading) return <p>Loading...</p>; 

  if (!committee) return <Navigate to="/committee/login" replace />;

  return children;
}
