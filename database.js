qcloud = require('./qcloud')
const { mysql } = qcloud
var database = {}

database.isAdminUser = function(username, pswd)
{
    mysql('admin')
    .select({name : username, password : pswd})
    .returnning('*')
    .then(res => {
        console.log(username + pswd)
        console.log(res)})
}

module.exports = database