var SocksProxyAgent = require('socks-proxy-agent')
var request = require('request')
var cheerio = require('cheerio')
var querystring = require('querystring')
var util = require('util')
var url = require('url')
var agent = require('../../socks-proxy')()

var linkSel = 'h3.r a'
var descSel = 'div.s'
var itemSel = 'div.g'
var nextSel = 'td.b a span'

var URL = 'https://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8&gws_rd=ssl'

var nextTextErrorMsg = 'Translate `google.nextText` option to selected language to detect next results link.'

// start parameter is optional
function google (query, start, callback) {
  var startIndex = 0
  if (typeof callback === 'undefined') {
    callback = start
  } else {
    startIndex = start
  }
  igoogle(query, startIndex, callback)
}

google.resultsPerPage = 10
google.tld = 'com'
google.lang = 'en'
google.requestOptions = {}
google.nextText = 'Next'

var igoogle = function (query, start, callback) {
  if (google.resultsPerPage > 100) google.resultsPerPage = 100 // Google won't allow greater than 100 anyway
  if (google.lang !== 'en' && google.nextText === 'Next') console.warn(nextTextErrorMsg)

  // timeframe is optional. splice in if set
  if (google.timeSpan) {
    URL = URL.indexOf('tbs=qdr:') >= 0 ? URL.replace(/tbs=qdr:[snhdwmy]\d*/, 'tbs=qdr:' + google.timeSpan) : URL.concat('&tbs=qdr:', google.timeSpan)
  }

  var newUrl = util.format(URL, google.tld, google.lang, querystring.escape(query), start, google.resultsPerPage)
  var opt = url.parse(newUrl)
  
  opt.uri = newUrl
  opt.method = 'GET'

  if(agent){
    opt.agent = agent
  }


  for (var k in google.requestOptions) {
    opt[k] = google.requestOptions[k]
  }

  request(opt, function (err, resp, body) {
    if ((err == null) && resp.statusCode === 200) {
      var $ = cheerio.load(body)
      var links = []

      $(itemSel).each(function (i, elem) {
        var linkElem = $(elem).find(linkSel)
        var descElem = $(elem).find(descSel)
        var item = {
          title: $(linkElem).first().text(),
          link: null,
          description: null,
          href: null
        }
        var qsObj = querystring.parse($(linkElem).attr('href'))

        if (qsObj['/url?q']) {
          item.link = qsObj['/url?q']
          item.href = item.link
        }

        $(descElem).find('div').remove()
        item.description = $(descElem).text()

        links.push(item)
      })

      var nextFunc = null
      if ($(nextSel).last().text() === google.nextText) {
        nextFunc = function () {
          igoogle(query, start + google.resultsPerPage, callback)
        }
      }

      callback(null, nextFunc, links)
    } else {
      callback(new Error('Error on response' + (resp ? ' (' + resp.statusCode + ')' : '') + ':' + err + ' : ' + body), null, null)
    }
  })
}

module.exports = google
