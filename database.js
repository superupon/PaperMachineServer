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

database.deleteBlacklistUser = async function(number) {
    ret = []
    await mysql('blacklist')
    .where('id', number)
    .del()
}

database.getDevices = async function(ofst) {
    ret = []
    await mysql('devices')
    .select('*')
    .orderBy('card_id', 'asc')
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

database.insertDevice = async function (
  deviceCardId,
  deviceNumber,
  deviceAddress,
  prizeActivation,
  prizeName,
  prizeRate,
  prizeUpLimit) {
  await mysql('devices')
    .insert({
      card_id: deviceCardId,
      number: deviceNumber,
      address: deviceAddress,
      prize_activation: prizeActivation,
      prize_name: prizeName,
      prize_rate: prizeRate,
      prize_uplimit: prizeUpLimit
    })
}

database.deleteDevice = async function (deviceCardId) {
  await mysql('devices')
    .where('card_id', deviceCardId)
    .del()
}

database.getDeviceRecord = async function(deviceCardId, ofst) {
    ret = []
    await mysql('request')
    .select('*')
    .where('device_id', deviceCardId)
    .limit(10)
    .offset(ofst)
    .orderBy('time','desc')
    .then(res => {
        ret = res
    })

    for(var index in ret)
    {
        ret[index].time = ret[index].time.toLocaleDateString() + ' ' + ret[index].time.toLocaleTimeString()
    }

    return ret
}

database.getTotalRecordNumberForDevice = async function(deviceCardId) {
    ret = 0
    await mysql('request')
    .select('*')
    .where('device_id', deviceCardId)
    .count('device_id as cnt')
    .then(res => {
        ret = res[0].cnt
    })
    return ret
}

database.getTotalRecordNumberForDeviceOneDate = async function(deviceCardId, date) {
    ret = 0
    date = date - (date % 86400000) - 8 * 60 * 60 * 1000
    await mysql('request')
    .select('*')
    .where('device_id', deviceCardId)
    .where('time', '>' , new Date(date))
    .count('device_id as cnt')
    .then(res => {
        ret = res[0].cnt
    })
    return ret
}

database.getTotalUserNumForDevice = async function(deviceCardId) {
   ret = 0
   await mysql('request')
   .select('*')
   .where('device_id', deviceCardId)
   .groupBy('wx_id')
   .then(res => {
       ret = res.length
   })
   return ret
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
    //await database.insertDevice('460068111016044', '1', 'site A')
    //result = await database.getDevices(0)
    //console.log(result)

    console.log('---------------deleteDevice-------')
    //await database.deleteDevice('460068111016044')
    //result = await database.getDevices(0)
    //console.log(result)
    await database.deleteDevice('')
    result = await database.getDevices(0)
    console.log(result)

    console.log('---------------getDeviceRecord-----')
    result = await database.getDeviceRecord('460068111016038', 0)
    console.log(result)
    result = await database.getDeviceRecord('460043906007803', 0)
    console.log(result)
    result = await database.getDeviceRecord('460068111016040', 0)
    console.log(result)

    console.log('---------------getTotalRecordNumberForDevice-------')
    result = await database.getTotalRecordNumberForDevice('460068111016038')
    console.log('460068111016038 total number: ' + result)
    result = await database.getTotalRecordNumberForDevice('460043906007809')
    console.log('460043906007809 total number: ' + result)

    console.log('---------------getTotalRecordNumberForDeviceOneDate-------')
    result = await database.getTotalRecordNumberForDeviceOneDate('460068111016038', new Date())
    console.log('460068111016038 total number: ' + result)
    result = await database.getTotalRecordNumberForDeviceOneDate('460043906007809', new Date())
    console.log('460043906007809 total number: ' + result)
    result = await database.getTotalRecordNumberForDeviceOneDate('460068111016035', new Date())
    console.log('460068111016035 total number: ' + result)

    console.log('---------------getTotalUserNumForDevice-------')
    result = await database.getTotalUserNumForDevice('460068111016038')
    console.log('460068111016038 user number: ' + result)
    result = await database.getTotalUserNumForDevice('460043906007809')
    console.log('460043906007809 user number: ' + result)

    //date = new Date()
    //mysql('request').insert({wx_id : '渔人不渔', device_id : '460043906007809', time : date}).returning('*').then(res=> {console.log(res)})

}
module.exports = database
