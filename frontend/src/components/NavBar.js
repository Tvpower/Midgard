import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/home" className="navbar-link">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/content" className="navbar-link">Content</NavLink>
                </li>
                <li>
                    <NavLink to="/settings" className="navbar-link">Settings</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;