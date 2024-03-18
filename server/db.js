const pg = require('pg')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner_db')
const uuid = require('uuid')



const createTables = async() => {
    const SQL = `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS restaurant;
    DROP TABLE IF EXISTS customer;
    
    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        party_count INTEGER NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        reservation_time DATE
    );
    `
    // party_count INTEGER NOT NULL,
    await client.query(SQL)
}
const createCustomers = async(name) => {
    const SQL = `
    INSERT INTO customer(id, name) VALUES($1, $2)
    RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), name])
    return response.rows[0]
}
const createRestaurant = async(name) => {
    const SQL = `
        INSERT INTO restaurant(id, name) VALUES($1, $2)
        RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), name])
    return response.rows[0]
}
const fetchCustomers = async() => {
    const SQL = `
    SELECT * FROM customer
    `
    const response = await client.query(SQL)
    return response.rows
}
const fetchRestaurant = async() => {
    const SQL = `
    SELECT * FROM restaurant
    `
    const response = await client.query(SQL)
    return response.rows
}
const createReservation = async({party_count, customer_id, restaurant_id, reservation_time}) => {
    
    const SQL = `
    INSERT INTO reservation(id, party_count, customer_id, restaurant_id, reservation_time)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `
    
    const response = await client.query(SQL, [uuid.v4(), party_count, customer_id, restaurant_id, reservation_time])
    return response.rows[0]
}
const fetchReservation = async() => {
    const SQL = `
    SELECT * FROM reservation
    `
    const response = await client.query(SQL)
    return response.rows
}
const deleteReservation = async(id) => {
    const SQL = `
    DELETE FROM reservation
    WHERE id=$1
    `
    await client.query(SQL, [id])
}
module.exports = {
    client,
    createTables,
    createCustomers,
    createRestaurant,
    fetchCustomers,
    fetchRestaurant,
    createReservation,
    fetchReservation,
    deleteReservation
}