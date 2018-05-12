var database = require('../database')

async function get (ctx, next) {
    console.log('back_login get')
    console.log(ctx.query['name'])
    console.log(ctx.query['password'])
    ctx.body = "HiHi"
    database.isAdminUser(ctx.query['name'], ctx.query['password'])
}

async function post (ctx, next) {
    console.log('back_login post')
    console.log(ctx)
}

module.exports = {
    post,
    get
}