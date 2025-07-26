use std::{env, io::Result, vec};
use actix_cors::Cors;
use actix_web::{http, web, App, HttpServer};
use dotenv::dotenv;
use db::get_db_pool;

use crate::handlers::{create_student, delete_students, get_students, update_students};

mod db;
mod models;
mod handlers;


#[actix_web::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let addr = env::var("SERVER_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string());
    let db_pool = get_db_pool().await.expect("Failed to create DB pool");

    println!("Server is running at http://{}", addr);

    HttpServer::new(move || {

        // cors setup
        let cors = Cors::default()
        .allowed_origin("http://localhost:3000")
        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
        .allowed_headers(vec![http::header::CONTENT_TYPE])
        .max_age(3600);

        App::new()
        .wrap(cors)
        .app_data(web::Data::new(db_pool.clone()))
        .route("/", web::get().to(get_students))
        .route("/students", web::post().to(create_student))
        .route("/update/{id}", web::put().to(update_students))
        .route("/delete/{id}", web::delete().to(delete_students))
    })
    .bind(addr)?
    .run()
    .await
}
