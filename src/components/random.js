export function randomString(length = 10) {
   var string = ''
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
   for (var i = 0; i < length; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length))
   }
   return string
}