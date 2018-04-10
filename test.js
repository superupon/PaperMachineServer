qcloud = require('../qcloud')
const { mysql } = qcloud
var blacklist = setInterval(detectBlackList, 10000)

function detectBlackList()
{
    currentTime = new Date()
    minutes = 3
    targetTime = currentTime - minutes * 1000 * 60 
    console.log("HaHa")
    mysql('request').select('wx_id').where('time' > targetTime).returning('*').then(res => { console.log(res) })
}
