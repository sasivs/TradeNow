import EmailVerification from "./EmailVerification";

function SignUp(props){

    props = {
        email:{
            side_head: ["Buy, Sell,", "Invest,", "Learn, Analyze,", "Repeat"],
            title: "TradeNow"
        }
    }

    return (
        <div className="signup-container">
            <EmailVerification side_head={props.email.side_head} title={props.email.title}/>
        </div>
    );
}

export default SignUp;