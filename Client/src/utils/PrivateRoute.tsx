import {Redirect, Route} from "react-router-dom";
import AuthService from "../services/AuthService.js";
import {useState} from "react";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const [isAuthenticated] = useState(AuthService.isAuthenticated);
    return (
        isAuthenticated ? <Component {...rest}/> : <Redirect to="/"/>
    )
}
export default PrivateRoute;
