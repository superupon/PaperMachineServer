qcloud = require('./qcloud')
const { mysql } = qcloud
// Global Data structure to store Black List in memory
var BlackList = []
// Load data from data base
loadBlacklist()

setInterval(detectBlackList, 1000)
setInterval(loadBlacklist, 2000)
//mysql.schema.createTable('blacklist', function(table) {
//   table.increments();
//   table.string('name')
//}).then(res=>{console.log(res)})
//mysql('blacklist').insert({name : 'test'}).returning('*').then(res=> {console.log(res)})
//mysql('blacklist').select('*').returning('*').then(res=> {console.log(res)})

// determine username is in black list or not
function isInBlacklist(username)
{
    for (var temp in BlackList)
    {
       if(username == BlackList[temp]['name']) 
       {
          return true
       }
    }
    return false
}

function detectBlackList() {
    currentTime = new Date()
    minutes = 4
    tapCnt = 4
    //targetTime = currentTime - minutes * 1000 * 60 
    targetTime = currentTime - minutes * 1000 * 60 * 60
    console.log("HaHa")
    date = new Date(targetTime)
    console.log(date)
    users = []
    test = {}
    //mysql('request').select('wx_id').where('time' > targetTime).returning('*').then(res => { console.log(res) })
    mysql('request').select('wx_id').where('time', '>', date).groupBy('wx_id').returning('*')
        .then(res => {
            //console.log(res)
            for (var temp in res) {
                //console.log(res[temp]['wx_id'])
                mysql('request').select('wx_id').where('wx_id', res[temp]['wx_id']).count('wx_id as cnt').returning('*')
                    .then(rs => {
                            for (var record in rs){
                                //console.log(rs[record]['cnt'])
                                if(rs[record]['cnt'] > tapCnt){
                                    console.log('add into blacklist')
                                    //mysql('blacklist').insert({name : rs[record]['wx_id']}).returning('*').then(res=>{console.log(res)})
                                    console.log('isInBlackList ' + isInBlacklist(rs[record]['wx_id']))
                                    if (rs[record]['wx_id'] in BlackList){
                                        console.log('in blacklist')
                                    }
                                }
                            }
                            console.log(rs)
                        })
            }
        })
    //console.log(users)
}

function loadBlacklist()
{
    mysql('blacklist').select('name').returning('*').then(
        res => { BlackList = res
        console.log('blacklist')
        console.log(BlackList)}
    )
}
