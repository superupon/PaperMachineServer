qcloud = require('../qcloud')
const { mysql } = qcloud
var blacklist = require('../blacklist')
var database = require('../database')

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
    var user_id = ctx.query['user_id']
    var op_id = ctx.query['open_id']
    var pattern = /wx([0-9]+)/
    var result = request_string.match(pattern)
    retVal = {}
    retVal['is_first'] = false
    retVal['is_prized'] = 0
    retVal['prize_name'] = ''
    console.log(retVal)

    if (result != null) {
        var number = result[1]
        if (socket_list == undefined)
            console.log('Error: undefined socket list')

        // Request machine is in active list, send command
        if (number in socket_list && socket_state[number]) {
            console.log(user_id)
            console.log('is in black list: ' + blacklist.isInBlacklist(user_id))
            if(!blacklist.isInBlacklist(user_id))
            {
                 console.log('number ' + number)
                 socket_list[number].write('ONE')
                 console.log('write')

                 is_prized = false
                 isFirstTimeToday = false
                 prizeInfo = await database.getPrizeInfo(number)
                 console.log(prizeInfo)
                 if (prizeInfo.prize_activation != 0) {
                    userIdCnt = await database.getTodayCntForUserName(user_id)
                    openIdCnt = await database.getTodayCntForOpenId(op_id)
                    if(op_id == undefined)
                      openIdCnt = 0
                    isFirstTimeToday = (userIdCnt == 0 && openIdCnt == 0)
                    // TODO delete this line, debug purpose
                    isFirstTimeToday = true
                    console.log('userInCnt ' + userIdCnt)
                    console.log('openIdCnt ' + openIdCnt)
                    console.log('isFirstTimeToday ' + isFirstTimeToday)
                    if(isFirstTimeToday && prizeInfo.prize_uplimit > 0)
                    {
                       randVal = Math.random()
                       console.log('randVal ' + randVal)
                       if(randVal < prizeInfo.prize_rate)
                         is_prized = true
                    }
                 }

                 // insert new database record when successfullly find the device
                 mysql('request').insert({ wx_id: user_id, open_id : op_id , device_id: number, time: date, isPrized : is_prized }).returning('*').then(res => { console.log(res) })
                 if(is_prized)
                   await database.setPrizeUpLimit(number, prizeInfo.prize_uplimit - 1)
                 retVal['is_first'] = isFirstTimeToday
                 retVal['is_prized'] = is_prized
                 retVal['prize_name'] = prizeInfo.prize_name
            }
        } // no command
        else
            console.log('No such socket ' + number)
        console.log(retVal)
        ctx.body = retVal
    }
}

module.exports = {
    post,
    get,
    socket_list,
    socket_state
}
