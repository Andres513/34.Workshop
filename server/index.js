
const express = require('express');
const app = express();

const {
    client,
    createTables,
    createCustomers,
    createRestaurant,
    fetchCustomers,
    fetchRestaurant,
    createReservation,
    fetchReservation,
    deleteReservation
} = require('./db');


app.use(express.json())

app.get('/api/reservation', async(req,res,next)=>{
    try {
        await res.send(await fetchReservation())

    } catch(error){
        next(error)
    }
})
app.get('/api/customer', async(req,res,next)=>{
    try{
        await res.send(await fetchCustomers())

    } catch(error) {
        next(error)
    }
})
app.get('/api/restaurant', async(req,res,next)=>{
    try{
        await res.send(await fetchRestaurant())

    } catch(error) {
        next(error)
    }
})
app.post('/api/customer/:id/reservation', async(req,res,next)=>{
    try {
        res.status(201).send(await createReservation(req.body))

    } catch(error) {
        next(error)
    }
})
app.delete('/api/customer/:customer_id/reservation/:id', async(req,res,next)=>{
    try{
        await deleteReservation(req.params.id)
        res.sendStatus(204)

    } catch(error) {
        next(error)
    }
})
const init = async() => {
await client.connect();
console.log('connected to database')

await createTables()
console.log('created tables')

const [andy, emily, david, jane, ramen, italian, japanese, greek ] = await Promise.all([
    createCustomers('andy'),
    createCustomers('emily'),
    createCustomers('david'),
    createCustomers('jane'),
    createRestaurant('ramen'),
    createRestaurant('italian'),
    createRestaurant('japanese'),
    createRestaurant('greek')
])
// console.log(`andy has an id of ${andy.id}`)
// console.log(`emily has an id of ${emily.id}`)
// console.log(`ramen has an id of ${ramen.id}`)
// console.log(`japanese has an id of ${japanese.id}`)
const customers = await fetchCustomers()
const restaurants = await fetchRestaurant()
console.log('List of customers:', customers)
console.log('List of restaurants:',restaurants)
await Promise.all([
    createReservation({party_count: 7, customer_id: andy.id, restaurant_id: ramen.id, reservation_time: '03/08/2024'}),
    createReservation({party_count: 2, customer_id: david.id, restaurant_id: italian.id, reservation_time: '03/9/2024'}),
    createReservation({party_count: 5, customer_id: emily.id, restaurant_id: greek.id, reservation_time: '03/10/2024'}),
    createReservation({party_count: 3, customer_id: jane.id, restaurant_id: japanese.id, reservation_time: '03/11/2024'})
])
const reservations = await fetchReservation()
console.log(reservations)
// await deleteReservation(reservations[0].id)
// console.log(await fetchReservation())

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log(`listening on port ${port}`))
}
init();