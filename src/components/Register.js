import { useInput } from "../customHooks/useInput";
import { Link } from "react-router-dom";
import axios from "axios";

import "./register.css";
import { useEffect, useState } from "react";

function Register(props) {
  useEffect(() => {
    document.title = "Register";
  }, []);
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
    inputReset: emailReset,
  } = useInput(validateEmail);

  const {
    value: passwdEnteredValue,
    hasError: passwdHasError,
    isValid: passwdIsValid,
    inputChangeHanlder: passwdOnChangeHandler,
    inputOnBlurHandler: passwdOnBlurHandler,
    inputReset: passwdReset,
    message: passwdMessage,
  } = useInput(validatePasswd);

  const [formIsValid, setFormIsValid] = useState(true);

  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  const [userExists, setUserExists] = useState(false);

  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    setUserExists(false);
  }, [emailInputHasError]);

  useEffect(() => {
    setFormIsValid(emailIsValid && passwdIsValid);
    setFormIsSubmitted(false);
  }, [emailIsValid, passwdIsValid]);

  useEffect(() => {
    if (signUpSuccess) {
      emailReset();
      passwdReset();
    }
  }, [signUpSuccess]);

  const onFormSubmit = (event) => {
    event.preventDefault();
    emailOnBlurHandler();
    passwdOnBlurHandler();
    setUserExists(false);
    setSignUpSuccess(false);
    setFormIsSubmitted(true);
    if (formIsValid) {
      axios
        .post("http://localhost:3001/api/auth/user/exists", {
          email: emailEnteredValue,
        })
        .then((res) => {
          if (!res.data.exists) {
            axios
              .post("http://localhost:3001/api/auth/signup", {
                email: emailEnteredValue,
                password: passwdEnteredValue,
              })
              .then((res) => {
                if (res.data.success) {
                  setSignUpSuccess(true);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setUserExists(true);
            setFormIsSubmitted(false);
          }
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
      {signUpSuccess && (
        <p className="info-label">
          Thank you registering. Please verify your email and
          <Link to="/login">Login</Link>
        </p>
      )}
      <p className="error-label">
        {formIsSubmitted && !formIsValid && "Please clear all form errors."}
      </p>
      <div className="signup-form">
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
          <p className="error-label">
            {userExists &&
              !emailInputHasError &&
              "User with that email already exists"}
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
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
