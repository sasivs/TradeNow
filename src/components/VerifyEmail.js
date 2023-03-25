import { useInput } from "../customHooks/useInput";
import axios from "axios";

const VerifyEmail = (props) => {
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return { isValid: regex.test(email), message: "" };
  };

  const {
    value: emailEnteredValue,
    hasError: emailInputHasError,
    isValid: emailIsValid,
    inputChangeHanlder: emailOnChangeHandler,
    inputOnBlurHandler: emailOnBlurHandler,
  } = useInput(validateEmail);

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (emailIsValid){
        axios.post("http://localhost:3001/api/auth/user/exists", {
            email: emailEnteredValue,
          }).then((res)=>{
            if(res.data.exists){
                axios
                .post("http://localhost:3001/api/auth/emailVerification", {
                  email: emailEnteredValue,
                })
                .then((res) => {
                  if (res.data.success) {
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
    }
  };

  return (
    <div>
      <div className="verifyemail-form">
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
            type={"submit"}
            value={"Continue"}
            className="continue-btn btn"
          />
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;