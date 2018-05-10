async function get (ctx, next) {
    console.log('data get')
    console.log(ctx)
}

async function post (ctx, next) {
    console.log('data post')
    console.log(ctx)
}

module.exports = {
    post,
    get
}