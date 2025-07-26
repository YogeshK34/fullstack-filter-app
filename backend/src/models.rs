// define the models structure of the student table 

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

// this is the structure of the request, user will pass to create a student table in the db
#[derive(Deserialize)]
pub struct StudentCreateStruct {
    pub name: String,
    pub email: String,
    pub branch: String,
    pub building: String,
    pub floor: i32,
    pub room_number: String,
    pub year: i32,
    pub gender: String,
}

// this is the structure of how Student will be stored in the DB
#[derive(Serialize, FromRow)] 
pub struct Students {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub branch: String,
    pub building: String,
    pub floor: i32,
    pub room_number: String,
    pub year: i32,
    pub gender: String,
    pub created_at: chrono::NaiveDateTime,
}


// structure to update Student table
#[derive(Deserialize)]
pub struct StudentUpdateStruct {
    pub name: String,
    pub email: String,
    pub branch: String,
    pub building: String,
    pub floor: i32,
    pub room_number: String,
    pub year: i32,
    pub gender: String,
}