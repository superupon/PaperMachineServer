qcloud = require('./qcloud')
const { mysql } = qcloud
// Global Data structure to store Black List in memory
var BlackList = []
// Load data from data base
//loadBlacklist()

//setInterval(detectBlackList, 1000)
//setInterval(loadBlacklist, 2000)

//mysql.schema.createTable('blacklist', function(table) {
//   table.increments();
//   table.string('name')
//}).then(res=>{console.log(res)})
//mysql('blacklist').insert({name : 'test'}).returning('*').then(res=> {console.log(res)})
//mysql('blacklist').select('*').returning('*').then(res=> {console.log(res)})

// determine username is in black list or not
var blacklist = {}
blacklist.isInBlacklist = function(username)
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

blacklist.detectBlackList = function() {
    currentTime = new Date()
    minutes = 5
    tapCnt = 10
    targetTime = currentTime - minutes * 1000 * 60
    date = new Date(targetTime)
    console.log('detect black list')
    users = []
    test = {}
    //mysql('request').select('wx_id').where('time' > targetTime).returning('*').then(res => { console.log(res) })
    mysql('request').select('wx_id').where('time', '>', date).groupBy('wx_id').returning('*')
        .then(res => {
            //console.log(res)
            for (var temp in res) {
                console.log(res[temp]['wx_id'])
                mysql('request').select('wx_id').where('wx_id', res[temp]['wx_id']).andWhere('time', '>' , date).count('wx_id as cnt').returning('*')
                    .then(rs => {
                            //console.log(rs)
                            for (var record in rs){
                                if(rs[record]['cnt'] > tapCnt){
			            console.log('bad user detedted')
                                    if(!blacklist.isInBlacklist(rs[record]['wx_id']))
                                    {
			                console.log('add into blacklist')
                                        mysql('blacklist').insert({name : rs[record]['wx_id']}).returning('*').then(res=>{console.log(res)})
                                    }
                                }
                            }
                        })
            }
        })
    //console.log(users)
}

blacklist.loadBlacklist = function()
{
    console.log('load')
    mysql('blacklist').select('name').returning('*').then(
        res => { BlackList = res }
    )
}

module.exports = blacklist
