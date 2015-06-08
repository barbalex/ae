'use strict'

import React from 'react'
import $ from 'jquery'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'

// let windowHeight = $(window).height()
const bodyElement = $('body')

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    return {
      // ??
    }
  },

  resize () {
    bodyElement.toggleClass('force-mobile')
    // TODO: manage max-height of tree when toggling
    // so form can always be reached and dragged up
    /* previosly:
    if ($body.hasClass('force-mobile')) {
      // Spalten sind untereinander. Baum 91px weniger hoch, damit Formulare zum raufschieben immer erreicht werden können
      $('.baum').css('max-height', windowHeight - 252)
    } else {
      $('.baum').css('max-height', windowHeight - 161)
    }*/
    this.forceUpdate()
  },

  render () {
    return (
      <fieldset id='menu' className='menu'>
        <div>
          <Button
            id='btnResize'
            className='pull-right'
            data-toggle='tooltip'
            data-placement='left'
            title={bodyElement.hasClass('force-mobile') ? 'in zwei Spalten anzeigen' : 'ganze Breite nutzen'}
            bsSize='small'
            /* mobil: rechts ausrichten, desktop: an den anderren Schaltflächen ausrichten */
            style = {{marginRight: bodyElement.hasClass('force-mobile') ? 0 : 6 + 'px'}}
            onClick={this.resize}>
            <span className='glyphicon glyphicon-resize-horizontal'></span>
          </Button>
          <div id='menu-div'>
            <div id='gruppe_label'>Gruppe wählen:</div>
          </div>

          <ButtonGroup id='gruppe' className='btn-group' data-toggle='buttons'>
            <Button bsStyle='primary' className='gruppe' Gruppe='Fauna'>Fauna</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Flora'>Flora</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Moose'>Moose</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Macromycetes'>Pilze</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Lebensräume'>Lebensräume</Button>
          </ButtonGroup>

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
