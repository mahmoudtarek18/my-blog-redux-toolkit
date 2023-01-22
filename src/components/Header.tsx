import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { removeActiveUser, setActiveUser } from "../store/slice/authSlice";
import { auth } from "./../firebase/configs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSelector } from "../utils/hooks";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const userName = useAppSelector((state) => state.auth.userName);
  const isAuth = localStorage.getItem("isAuth");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName == null) {
          const u1 = user.email?.slice(0, -10) || "";
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        dispatch(
          setActiveUser({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userID: user.uid,
          })
        );
      } else {
        setDisplayName("");
        localStorage.clear();
        dispatch(removeActiveUser());
      }
    });
  }, [dispatch, displayName]);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout successfully.");
        localStorage.clear();
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <section className="header-sec">
        <div className="logo-wrapper">
          <Link to="/">Mahmoud Tarek Blog</Link>
        </div>
        <div className="links-wrapper">
          <ul>
            {/* <li>
              <Link to="/add-post">Add Post</Link>
            </li> */}
            {isAuth ? (
              <>
                <li>
                  <div className="user-wrapper">
                    <FaUserCircle size={20} color="#44464b" />
                    <h4>{userName}</h4>
                  </div>
                </li>
                <li>
                  <button className="logout-btn" onClick={logoutUser}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Header;
