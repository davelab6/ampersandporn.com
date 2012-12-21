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
  return escape(letters.join(''));
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

Wiggle.prototype = {

  setWiggle: function (font) {
    var variant = $(font.variants).random();

    this.wiggleText.css('font-family', font.family);
    if (variant) {
      this.wiggleText.css('font-style', variant);
    }
    this.wiggleText.fadeIn(400);
    mainWindow.trigger('resize');

    this.wiggleText.on('click', function() {
      $('#ampersand_modal .wiggle').css('font-family', font.family);

      var link = $('<a>').attr('href', 'http://www.google.com/webfonts/specimen/'+font.family);
      $('#ampersand_modal #fontFamily').html(link.attr('target', '_blank').text(font.family));

      $('#ampersand_modal').modal();

      $('#ampersand_modal .wiggle').trigger('resize');
    });
  }

};


var GWF_APIKEY = 'AIzaSyBKEIQeLtpWJgZ8rqSPGoy5NgzqOoqlJIY';
var GWF_APIURL = 'https://www.googleapis.com/webfonts/v1/webfonts';
var _fontCache;


function refreshWiggles(wiggles) {

  wiggles.html('');

  var fonts = _fontCache.randomize().slice(0, 13);

  families = fonts.map(function(index, item) {
    return item.family;
  });

  WebFont.load({
    google: { families: families },
    fontinactive: function (fontFamily, fontDescription) {
      var wiggle = $('<div>')
        .addClass('pull-left short-wiggle')
        .append($('<div>').text('x'));
      wiggle.bigtext();
      wiggles.append(wiggle);
    },
    fontactive: function(fontFamily, fontDescription) {
      var wiggle = $('<div>')
        .addClass('pull-left short-wiggle')
        .append($('<div>').text('&'));

      wiggle.bigtext();
      wiggles.append(wiggle);

      var w = new Wiggle(wiggle);
      w.setWiggle({family: fontFamily});
    }
  });
}


$(function(){
  $('.ampersand-modal .wiggle').bigtext();

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