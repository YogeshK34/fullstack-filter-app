use std::{env, io::Result};
use actix_web::{web, App, HttpServer};
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
        App::new()
        .app_data(web::Data::new(db_pool.clone()))
        .route("/", web::get().to(get_students))
        .route("/users", web::post().to(create_student))
        .route("/updateuser/{id}", web::put().to(update_students))
        .route("/deleteuser/{id}", web::delete().to(delete_students))
    })
    .bind(addr)?
    .run()
    .await
}
