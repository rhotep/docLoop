var createApp = require('github-app');



var app = createApp({
  id: process.env.APP_ID,
  cert: require('fs').readFileSync('docloop.2017-09-13.private-key.pem')
});





var createHandler = require('github-webhook-handler');

var handler = createHandler({
  path: '/',
  secret: process.env.DOCLOOP_APP_TOKEN
})

handler.on('issues', function (event) {
  if (event.payload.action === 'opened') {
    var installation = event.payload.installation.id;

    app.asInstallation(installation).then(function (github) {
      github.issues.createComment({
        owner: event.payload.repository.owner.login,
        repo: event.payload.repository.name,
        number: event.payload.issue.number,
        body: 'Welcome to the robot uprising.'
      });
    });
  }
});





var http = require('http');



http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  });
}).listen(7777)



