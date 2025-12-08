import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
// Import the new stylesheet for this component
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [edit, setEdit] = useState(false);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/auth/check");
        setCurrUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error, e.g., redirect to login
      }
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrUser({ ...currUser, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/profile/${currUser._id}`, currUser);
      setEdit(false);
      alert("Profile updated!"); // Suggestion: Replace with a toast notification for better UX
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.successMsg) {
        logout();
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      alert("Error logging out. Please try again.");
    }
  };

  // getting user level based on greenCoins
  const getUserLevel = (greenCoins) => {
    if (greenCoins >= 1000) {
      return {
        level: "Platinum Protector",
        badge: "✨",
        privilege: "Special recognition, merchandise rewards",
      };
    } else if (greenCoins >= 500) {
      return {
        level: "Civic Hero",
        badge: "🦸",
        privilege: "Leaderboard visibility",
      };
    } else if (greenCoins >= 200) {
      return {
        level: "Eco Guardian",
        badge: "🌍",
        privilege: "Early access to challenges",
      };
    } else if (greenCoins >= 50) {
      return {
        level: "Clean City Advocate",
        badge: "🧹",
        privilege: "Highlighted profile",
      };
    } else {
      return {
        level: "Green Starter",
        badge: "🌱",
        privilege: "Basic profile",
      };
    }
  };
  const { level, badge, privilege } = getUserLevel(currUser?.greenCoins);

  // Improved loading state
  if (!currUser) {
    return <div className="profile-loading">Loading Account...</div>;
  }

  // Updated avatar URL with new brand colors
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currUser.fname + " " + currUser.lname
  )}&background=77b0aa&color=fff&size=128&bold=true`;

  return (
    <div className="profile-page">
      <section className="profile__header">
        <h1 className="profile__header-title">Account Settings</h1>
        <p className="profile__header-subtitle">
          View and update your personal information for a seamless experience.
        </p>
      </section>

      <div className="profile__card">
        {/* AVATAR & BASIC INFO */}
        <div className="profile-card__avatar-section">
          <img src={avatarUrl} alt="Avatar" className="profile-avatar__image" />
          <h2 className="profile-avatar__name">
            {currUser.fname} {currUser.lname}
          </h2>
          <div className="profile-level">
            <span className="profile-level__badge">{badge}</span>
            <span className="profile-level__text">{level}</span>
          </div>

          <p className="profile-privilege">{privilege}</p>

          <p className="profile-avatar__greenCoins">{currUser?.greencoins} GreenCoins</p>
          <p className="profile-avatar__location">
            {currUser.address || "Location not set"}
          </p>
          <p className="profile-avatar__email">{currUser.email}</p>
        </div>

        {/* DETAILS (VIEW OR EDIT FORM) */}
        <div className="profile-card__details-section">
          {edit ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="profile-form__grid">
                <div className="form__group">
                  <label className="form__label" htmlFor="fname">
                    First Name
                  </label>
                  <input
                    id="fname"
                    type="text"
                    name="fname"
                    value={currUser.fname}
                    onChange={handleChange}
                    className="form__input"
                    required
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="lname">
                    Last Name
                  </label>
                  <input
                    id="lname"
                    type="text"
                    name="lname"
                    value={currUser.lname}
                    onChange={handleChange}
                    className="form__input"
                    required
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={currUser.dob?.split("T")[0] || ""}
                    onChange={handleChange}
                    className="form__input"
                  />
                </div>
                <div className="form__group">
                  <label className="form__label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={currUser.gender}
                    onChange={handleChange}
                    className="form__select"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form__group form__group--full-width">
                  <label className="form__label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={currUser.phone || ""}
                    onChange={handleChange}
                    className="form__input"
                  />
                </div>
                <div className="form__group form__group--full-width">
                  <label className="form__label" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={currUser.address || ""}
                    onChange={handleChange}
                    className="form__input"
                  />
                </div>
                <div className="profile-actions">
                  <button type="submit" className="btn btn--primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit(false)}
                    className="btn btn--secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <div className="profile-display__grid">
                <div className="profile-display__item">
                  <strong>First Name</strong> <span>{currUser.fname}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Last Name</strong> <span>{currUser.lname}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Date of Birth</strong>{" "}
                  <span>{currUser.dob?.split("T")[0] || "N/A"}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Gender</strong> <span>{currUser.gender}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Phone</strong> <span>{currUser.phone || "N/A"}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Address</strong>{" "}
                  <span>{currUser.address || "N/A"}</span>
                </div>
                <div className="profile-display__item">
                  <strong>Username</strong> <span>{currUser.username}</span>
                </div>
                <div className="profile-display__item">
                  <strong>GreenCoins</strong> <span>{currUser?.greenCoins}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button
                  onClick={() => setEdit(true)}
                  className="btn btn--primary"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/profile/reports")}
                  className="btn btn--primary"
                >
                  My Reports
                </button>
                <button
                  onClick={() => navigate("/profile/recycle-requests")}
                  className="btn btn--primary"
                >
                  My Recycle Requests
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn--danger-outline"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
