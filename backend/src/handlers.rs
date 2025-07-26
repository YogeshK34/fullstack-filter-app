// here we'll define the actual handlers like GET POST PUT DELETE 


// create student
use actix_web::{web, HttpResponse, Responder};
use sqlx::PgPool;

use crate::models::{StudentCreateStruct, StudentUpdateStruct, Students};

pub async fn create_student(
    db: web::Data<PgPool>,
    req: web::Json<StudentCreateStruct>,
) -> impl Responder {
    // write the sql query to create the user 
    let result = sqlx::query_as::<_, Students>(
        "INSERT INTO students (name, email, branch, building, floor, room_number, year, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *"
    )
    .bind(&req.name)
    .bind(&req.email)
    .bind(&req.branch)
    .bind(&req.building)
    .bind(&req.floor)
    .bind(&req.room_number)
    .bind(&req.year)
    .bind(&req.gender)
    .fetch_one(db.get_ref())
    .await;

    match result {
        Ok(students) => HttpResponse::Created().json(students),
        Err(e) => {
            eprintln!("DB error: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating user")
        }
    }
}

// update students
pub async fn update_students(
    db: web::Data<PgPool>,
    path: web::Path<i32>,
    req: web::Json<StudentUpdateStruct>,
) -> impl Responder {
    let student_id = path.into_inner();

    let result = sqlx::query_as::<_, Students>(
        "UPDATE students SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            branch = COALESCE($3, branch),
            building = COALESCE($4, building),
            floor = COALESCE($5, floor),
            room_number = COALESCE($6, room_number),
            year = COALESCE($7, year),
            gender = COALESCE($8, gender)
         WHERE id = $9
         RETURNING *"
    )
    .bind(&req.name)
    .bind(&req.email)
    .bind(&req.branch)
    .bind(&req.building)
    .bind(&req.floor)
    .bind(&req.room_number)
    .bind(&req.year)
    .bind(&req.gender)
    .bind(student_id)
    .fetch_one(db.get_ref())
    .await;

    match result {
        Ok(student) => HttpResponse::Ok().json(student),
        Err(e) => {
            eprintln!("DB error: {:?}", e);
            HttpResponse::InternalServerError().body("Error updating student")
        }
    }
}

// get students 
pub async fn get_students(
    db: web::Data<PgPool>
) -> impl Responder {
    let result = sqlx::query_as::<_, Students>(
        "SELECT * FROM students ORDER BY id"
    )   
    .fetch_all(db.get_ref())
    .await; 

    match result {
        Ok(students) => HttpResponse::Ok().json(students),
        Err(e) => {
            eprintln!("DB error {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching users")
        }
    }
}

// delete students 
pub async fn delete_students(
    db: web::Data<PgPool>,
    path: web::Path<i32>,
) -> impl Responder {
    let student_id = path.into_inner();

    let result = sqlx::query(
        "DELETE FROM students WHERE id = $1"
    )
    .bind(student_id)
    .execute(db.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("User deleted"),
        Err(e) => {
            eprintln!("DB error: {:?}", e);
            HttpResponse::InternalServerError().body("Error deleting user")
        } 
    }
}



