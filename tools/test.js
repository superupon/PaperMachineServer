qcloud = require('../qcloud')
const {mysql} = qcloud
var now = Date.now()
console.log(now)
var date = new Date()
console.log(date)
//mysql('request').select('*').then(function(data)
//{
//  if(data)
//    console.log(data)
//})
var back = mysql('request').insert({wx_id:'linux', device_id:'40023123', time: date}).returning('*').then(res=>{console.log(res)})

//console.log(back)
//var knex = require('knex')

