import LoginContext from "./loginContext";
import { useState } from "react";

function LoginState(props) {
  const [login, setLogin] = useState(false);
  const updateLogin = (state) => {
    setLogin(state);
  };
  return (
    <LoginContext.Provider
      value={{ login, updateLogin }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginState;
