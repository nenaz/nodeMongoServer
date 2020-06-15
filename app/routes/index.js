// import noteRoutes from "./note_routes";
import { pushRoutes } from './push-routes';
import { moviesRoutes } from './movies-routes';
import { posRoutes } from './pos-routes';
export default function (app, db) {
    // noteRoutes(app, db);
    pushRoutes(app, db);
    moviesRoutes(app, db);
    posRoutes(app, db);
    // Тут, позже, будут и другие обработчики маршрутов 
}