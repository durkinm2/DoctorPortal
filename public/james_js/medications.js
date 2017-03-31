//LsOK2CrPrvBH5VdYCS8zCmL8wvbi7Ps9g0LLekv4

const request = require('request-promise')
const options = {
  method: 'GET',
  uri: 'https://risingstack.com'
}
​
request(options)
  .then(function (response) {
    // Request was successful, use the response object at will
  })
  .catch(function (err) {
    // Something bad happened, handle the error
  })
 
