import SvgCurve from "./SvgCurve"
import MainText from "./MainText";
import UsageCards from "./UsageCards";
import ContactCard from "./ContactCard";
import Footer from "./Footer";

import eKYCImg from '../assets/images/eKYC.jpg';
import dematImg from '../assets/images/demat.jpg';
import tradeImg from '../assets/images/trade.jpg';
import supportImg from '../assets/images/support.png';
import newsImg from '../assets/images/news.png';

import './MainContainer.css'

function MainDiv(){
    let props={
        description:[
            {title: 'KYC', list:['Easy e-KYC', 'Link Bank Account']},
            {title:'DEMAT', list:['Go Demat', 'Get Invoices', 'Dive through history']},
            {title:'Invest', list:['Jump and trade', 'Check Statistics', 'Analyse']}
        ],
        footer:{
            title: "TradeNow",
            description: "TradeNow is a trading platform which intends to offer its services across the globe.It expected to include a wallet based system and also a recommender system to help users in their investments.",
            instagram_url: "",
            twitter_url: "",
            linkedin_url: "",
        }
    }
    return (
        <div>
            <div className="main-container">
                <MainText/>
            </div>
            <div>
                <SvgCurve/>
            </div>
            <div className="usage-container">
                <div className="row">
                    <div className="col">
                        <UsageCards src={eKYCImg} alt={'eKYC'} description={props.description[0]}/>
                    </div>
                    <div className="col">
                        <UsageCards src={dematImg} alt={'demat-account'} description={props.description[1]}/>
                    </div>
                    <div className="col">
                        <UsageCards src={tradeImg} alt={'trade'} description={props.description[2]}/>
                    </div>
                </div>
            </div>
            <div className="contact-container">
                <div className="contact-head">
                    <h2 className="head">Stay with us</h2>
                </div>
                <div className="row">
                    <div className="col">
                        <ContactCard src={supportImg} alt={"support"} description={"Our team provides 24/7 support and query clarification"}/>
                    </div>
                    <div className="col">
                        <ContactCard src={newsImg} alt={"news"} description={"Stock news and updates helps in deciding the stock to trade"}/>
                    </div>
                </div>
            </div>
            <div className="footer-container">
                <Footer title={props.footer.title} description={props.footer.description} instagram_url={props.footer.instagram_url} 
                twitter_url={props.footer.twitter_url} linkedin_url={props.footer.linkedin_url}
                />
            </div>
        </div>
    )
}

export default MainDiv; 