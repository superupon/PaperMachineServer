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

database.Test = async function() {
    result = await database.isAdminUser('hi', 'hi')
    console.log(result)
    result = await database.isAdminUser('root', 'root')
    console.log(result)
}

module.exports = database
database.Test()
