import './cards.css';

function ContactCard(props){
    return (
        <div className="conatct-card">
            <img className="contact-card-img" src={props.src} alt={props.alt}/>
            <div className='contact-description-container'>
                <p className='contact-description'>{props.description}</p>
            </div>
        </div>
    )
}

export default ContactCard;