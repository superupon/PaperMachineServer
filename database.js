qcloud = require('./qcloud')
const { mysql } = qcloud
var database = {}

database.isAdminUser = async function(username, pswd) {
    ret = 0
    value = []
    await mysql('admin')
    .select('*')
    .where('name', username)
    .returning('*')
    .then(res => {
        ret = res.length
        value = res})
    if(ret == 0)
        return false
    else {
        if (value[0]['password'] == pswd)
            return true
        else
            return false
    }
}

database.getBlacklistUser = async function(ofst) {
    ret = []
    await mysql('blacklist')
    .select('*')
    .limit(10)
    .offset(ofst)
    .then(res => {
        ret = res
    })
    return ret
}

database.getDevices = async function(ofst) {
    ret = []
    await mysql('devices')
    .select('*')
    .limit(10)
    .offset(ofst)
    .then(res => {
        ret = res
    })
    return ret
}

database.hasDevice = async function(deviceCardId){
    ret = false
    await mysql('devices')
    .select('*')
    .where('card_id', deviceCardId)
    .then(res => {
    ret = (res.length > 0)})
    return ret
}

database.insertDevice = async function(deviceCardId, deviceNumber, deviceAddress){
    await mysql('devices')
    .insert({card_id : deviceCardId,
             number : deviceNumber,
             address : deviceAddress})
}

database.deleteDevice = async function(deviceCardId) {
    await mysql('devices')
    .where('card_id', deviceCardId)
    .del()
}

database.Test = async function() {
    console.log('---------------isAdminUser--------')
    result = await database.isAdminUser('hi', 'hi')
    console.log(result)
    result = await database.isAdminUser('root', 'root')
    console.log(result)

    // Test getBlacklistUser
    console.log('---------------getBlacklistUser--------')
    result = await database.getBlacklistUser(0)
    console.log(result)
    //result = await database.getBlacklistUser('0')
    //console.log(result)

    console.log('---------------getDevices--------')
    result = await database.getDevices(0)
    console.log(result)
    //result = await database.getDevices('0')
    //console.log(result)

    console.log('---------------hasDevice---------')
    result = await database.hasDevice('460068111016044')
    console.log('has device 460068111016044: ' + result)
    result = await database.hasDevice('4600681110160')
    console.log('has device 4600681110160: ' + result)

    console.log('---------------insertDevice-------')
    await database.insertDevice('460068111016044', '1', 'site A')
    result = await database.getDevices(0)
    console.log(result)

    console.log('---------------deleteDevice-------')
    await database.deleteDevice('460068111016044')
    result = await database.getDevices(0)
    console.log(result)
    await database.deleteDevice('')
    result = await database.getDevices(0)
    console.log(result)
}

module.exports = database
//database.Test()
