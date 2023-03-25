import { useEffect, useState } from "react";
import { useInput } from "../customHooks/useInput";
import axios from "axios";
import { useHistory } from "react-router-dom";

import "./register.css";

function ForgotPassword(props) {
  useEffect(() => {
    document.title = "Forgot Password";
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return { isValid: regex.test(email), message: "" };
  };

  const {
    value: emailEnteredValue,
    hasError: emailInputHasError,
    inputChangeHanlder: emailOnChangeHandler,
    inputOnBlurHandler: emailOnBlurHandler,
  } = useInput(validateEmail);

  const [invalidEmail, setInvalidEmail] = useState(false);

  const [codeValue, setCodeValue] = useState("");

  const [displayCodeField, setCodeField] = useState(false);

  const [codeErrorMsg, setCodeErrorMsg] = useState("");

  const codeOnChangeHandler = (event) => {
    setCodeValue(event.target.value);
  };

  const history = useHistory();

  function onBlurHandler(event) {
    console.log(event.target.value.length);
    if (event.target.value.length !== 6) {
      setCodeErrorMsg("Code should be of length 6");
    } else {
      setCodeErrorMsg("");
      axios
        .post("http://localhost:3001/api/auth/verify-code", {
          email: emailEnteredValue,
          code: codeValue,
        })
        .then((res) => {
          if (!res.data.success) {
            setCodeErrorMsg("Invalid Code");
            return;
          }
          localStorage.setItem("token", res.data.authtoken);
          history.push("/reset-password");
          return;
        });
    }
  }

  const onFormSubmit = (event) => {
    event.preventDefault();
    setInvalidEmail(false);
    axios
      .post("http://localhost:3001/api/auth/user/exists", {
        email: emailEnteredValue,
      })
      .then((res) => {
        if (!res.data.exists) {
          setInvalidEmail(true);
          return;
        }
        axios
          .post("http://localhost:3001/api/auth/send-verification-code", {
            email: emailEnteredValue,
          })
          .then((res) => {
            if (!res.data.success) {
              return;
            }
            setCodeField(true);
          });
      });
  };

  return (
    <div>
      {invalidEmail && <p className="error-label">Invalid Credentials</p>}
      <div className="forgot-password-form">
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
          {displayCodeField && (
            <input
              type={"text"}
              pattern={"d*"}
              maxLength={"6"}
              placeholder={"Code"}
              className={"input code-input"}
              onBlur={onBlurHandler}
              onChange={codeOnChangeHandler}
            />
          )}
          <p className="error-label">{codeErrorMsg}</p>
          <br/>
          {displayCodeField && (
            <p className="info-label">Code is sent to above mail address.</p>
          )}
          {!displayCodeField && (
            <input
              type={"submit"}
              value={"Submit"}
              className="continue-btn btn"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
