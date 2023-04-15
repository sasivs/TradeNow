import './cards.css';

function DashboardCards(props){
    return (
        <div className="usage-card">
            <div className='row'>
                <div className='col-3'>
                    <img className='highlights-card-img' src={props.src} alt={props.alt}/>
                </div>
                <div className='col'>
                    <div className='dashboard-card-description'>
                        <h4>{props.description}</h4>
                        <p>{props.title}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards;