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
    console.log('getBlacklistUser')
    await mysql('blacklist')
    .select('*')
    .limit(10)
    .offset(ofst)
    .then(res => {
        console.log(res)
        ret = res
    })
    return ret
}

database.Test = async function() {
    result = await database.isAdminUser('hi', 'hi')
    console.log(result)
    result = await database.isAdminUser('root', 'root')
    console.log(result)

    // Test getBlacklistUser
    result = await database.getBlacklistUser(0)
    console.log(result)
    result = await database.getBlacklistUser('0')
    console.log(result)
}

module.exports = database
database.Test()
