'use strict'

import React from 'react'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    return {
      // ??
    }
  },

  resize () {
    console.log('resize was clicked')
    // TODO: use props to pass object
    $('body').toggleClass('force-mobile')
    /* previously:
    var windowHeight = $(window).height(),
      $body = $('body')

    $body.toggleClass('force-mobile')
    if ($body.hasClass('force-mobile')) {
      // Spalten sind untereinander. Baum 91px weniger hoch, damit Formulare zum raufschieben immer erreicht werden können
      $('.baum').css('max-height', windowHeight - 252)
      // button rechts ausrichten
      $('#btnResize')
        .css('margin-right', '0px')
        .attr('data-original-title', 'in zwei Spalten anzeigen')
    } else {
      $('.baum').css('max-height', windowHeight - 161)
      // button an anderen Schaltflächen ausrichten
      $('#btnResize')
        .css('margin-right', '6px')
        .attr('data-original-title', 'ganze Breite nutzen')
    }
    */
  },

  render () {
    return (
      <fieldset id='menu' className='menu' style={{/*display:none*/}}>
        <div>
          <Button id='btnResize' className='pull-right' data-toggle='tooltip' data-placement='left' title='ganze Breite nutzen' bsSize='small' onClick={this.resize}><span className='glyphicon glyphicon-resize-horizontal'></span></Button>
          <div id='menu-div'>
            <div id='gruppe_label'>Gruppe wählen:</div>
          </div>
          <div id='gruppe' className='btn-group' data-toggle='buttons'>
            <label className='btn btn-primary gruppe' Gruppe='Fauna'>
              <input type='radio'>Fauna</input>
            </label>
            <label className='btn btn-primary gruppe' Gruppe='Flora'>
              <input type='radio'>Flora</input>
            </label>
            <label className='btn btn-primary gruppe' Gruppe='Moose'>
              <input type='radio'>Moose</input>
            </label>
            <label className='btn btn-primary gruppe' Gruppe='Macromycetes'>
              <input type='radio'>Pilze</input>
            </label>
            <label className='btn btn-primary gruppe' Gruppe='Lebensräume'>
              <input type='radio'>Lebensräume</input>
            </label>
          </div>
        </div>
        <div id='suchenFauna' className='input-group input-group-xs suchen'>
          <input id='suchfeldFauna' className='form-control input-sm suchfeld' type='text' placeholder='filtern'/>
        </div>
        <div id='suchenFlora' className='input-group input-group-xs suchen'>
          <input id='suchfeldFlora' className='form-control input-sm suchfeld' type='text' placeholder='filtern'/>
        </div>
        <div id='suchenMoose' className='input-group input-group-xs suchen'>
          <input id='suchfeldMoose' className='form-control input-sm suchfeld' type='text' placeholder='filtern'/>
        </div>
        <div id='suchenMacromycetes' className='input-group input-group-xs suchen'>
          <input id='suchfeldMacromycetes' className='form-control input-sm suchfeld' type='text' placeholder='filtern'/>
        </div>
        <div id='suchenLebensräume' className='input-group input-group-xs suchen'>
          <input id='suchfeldLebensräume' className='form-control input-sm suchfeld' type='text' placeholder='filtern'/>
        </div>
        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div id='treeFaunaBeschriftung' className='treeBeschriftung'></div>
        <div id='treeFloraBeschriftung' className='treeBeschriftung'></div>
        <div id='treeMooseBeschriftung' className='treeBeschriftung'></div>
        <div id='treeMacromycetesBeschriftung' className='treeBeschriftung'></div>
        <div id='treeLebensräumeBeschriftung' className='treeBeschriftung'></div>
        <div id='treeFauna' className='baum'></div>
        <div id='treeFlora' className='baum'></div>
        <div id='treeMoose' className='baum'></div>
        <div id='treeMacromycetes' className='baum'></div>
        <div id='treeLebensräume' className='baum'></div>
      </fieldset>
    )
  }
})
