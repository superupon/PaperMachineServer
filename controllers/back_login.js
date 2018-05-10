async function get (ctx, next) {
    console.log('back_login get')
    console.log(ctx)
}

async function post (ctx, next) {
    console.log('back_login post')
    console.log(ctx)
}

module.exports = {
    post,
    get
}