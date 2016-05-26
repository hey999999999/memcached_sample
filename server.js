'use strict';

const koa = require('koa');
const app = module.exports = koa();
const favicon = require('serve-favicon');
//const nano = require('nano');
//const pnano = require('co-nano');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const path = require('path');
const demos = require('./controllers/demos');
const session = require('koa-session');
const MemcachedStore = require('koa-memcached');

var options = {host:'localhost', post:11211};
app.keys = ['hogehogehoge'];
app.use(session({store:MemcachedStore(options)}, app));

app.use(logger());

app.use(serve(path.join(__dirname, 'public')));

app.use(compress());

//var pmc = new pMemcached("localhost:11211");

//pmc.set("foo", "bar", 1000).then(function(res){
//	console.log("Memcached updated:", res);
//}).catch(function(e){
//	throw e;
//});

//app.use(function*(){return favicon(__dirname + '/public/favicon.ico');});

//var db = nanop(nano('http://localhost:5984')).db.use('test');

app.use(function *(next){
	// ignore favicon
	if (this.path === '/favicon.ico') return;
	var n = this.session.views || 0;
	this.session.views = ++n;

	console.log('count: ' + n);
	yield next;
	//console.log(yield pmc.get('foo'));
});

app.use(route.get('/', demos.home));
app.use(route.get('/get/:key', demos.get));
app.use(route.get('/set/:key/:value', demos.set));
app.use(route.get('/stats', demos.stats));
app.use(route.get('/settings', demos.settings));

app.on('error', function(err){
	console.log(err);
});

if (!module.parent){
	app.listen(8080);
	console.log('listening on port 8080');
}
