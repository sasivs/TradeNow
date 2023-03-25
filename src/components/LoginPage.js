import Login from "./Login";
import RegLoginParent from "./RegLoginParent";

function LoginPage(props) {
  props = {
    email: {
      side_head: ["Buy, Sell,", "Invest,", "Learn, Analyze,", "Repeat"],
      title: "TradeNow",
    },
    childComponent: Login,
    childTitle: "Login",
  };

  return (
    <div className="login-container">
      <RegLoginParent
        side_head={props.email.side_head}
        title={props.email.title}
        childComponent={props.childComponent}
        childTitle={props.childTitle}
      />
    </div>
  );
}

export default LoginPage;
