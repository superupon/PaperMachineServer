qcloud = require('../qcloud')
const { mysql } = qcloud
var blacklist = require('../blacklist')

var socket_list = {}
var socket_state = {}
async function post(ctx, next) {
    console.log(ctx)
    console.log('post')
    ctx.body = 'success'
}

async function get(ctx, next) {
    console.log('Receive request from client')
    var date = new Date()
    var request_string = ctx.query['id']
    console.log('Request string: ' + request_string)
    var open_id = ctx.query['user_id']
    var pattern = /wx([0-9]+)/
    var result = request_string.match(pattern)

    if (result != null) {
        var number = result[1]
        if (socket_list == undefined)
            console.log('Error: undefined socket list')

        // Request machine is in active list, send command
        if (number in socket_list) {
            console.log(open_id)
            console.log('is in black list: ' + blacklist.isInBlacklist(open_id))
            if(!blacklist.isInBlacklist(open_id))
            {
                 // insert new database record when successfullly find the device
                 console.log('number ' + number)
                 socket_list[number].write('ONE')
                 mysql('request').insert({ wx_id: open_id, device_id: number, time: date }).returning('*').then(res => { console.log(res) })
                 console.log('write')
            }
        } // no command
        else
            console.log('No such socket ' + number)
    }
}

module.exports = {
    post,
    get,
    socket_list,
    socket_state
}
