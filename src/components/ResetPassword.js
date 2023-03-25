import { useEffect, useState } from "react";
import { useInput } from "../customHooks/useInput";
import { Link } from "react-router-dom";

import axios from "axios";

const ResetPassword = () => {
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
    value: passwdEnteredValue,
    hasError: passwdHasError,
    isValid: passwdIsValid,
    inputChangeHanlder: passwdOnChangeHandler,
    inputOnBlurHandler: passwdOnBlurHandler,
    message: passwdMessage,
  } = useInput(validatePasswd);

  const {
    value: cnfrmPasswdEnteredValue,
    isValid: cnfrmPasswdIsValid,
    inputChangeHanlder: cnfrmPasswdOnChangeHandler,
    inputOnBlurHandler: cnfrmPasswdOnBlurHandler,
  } = useInput(validatePasswd);

  const [formIsValid, setFormIsValid] = useState(true);

  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (
      passwdIsValid &&
      cnfrmPasswdIsValid &&
      passwdEnteredValue === cnfrmPasswdEnteredValue
    ) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [
    passwdEnteredValue,
    cnfrmPasswdEnteredValue,
    passwdIsValid,
    cnfrmPasswdIsValid,
  ]);

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (formIsValid) {
      axios
        .post(
          "http://localhost:3001/api/auth/reset-forgot-password",
          {
            password: passwdEnteredValue,
          },
          {
            headers:{
              authtoken: localStorage.getItem("token"),
            }
          }
        )
        .then((res) => {
          if (!res.data.success) {
          } else {
            setResetSuccess(true);
          }
        });
    } else {
      console.log("Errr");
    }
  };
  return (
    <div>
      {resetSuccess && (
        <p className="info-label">
          Password is reset successfully. <Link to="/login">Login</Link> to
          continue
        </p>
      )}
      {!resetSuccess && (
        <div className="reset-password-form">
          <form onSubmit={onFormSubmit}>
            <input
              type={"password"}
              placeholder={"Your password"}
              className="password-input input"
              onChange={passwdOnChangeHandler}
              onBlur={passwdOnBlurHandler}
              value={passwdEnteredValue}
            />
            <input
              type={"text"}
              placeholder={"Confirm password"}
              className="password-input input"
              onChange={cnfrmPasswdOnChangeHandler}
              onBlur={cnfrmPasswdOnBlurHandler}
              value={cnfrmPasswdEnteredValue}
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
              value={"Reset"}
              className="continue-btn btn"
            />
            <br />
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
