// begrenzt die maximale Höhe des Baums auf die Seitenhöhe, wenn nötig

'use strict'

import $ from 'jquery'

export default function () {
  var windowHeight = $(window).height()

  if ($(window).width() > 1000 && !$('body').hasClass('force-mobile')) {
    $('#tree').css('max-height', windowHeight - 161)
  } else {
    // Spalten sind untereinander. Baum 91px weniger hoch, damit Formulare zum raufschieben immer erreicht werden können
    $('#tree').css('max-height', windowHeight - 252)
  }
}
