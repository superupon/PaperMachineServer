var database = require('../database')

async function get (ctx, next) {
    result = await database.isAdminUser(ctx.query['name'], ctx.query['password'])
    if ( result )
        ctx.body = { result : true}
    else
        ctx.body = { result : false}
}

async function post (ctx, next) {
    console.log('back_login post')
    console.log(ctx)
}

module.exports = {
    post,
    get
}
