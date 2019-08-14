import { Switch } from 'react-router'
import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { useEffect } from 'react'
import uuid from 'uuid'

import routesCatalogue from './catalogue'

export default function Routers () {
     
    return (
        <Router>
            <Switch>
                {
                    routesCatalogue.map( route =>
                        <Route 
                        path={route.path} 
                        exact={route.exact}
                        component={route.component} 
                        key={uuid()}></Route>
                    )
                }
            </Switch>
        </Router>
    )
}