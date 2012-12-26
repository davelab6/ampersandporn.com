var mainWindow = $(window);

function getLetters(string) {
  var letters = [];
  var str = string.replace(/\s/g, '');
  for (x = 0, length = str.length; x < length; x++) {
    var l = str.charAt(x);
    if (letters.indexOf(l) < 0) {
      letters.push(l);
    }
  }
  return letters.join('');
}

$.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);
    return this[randomIndex];
};


$.fn.randomize = function() {
  return this.sort(function() { return 0.5 - Math.random();});
};

function Wiggle(wiggleText) {
  this.wiggleText = wiggleText;

  this._DOM_fontName = $('#font-name');
  this._DOM_HrefFontName = $('<a>').attr('target', '_blank');
}

var modal = $('#ampersand_modal');
var linkName = modal.find('#fontFamily');

Wiggle.prototype = {

  setWiggle: function (font) {
    var variant = $(font.variants).random();

    this.wiggleText.css('font-family', font.family);
    if (variant) {
      this.wiggleText.css('font-style', variant);
    }
    this.wiggleText.bigtext();

    this.wiggleText.on('click', function() {
      modal.find('.wiggle').css('font-family', font.family);

      var link = $('<a>').attr('href', 'http://www.google.com/webfonts/specimen/'+font.family);
      linkName.html(link.attr('target', '_blank').text(font.family));
      modal.modal();
    });
  }

};


var GWF_APIKEY = 'AIzaSyBKEIQeLtpWJgZ8rqSPGoy5NgzqOoqlJIY';
var GWF_APIURL = 'https://www.googleapis.com/webfonts/v1/webfonts';
var _fontCache;

Array.prototype.chunk = function ( n ) {
    if ( !this.length ) {
        return [];
    }
    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
};


function refreshWiggles(wiggles) {

  wiggles.html('');

  var fonts = _fontCache.randomize();
  var length = fonts.length;

  var chunks = fonts.toArray().chunk(100);
  $(chunks).each(function(index, chunk) {
    var families = chunk.map(function(font){ return font.family; });
    WebFont.load({
      google: { families: families, text: "&" },
      fontactive: function(fontFamily, fontDescription) {
        var wiggle = $('<div>').addClass('pull-left short-wiggle');
        wiggles.append(wiggle.append($('<div>').text('&')));

        var w = new Wiggle(wiggle);
        w.setWiggle({family: fontFamily});
      }
    });
  });
}


$(function(){
  $('.ampersand-modal .wiggle').bigtext({
    maxfontsize: 400
  });

  modal.find('.wiggle').bigtext();

  var wiggles = $('.wiggles');
  $.ajax({
    url: GWF_APIURL,
    data: {key: GWF_APIKEY},
    success: function(data, textStatus, jqXHR) {
      _fontCache = $(data.items);
      refreshWiggles(wiggles);
    },
    dataType: 'jsonp',
    crossDomain: true
  });

  $('#refresh-font').on('click', function() { refreshWiggles(wiggles); });
});
