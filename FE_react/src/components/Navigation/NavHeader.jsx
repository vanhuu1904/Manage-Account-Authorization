import React, { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Nav.scss";
import logo from "../../logo.svg";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { logoutUser } from "../../services/userService";
import { toast } from "react-toastify";
const NavHeader = (props) => {
  const { user, logoutContext } = useContext(UserContext);
  console.log(">>>>check user: ", user);
  const navigate = useNavigate();
  const handleLogout = async () => {
    let data = await logoutUser();
    console.log(">>>check data: ", data);
    if (data && data.EC === 0) {
      localStorage.removeItem("jwt"); //clear local storage
      logoutContext(); //clear context
      toast.success("Logout succeeds...");
      navigate("/login");
    } else {
      toast.error(data.EM);
    }
  };
  return (
    <>
      <div className="nav-header">
        <Navbar expand="lg" bg="header">
          <Container>
            <Navbar.Brand href="#home">
              <img
                src={logo}
                width={30}
                height={30}
                className="d-inline-block align-top mx-2"
              />
              <span className="brand-name">React</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavLink to={"/"} exact className={"nav-link"}>
                  Home
                </NavLink>
                <NavLink to={"/users"} className={"nav-link"}>
                  Users
                </NavLink>
                <NavLink to={"/roles"} className={"nav-link"}>
                  Role
                </NavLink>
                <NavLink to={"/group-role"} className={"nav-link"}>
                  Group-Role
                </NavLink>
                <NavLink to={"/projects"} className={"nav-link"}>
                  Project
                </NavLink>
                <NavLink to={"/about"} className={"nav-link"}>
                  About
                </NavLink>
              </Nav>
              <Nav>
                {user && user.isAuthenticated === true ? (
                  <>
                    <Nav.Item className="nav-link">
                      Welcome to {user.account.username}
                    </Nav.Item>
                    <NavDropdown title="Setting" id="basic-nav-dropdown">
                      <NavDropdown.Item>Change Password</NavDropdown.Item>
                      <NavDropdown.Item>
                        <span onClick={() => handleLogout()}>Log out</span>{" "}
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <Outlet />
    </>
  );
};

export default NavHeader;
