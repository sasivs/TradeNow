import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import "./register.css";

function Login(props) {
  useEffect(() => {
    document.title = "Login";
  }, []);
  
  const [emailEnteredValue, setEmailEnteredValue] = useState("");

  const [passwdEnteredValue, setPasswdEnteredValue] = useState("");

  const [emailVerified, setEmailVerified] = useState(true);

  const passwdOnChangeHandler = (event) => {
    setPasswdEnteredValue(event.target.value);
  };

  const emailOnChangeHandler = (event) => {
    setEmailEnteredValue(event.target.value);
  };

  const [invalidLogin, setInvalidLogin] = useState(false);

  const onFormSubmit = (event) => {
    event.preventDefault();
    setInvalidLogin(false);
    axios
      .post("http://localhost:3001/api/auth/login", {
        email: emailEnteredValue,
        password: passwdEnteredValue,
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setEmailVerified(true);
          console.log("logged in");
        } else {
          console.log("Hi");
          if(!res.data.verified){
            setEmailVerified(false);
            return;
          }
          setEmailVerified(true);
          console.log("Invalid credetials");
          setInvalidLogin(true);
        }
      });
  };

  return (
    <div>
      {!emailVerified && (
        <p className="info-label">
          Please verify your email address to login
        </p>
      )}
      <div className="login-form">
        <p className="error-label">{invalidLogin && "Invalid credentials"}</p>
        <form onSubmit={onFormSubmit}>
          <input
            type={"email"}
            placeholder={"Your Email address"}
            className="email-input input"
            onChange={emailOnChangeHandler}
            value={emailEnteredValue}
          />
          <p className="error-label"></p>
          <br />
          <input
            type={"password"}
            placeholder={"Your password"}
            className="password-input input"
            onChange={passwdOnChangeHandler}
            value={passwdEnteredValue}
          />
          <br />
          <p>
            <Link to={"/forgot-password"}>Forgot Password?</Link>
          </p>
          <input type={"submit"} value={"Login"} className="continue-btn btn" />
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
