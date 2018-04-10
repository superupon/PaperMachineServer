const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')

var net = require('net')
var HOST = '0.0.0.0'
var PORT = 3000
var socket = 0
var socket_list = require('./controllers/request.js').socket_list
// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// Start Application, Listeing Port
console.log("Listening")

app.listen(config.port, () => debug(`listening on port ${config.port}`))
var count = 0
net.createServer(function(sock){
  console.log('connected')
  socket = sock
  sock.on('close', function(data){
    console.log('closed')
  })
  var pattern = /([0-9]+)/
  sock.on('data', function(data){
    console.log(data.toString()+count)
    count++
    result = data.toString().match(pattern)
    if(result != null)
    {
       //if(!(result[1] in socket_list))
       //if(typeof(socket) != 'string')
       {
          socket_list[result[1]] = sock
          //console.log('socket get: ' + socket +'' + typeof(socket))
          //socket_list[result[1]].write('TWO')
          //console.log('write two ' + result[1])
       }
    }
  })
  sock.on('error', (err) =>
    //console.log('Caught socket error')
    console.log(err.stack)
  )
}).listen(PORT, HOST)

var timer = setInterval(log, 10000)
function log()
{
  console.log('timer');
  for (socket in socket_list)
  {
    if(socket > 2000)
    {
      console.log("socket number: " + socket)
      try{
        if(socket_list[socket].writable)
        {
          socket_list[socket].write('TWO')
        }
        else
        {
          console.log("socket closed")
        }
      }
      catch(e)
      {
        console.log('error')
      }
    }
  }
}
