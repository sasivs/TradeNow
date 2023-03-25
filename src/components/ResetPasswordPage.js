import ResetPassword from "./ResetPassword";
import RegLoginParent from "./RegLoginParent";

function ResetPasswordPage(props) {
  props = {
    email: {
      side_head: ["Buy, Sell,", "Invest,", "Learn, Analyze,", "Repeat"],
      title: "TradeNow",
    },
    childComponent: ResetPassword,
    childTitle: "Reset Password",
  };

  return (
    <div className="resetpassword-container">
      <RegLoginParent
        side_head={props.email.side_head}
        title={props.email.title}
        childComponent={props.childComponent}
        childTitle={props.childTitle}
      />
    </div>
  );
}

export default ResetPasswordPage;
