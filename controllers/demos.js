'use strict';

const Memcached = require('memcached');
const pMemcached = require('memcache-promise');

var pmc = new pMemcached("localhost:11211");

module.exports.home = function* home(next) {
	if ('GET' != this.method){
		return yield next;
	}
	this.body = 'Hello Koa';
};

module.exports.get = function* get(key){
	var x = yield pmc.get(key);
	console.log('get: ' + key + '=' + x);
	this.body = (!!x) ? x : '何もないよ〜';
};

module.exports.set = function* set(key, value){
	this.body = 'set: ' + key + '=' + value;
	pmc.set(key, value, 10000);
};

module.exports.stats = function* stats(){
	this.body = yield pmc.stats;
};

module.exports.settings = function* settings(){
	this.body = yield pmc.settings;
};

module.exports.head = function *(){
	return;
};

module.exports.options = function *() {
	this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
};

module.exports.trace = function *() {
	this.body = "Smart! But you can't trace.";
};
