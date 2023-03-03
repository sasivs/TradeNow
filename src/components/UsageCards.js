import './cards.css';

function UsageCards(props){
    return (
        <div className="usage-card">
            <img className='usage-card-img' src={props.src} alt={props.title}/>
            <h4 className='card-description'>{props.description.title}</h4>
            <ul>
                {props.description.list.map((row, i) => <li key={i}>{row}</li>)}
            </ul>
        </div>
    )
}

export default UsageCards;