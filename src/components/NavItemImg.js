function NavItemImg(props) {
  return (
    <div className="nav-item nav-item-right">
      <img className=" nav-item-img" src={props.src} alt={props.alt} />
    </div>
  );
}

export default NavItemImg;
