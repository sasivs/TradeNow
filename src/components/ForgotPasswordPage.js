import ForgotPassword from "./ForgotPassword";
import RegLoginParent from "./RegLoginParent";

function ForgotPasswordPage(props) {
  props = {
    email: {
      side_head: ["Buy, Sell,", "Invest,", "Learn, Analyze,", "Repeat"],
      title: "TradeNow",
    },
    childComponent: ForgotPassword,
    childTitle: "Forgot Password",
  };

  return (
    <div className="forgotpassword-container">
      <RegLoginParent
        side_head={props.email.side_head}
        title={props.email.title}
        childComponent={props.childComponent}
        childTitle={props.childTitle}
      />
    </div>
  );
}

export default ForgotPasswordPage;
