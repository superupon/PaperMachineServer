var database = require('../database')
var socket_list = require('./request').socket_list
var socket_state = require('./request').socket_state
async function getNewDevices() {
    var result = []
    console.log(socket_list)
    console.log(result)
    console.log(typeof(result))
    for(var socket in socket_list)
    {
       if(socket_list[socket].writable && socket_state[socket])
       { 
          console.log('socket' + socket)
          var has_device = await database.hasDevice(socket)
          console.log('has_device ' + has_device)
          if(!has_device){
              console.log('push: '+socket)
              if(socket.length == 15)
                  result.push({'card_id' : socket})
          }
       }
    }
    return result
}
async function get (ctx, next) {
    ret = []
    console.log('data get')
    if ( ctx.query['type'] == 2)
        ret = await database.getBlacklistUser(parseInt(ctx.query['offset']))
    else if (ctx.query['type'] == 1) {
        ret = await database.getDevices(parseInt(ctx.query['offset']))
        for(var temp in ret) {
            ret[temp].state = socket_state[ret[temp].card_id]
        }
    }
    else if (ctx.query['type'] == 3){
        if(await database.hasDevice(ctx.query['card_id'])){
            await database.deleteDevice(ctx.query['card_id'])
            await database.insertDevice(ctx.query['card_id'], ctx.query['number'], ctx.query['address'])
        }
        else
            await database.insertDevice(ctx.query['card_id'], ctx.query['number'], ctx.query['address'])
    }
    else if (ctx.query['type'] == 4) {
        ret = await getNewDevices()
        console.log(ret)
    }
    else if (ctx.query['type'] == 5) {
        console.log('delte blacklist')
        ret = await database.deleteBlacklistUser(parseInt(ctx.query['id']))
    }
    else if (ctx.query['type'] == 6) {
        response = {}
        result = await database.getDeviceRecord(ctx.query['card_id'], parseInt(ctx.query['offset']))
        response['records'] = result
        result = await database.getTotalRecordNumberForDeviceOneDate(ctx.query['card_id'], new Date())
        response['totalToday'] = result
        result = await database.getTotalRecordNumberForDevice(ctx.query['card_id'])
        response['total'] = result
        ret = response
    }
    else if (ctx.query['type'] == 7) {
        await database.deleteDevice(ctx.query['card_id'])
    }
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
