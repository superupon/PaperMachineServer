// helpful script to support databse creation
qcloud = require('./qcloud')
const { mysql } = qcloud
function createAdmin() {
    mysql.schema.createTable('admin', function (table) {
        table.string('name')
        table.string('password')
        table.timestamps()
    }).then(res => {console.log(res)})
}

function createDevices() {
    mysql.schema.createTable('devices', function (table){
       table.string('card_id')
       table.string('number')
       table.string('address')
    }).then(res => {console.log(res)})
}

function insertDevices() {
    mysql('devices')
        .insert({ card_id : '460068111016044',
                  number : '1'})
        .then(res => { console.log(res)})

}

function insertRootAccount() {
    mysql('admin')
        .insert({ name: 'root', password: 'root' })
        .then(res => { console.log(res) })
}

function getAdminAccounts() {
    mysql('admin')
        .select('*')
        .then(res => {
            console.log(res)
        })
}

//createAdmin()
//insertRootAccount()
//getAdminAccounts()
//createDevices()
//insertDevices()
