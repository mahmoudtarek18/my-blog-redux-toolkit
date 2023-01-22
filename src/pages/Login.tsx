import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "./../firebase/configs";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../store/slice/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // Login with Google
  const provider = new GoogleAuthProvider();

  const redirectUser = () => {
    navigate("/");
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("isAuth", "true");
        const user = result.user;
        toast.success("Login Successfully");
        redirectUser();
        dispatch(
          setActiveUser({
            email: user.email,
            userName: user.displayName ? user.displayName : "",
            userID: user.uid,
          })
        );
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <section className="login-container">
      <h2>Login</h2>
      <button
        className="--btn --btn-danger --btn-block"
        onClick={signInWithGoogle}
      >
        <FaGoogle color="#fff" /> Login With Google
      </button>
    </section>
  );
};

export default Login;
