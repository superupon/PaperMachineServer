qcloud = require('../qcloud')
const { mysql } = qcloud

var socket_list = {}
async function post(ctx, next) {
    console.log(ctx)
    console.log('post')
    ctx.body = 'success'
}

async function get(ctx, next) {
    console.log('Receive request from client')
    var date = new Date()
    var request_string = ctx.query['id']
    var open_id = ctx.query['user_id']
    var pattern = /wx([0-9]+)/
    var result = request_string.match(pattern)

    if (result != null) {
        var number = result[1]
        if (socket_list == undefined)
            console.log('Error: undefined socket list')

        // Request machine is in active list, send command
        if (number in socket_list) {
            socket_list[number].write('THREE')
            // insert new database record when successfullly find the device
            mysql('request').insert({ wx_id: open_id, device_id: number, time: date }).returning('*').then(res => { console.log(res) })
            console.log('write one')
        } // no command
        else
            console.log('No such socket ' + number)
    }
}

module.exports = {
    post,
    get,
    socket_list
}
