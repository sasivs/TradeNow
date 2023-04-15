import NavTitle from './NavTitle';
import NavItemImg from './NavItemImg';
import NavItemRight from './NavItemRight';
import NavItemLeft from './NavItemLeft';

import userImg from "../assets/images/user.jpg"
import './dashboardNav.css'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

function DashboardNav(){
    const location = useLocation();
    const history = useHistory();
    const onClickLogOutHandler = ()=>{
        axios.post("http://localhost:3001/api/auth/user/logout",{}, {
            headers:{
              authtoken: localStorage.getItem("token"),
            }
          }).then((res)=>{
            localStorage.removeItem("token");
            if(res.data.success){
                history.push("/");
                return ;
            }
        })
    }

    return (
        <div>
            <div className="dashboard-nav">
                <NavTitle title={'TradeNow'}/>
                <div className='dashboard-nav-left nav-left'>
                    <NavItemLeft active={location.pathname === '/user/home'} link={"/user/home"} name={'Home'}/>
                    <NavItemLeft active={location.pathname === '/user/trade'} link={"/user/trade"} name={'Trade'}/>
                </div>
                <div className='dashboard-nav-right nav-right'>
                    <NavItemImg src={userImg} alt={"User"}/>
                    <NavItemRight onClick={onClickLogOutHandler} link={"#"} name={"Logout"}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardNav;