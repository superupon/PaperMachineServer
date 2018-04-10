qcloud = require('../qcloud')
const { mysql } = qcloud
var blacklist = setInterval(detectBlackList, 10000)

function detectBlackList()
{
  console.log("HaHa")
  
}
