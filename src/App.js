import { Route, Switch } from "react-router-dom";

import MainDiv from "./components/MainDiv";
import MainNavbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <MainNavbar />
          <MainDiv />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/reset-password">
          <ResetPasswordPage />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
