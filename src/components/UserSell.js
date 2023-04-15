import DashboardNav from "./DashboardNav";
import Sell from "./Sell";
import { useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import loginContext from "../context/login/loginContext";

function UserSell() {
  const { login, updateLogin } = useContext(loginContext);
  const history = useHistory();
  useEffect(() => {
    if (!login) {
      history.push("/login");
      return;
    }
  }, [login, history]);

  useEffect(() => {
    document.title = "Sell";
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/user")) {
      document.body.style.backgroundColor = "#1E1E25";
    }
  });
  return (
    <>
      <DashboardNav />
      <Sell />
    </>
  );
}

export default UserSell;
