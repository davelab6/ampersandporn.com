function getLetters(string) {
  var letters = [];
  var str = string.replace(/\s/g, '');
  for(x = 0, length = str.length; x < length; x++) {
    var l = str.charAt(x);
    if (letters.indexOf(l) < 0) {
      letters.push(l);
    }
  }
  return escape(letters.join(''));
}

$.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);
    return this[randomIndex];
};

function Wiggle(wiggleText) {
  this.wiggleText = wiggleText;

  this._DOM_fontName = $('#font-name');
  this._DOM_HrefFontName = $('<a>').attr('target', '_blank');
}

Wiggle.prototype = {

  refreshSpeciment: function (fontFamily) {
    this._DOM_HrefFontName.attr('href', 'http://www.google.com/webfonts/specimen/'+fontFamily);
    this._DOM_HrefFontName.html(fontFamily);

    var tmp = $(this._DOM_HrefFontName.wrap('<div></div>').parent());
    this._DOM_fontName.html(tmp.html());
  },

  refreshWiggle: function (timeout, font) {
    this._DOM_fontName.fadeOut(400);

    var $this = this;
    this.wiggleText.fadeOut(400, function() {
      $this.setWiggle(font);
    });
  },

  setWiggle: function (font) {
    var variant = $(font.variants).random();

    this.wiggleText.css('font-family', font.family);
    if (variant) {
      this.wiggleText.css('font-style', variant);
    }
    
    var $this = this;
    WebFont.load({
      google: { families: [ font.family ] },
      active: function() {
        $this._DOM_fontName.fadeIn(700);
        $this.wiggleText.fadeIn(700);
        $(window).trigger('resize');
        $this.refreshSpeciment(font.family);
      }
    });
  }
};


var GWF_APIKEY = 'AIzaSyBKEIQeLtpWJgZ8rqSPGoy5NgzqOoqlJIY';


$(function(){
  var webfonts_url = 'https://www.googleapis.com/webfonts/v1/webfonts';

  var wiggleText = $('.wiggle');
  wiggleText.bigtext();

  var wiggle = new Wiggle(wiggleText);

  var _fontCache;
  $.ajax({
    url: webfonts_url,
    data: {key: GWF_APIKEY},
    success: function(data, textStatus, jqXHR) {
      _fontCache = $(data.items);
      wiggle.setWiggle(_fontCache.random());
    },
    dataType: 'jsonp',
    crossDomain: true
  });

  $('#refresh-font').on('click', function(){
    wiggle.refreshWiggle(400, _fontCache.random());
  });
});