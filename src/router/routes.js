import Main from "../pages/Main/Main";
import Listing from "../pages/Listing/Listing";
import {LISTING_ROUTE, USER_ROUTE} from "../consts";
import User from "../pages/User/User";

const routes = [
    {
        path: '/',
        component: Main
    },
    {
        path: `/${LISTING_ROUTE}/:id`,
        component: Listing
    },
    {
        path: `/${USER_ROUTE}/:id`,
        component: User
    }
]
export default routes