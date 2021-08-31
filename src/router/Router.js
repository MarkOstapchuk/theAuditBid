import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import routes from "./routes.js";

const Router = () => {
    return (
        <Switch>
            {routes.map((item, index)=>{
                return (
                    <Route key={index} path={item.path} component={item.component} exact/>
                )
            })}
            <Redirect to={'/'}/>
        </Switch>
    );
};

export default Router;