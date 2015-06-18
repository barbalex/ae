/*
 * setzs max-height of tree
 * usually makes it as high as page
 * when mobile less so the lower area can be dragged up
 * status of forceMobile can be passed
 */

'use strict'

import $ from 'jquery'

export default function () {
  const windowHeight = $(window).height()
  const forceMobile = $('body').hasClass('force-mobile')

  if ($(window).width() > 1000 && !forceMobile) {
    $('#tree').css('max-height', windowHeight - 143)
  } else {
    // Spalten sind untereinander. Baum weniger hoch, damit Formulare zum raufschieben immer erreicht werden können
    $('#tree').css('max-height', windowHeight - 226)
  }
}
