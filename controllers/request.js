var socket_list = {}
async function post(ctx, next){
  console.log(ctx)
  console.log('post')
  ctx.body = 'success'
}

async function get(ctx, next) {
  console.log('Receive request from client')
  var request_string = ctx.query['id']
  var pattern = /wx([0-9]+)/
  var result = request_string.match(pattern)

  if (result != null) {
    var number = result[1]
    if (socket_list == undefined)
      console.log('Error: undefined socket list')
    
    // Request machine is in active list, send command
    if (number in socket_list) {
      socket_list[number].write('ONE')
      console.log('write one')
      socket_list[number].write('ONE')
    } // no command
    else
      console.log('No such socket ' + number)
  }
}

module.exports = {
  post,
  get,
  socket_list
}
