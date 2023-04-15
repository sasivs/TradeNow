import NavTitle from './NavTitle';
import NavItemLeft from './NavItemLeft';
import NavItemRight from './NavItemRight'; 
import { useLocation } from 'react-router-dom';

import './Navbar.css'

function MainNavbar(){
    const location = useLocation();
    return (
        <div className='nav-bar'>
            <NavTitle title={'TradeNow'}/>
            <div className='nav-left'>
                <NavItemLeft active={location.pathname === '/trade'} link={"/trade"} name={'Trade'}/>
                <NavItemLeft active={location.pathname === '/contact'} link={"/contact"} name={'About us'}/>
            </div>
            <div className='nav-right'>
                <NavItemRight active={location.pathname === '/signup'} link={"/signup"} name={'Signup'}/>
                <NavItemRight active={location.pathname === '/login'} link={"login"} name={'Login'}/>
            </div>
        </div>
    )
}

export default MainNavbar;

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';


// function MainNavbar() {
//   return (
//     <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
//       <Container>
//         <Navbar.Brand href="#home">TradeNow</Navbar.Brand>
//         <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//         <Navbar.Collapse id="responsive-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link href="#features">Trade</Nav.Link>
//             <Nav.Link href="#pricing">About Us</Nav.Link>
//           </Nav>
//           <Nav>
//             <Nav.Link href="#deets">Sign Up</Nav.Link>
//             <Nav.Link eventKey={2} href="#memes">
//               Login
//             </Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }
