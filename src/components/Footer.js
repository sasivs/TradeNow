import instagramImg from '../assets/images/instagram.png';
import twitterImg from '../assets/images/twitter.png';
import linkedinImg from '../assets/images/linkedin.png';

import "./footer.css";

function Footer(props){
    return (
        <div className="footer">
            <div className="footer-title">
                <h3>{props.title}</h3>
            </div>
            <div className="footer-description">
                <p>{props.description}</p>
            </div>
            <div className="footer-connections">
                <a href={props.instagram_url}>
                    <div className="footer-connect-icon">
                        <img src={instagramImg} alt="instagram" />
                    </div>
                </a>
                <a href={props.twitter_url}>
                    <div className="footer-connect-icon">
                        <img src={twitterImg} alt="twitter" />
                    </div>
                </a>
                <a href={props.linkedin_url}>
                    <div className="footer-connect-icon">
                        <img src={linkedinImg} alt="twitter" />
                    </div>
                </a>
            </div>
            <hr/>
            <div className='footer-copyright'>
                <p>© Copyright 2019 TradeNow | All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer;