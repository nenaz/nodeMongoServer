import noteRoutes from "./note_routes";
export default function (app, db) {
    noteRoutes(app, db);
    // Тут, позже, будут и другие обработчики маршрутов 
}