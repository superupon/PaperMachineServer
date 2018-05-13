var database = require('../database')
var socket_list = require('./request').socket_list
async function getNewDevices() {
    var result = []
    console.log(socket_list)
    console.log(result)
    console.log(typeof(result))
    for(var socket in socket_list)
    {
       if(socket_list[socket].writable)
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
    else if (ctx.query['type'] == 1)
        ret = await database.getDevices(parseInt(ctx.query['offset']))
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
