import { useInput } from "../customHooks/useInput";
import { useHistory } from "react-router-dom";
import axios from "axios";

import "./email_verify.css";

function EmailVerification(props) {
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return { isValid: regex.test(email), message: "" };
  };

  const validatePasswd = (passwd) => {
    const passwdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$/;
    let message = "";
    const isValid = passwdRegex.test(passwd);
    if (!isValid) {
      message =
        "Password should contain atleast one lowercase, one uppercase, one numeric, one special characters.";
    } else if (passwd.length() < 8) {
      message = "Password should have a minimum length of 8.";
    }
    return { isValid: isValid, message: message };
  };

  const {
    value: emailEnteredValue,
    hasError: emailInputHasError,
    inputChangeHanlder: emailOnChangeHandler,
    inputOnBlurHandler: emailOnBlurHandler,
  } = useInput(validateEmail);

  const {
    value: passwdEnteredValue,
    hasError: passwdHasError,
    inputChangeHanlder: passwdOnChangeHandler,
    inputOnBlurHandler: passwdOnBlurHandler,
    message: passwdMessage,
  } = useInput(validatePasswd);

  const history = useHistory();
  const navigate = (path) => history.push(path);
  const onFormSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/api/auth/emailverification", {
        email: emailEnteredValue,
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="row email-row">
      <div className="col-4 side-container">
        <div className="side-head">
          <h3>{props.side_head[0]}</h3>
          <h3>{props.side_head[1]}</h3>
          <h3>{props.side_head[2]}</h3>
          <h3>{props.side_head[3]}</h3>
        </div>
        <div className="title-head">
          <h1>{props.title}</h1>
        </div>
      </div>
      <div className="col form-container">
        <div className="welcome-head">
          <h2>Welcome to {props.title}</h2>
        </div>
        <div className="google-container">
          <div class="g-signin2" data-onsuccess="onSignIn"></div>
        </div>
        <div className="email-form">
          <form onSubmit={onFormSubmit}>
            <input
              type={"email"}
              placeholder={"Your Email address"}
              className="email-input input"
              onChange={emailOnChangeHandler}
              onBlur={emailOnBlurHandler}
              value={emailEnteredValue}
            />

            <p className="error-label">
              {emailInputHasError && "Please enter valid Email address"}
            </p>
            <br />
            <input
              type={"password"}
              placeholder={"Your password"}
              className="password-input input"
              onChange={passwdOnChangeHandler}
              onBlur={passwdOnBlurHandler}
              value={passwdEnteredValue}
            />
            <p className="error-label">
              {passwdHasError && "Please enter valid password"}
              {passwdHasError && <span class="password-helper-container">
                ⓘ
                <span class="password-message message">{passwdMessage}</span>
              </span>}
            </p>
            <br />
            <input
              type={"submit"}
              value={"Continue"}
              className="continue-btn btn"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
