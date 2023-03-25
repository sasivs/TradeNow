import Register from "./Register";
import RegLoginParent from "./RegLoginParent";

function SignUp(props) {
  props = {
    email: {
      side_head: ["Buy, Sell,", "Invest,", "Learn, Analyze,", "Repeat"],
      title: "TradeNow",
    },
    childComponent: Register,
    childTitle: "Register",
  };

  return (
    <div className="signup-container">
      <RegLoginParent
        side_head={props.email.side_head}
        title={props.email.title}
        childComponent={props.childComponent}
        childTitle={props.childTitle}
      />
    </div>
  );
}

export default SignUp;
