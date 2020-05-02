// import noteRoutes from "./note_routes";
import { pushRoutes } from './push-routes';
import { moviesRoutes } from './movies-routes';
export default function (app, db) {
    // noteRoutes(app, db);
    pushRoutes(app, db);
    moviesRoutes(app, db);
    // Тут, позже, будут и другие обработчики маршрутов 
}