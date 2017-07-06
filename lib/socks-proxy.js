var SocksProxyAgent = require('socks-proxy-agent');

module.exports = function(host, port){
  var proxy = process.env.socks_proxy;
  
  if(proxy){
    return new SocksProxyAgent(proxy);
  }else if(host && port){
    return new SocksProxyAgent('socks://'+host+':'+port);
  }else{
    return null;
  }

}
