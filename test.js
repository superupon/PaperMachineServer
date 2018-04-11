qcloud = require('./qcloud')
const { mysql } = qcloud
var blacklist = setInterval(detectBlackList, 1000)
//mysql.schema.createTable('blacklist', function(table) {
//   table.increments();
//   table.string('name')
//}).then(res=>{console.log(res)})
//mysql('blacklist').insert({name : 'test'}).returning('*').then(res=> {console.log(res)})
mysql('blacklist').select('*').returning('*').then(res=> {console.log(res)})

function detectBlackList() {
    currentTime = new Date()
    minutes = 4
    tapCnt = 10
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
            console.log(res)
            for (var temp in res) {
                console.log(res[temp]['wx_id'])
                mysql('request').select('wx_id').where('wx_id', res[temp]['wx_id']).count('wx_id as cnt').returning('*')
                    .then(rs => {
                            for (var record in rs){
                                console.log(rs[record]['cnt'])
                                if(rs[record]['cnt'] > tapCnt){
                                    mysql('blacklist').insert({name : res[temp]['wx_id']}).returning('*')
                                }
                            }
                            console.log(rs)
                        })
            }
        })
    console.log(users)
}
