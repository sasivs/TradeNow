import { Route, Switch } from "react-router-dom";

import MainDiv from "./components/MainDiv";
import MainNavbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Home from "./components/Home";
import UserTrade from "./components/UserTrade";
import SelectedSymbolState from "./context/stocks/selectedSymbolState";
import LoginState from "./context/login/loginState";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import UserBuy from "./components/UserBuy";
import UserSell from "./components/UserSell";

function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/user")) {
      document.body.style.backgroundColor = "#1E1E25";
    }
  }, []);

  return (
    <div>
      <SelectedSymbolState>
        <LoginState>
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
          <Route exact path="/user/home">
            <Home/>
          </Route>
          <Route exact path="/user/trade">
            <UserTrade/>
          </Route>
          <Route exact path="/user/buy">
            <UserBuy/>
          </Route>
          <Route exact path="/user/sell">
            <UserSell />
          </Route>
        </Switch>
        </LoginState>
      </SelectedSymbolState>
    </div>
  );
}

export default App;
