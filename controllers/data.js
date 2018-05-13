var database = require('../database')
async function get (ctx, next) {
    ret = []
    console.log('data get')
    if ( ctx.query['type'] == 2)
        ret = await database.getBlacklistUser(parseInt(ctx.query['offset']))
    ctx.body = ret
}

async function post (ctx, next) {
    console.log('data post')
    console.log(ctx)
}

module.exports = {
    post,
    get
}
