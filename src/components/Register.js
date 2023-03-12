import { useInput } from "../customHooks/useInput";
import { useHistory } from "react-router-dom";
import axios from "axios";

import "./register.css";
import { useEffect, useState } from "react";

function Register(props) {
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return { isValid: regex.test(email), message: "" };
  };

  const validatePasswd = (passwd) => {
    const passwdRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
    );
    let message = "";
    let isValid = passwdRegex.test(passwd);
    if (!isValid) {
      message =
        "Password should contain atleast one lowercase, one uppercase, one numeric, one special characters.";
    } else if (passwd.length < 8) {
      message = "Password should have a minimum length of 8.";
      isValid = false;
    }
    return { isValid: isValid, message: message };
  };

  const {
    value: emailEnteredValue,
    hasError: emailInputHasError,
    isValid: emailIsValid,
    inputChangeHanlder: emailOnChangeHandler,
    inputOnBlurHandler: emailOnBlurHandler,
  } = useInput(validateEmail);

  const {
    value: passwdEnteredValue,
    hasError: passwdHasError,
    isValid: passwdIsValid,
    inputChangeHanlder: passwdOnChangeHandler,
    inputOnBlurHandler: passwdOnBlurHandler,
    message: passwdMessage,
  } = useInput(validatePasswd);

  const [formIsValid, setFormIsValid] = useState(true);

  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  useEffect(()=>{
    setFormIsValid(emailIsValid && passwdIsValid)
    
  }, [emailIsValid, passwdIsValid]);

  const history = useHistory();
  const navigate = (path) => history.push(path);
  
  const onFormSubmit = (event) => {
    event.preventDefault();
    emailOnBlurHandler();
    passwdOnBlurHandler();
    setFormIsSubmitted(true);
    if (formIsValid) {
      console.log('Form is valid');
      axios
        .post("http://localhost:3001/api/auth/emailverification", {
          email: emailEnteredValue,
          password: passwdEnteredValue,
        })
        .then((res) => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Errr");
    }
    
  };

  return (
    <div>
      <p className="error-label">
          {formIsSubmitted && !formIsValid && "Please clear all form errors."}
      </p>
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
            {passwdHasError && "Please enter valid password   "}
            {passwdHasError && (
              <span class="password-helper-container">
                ⓘ<span class="password-message message">{passwdMessage}</span>
              </span>
            )}
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
  );
}

export default Register;
