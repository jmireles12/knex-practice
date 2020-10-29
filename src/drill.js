require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

function searchByName(searchTerm) {
    knexInstance.from('shopping')
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByName('fish')

function paginateProducts(pageNumber) {
    const productsPerPage = 6
    const offset = productsPerPage * (pageNumber -1)
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(2)

function getProductsByDays(daysAgo) {
    knexInstance
        .select('name', 'date_added')
        .where('date_added', '<', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
        .from('shopping')
        .orderBy([
            { column: 'date_added', order: 'DESC'},
        ])
        .then(result => {
            console.log(result)
        })
}

getProductsByDays(2)

function totalCostByCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping')
        .groupBy('category')
        .then(result => {
            console.log('Cost Per Category')
            console.log(result)
        })
}

totalCostByCategory()