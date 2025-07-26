// create the connection string and db pool using Pgpool 
use sqlx::postgres::PgPoolOptions;
use std::env;

pub async fn get_db_pool() -> Result<sqlx::PgPool, sqlx::Error> {
    let db_url = format!(
        "postgres://{}:{}@{}:{}/{}",
        env::var("PG__USER").unwrap(),
        env::var("PG__PASSWORD").unwrap(),
        env::var("PG__HOST").unwrap(),
        env::var("PG__PORT").unwrap(),
        env::var("PG__DBNAME").unwrap()
    );

    // prints the connection url
    println!("{:?}",db_url);
    // create the db pool
    PgPoolOptions::new()
    .max_connections(5)
    .connect(&db_url)
    .await
}
