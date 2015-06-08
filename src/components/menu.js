'use strict'

import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Input from 'react-bootstrap/lib/Input'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import ResizeButton from './resizeButton'

const searchGlyphicon = <Glyphicon glyph='search' />

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    return {
      // ??
    }
  },

  showFauna () {
    console.log('showFauna clicked')
    // TODO
  },

  showFlora () {
    console.log('showFlora clicked')
    // TODO
  },

  showMoose () {
    console.log('showMoose clicked')
    // TODO
  },

  showPilze () {
    console.log('showPilze clicked')
    // TODO
  },

  showLr () {
    console.log('showLr clicked')
    // TODO
  },

  render () {
    return (
      <fieldset id='menu' className='menu'>
        <div>
          <ResizeButton/>
          <div id='menu-div'>
            <div id='gruppe_label'>Gruppe wählen:</div>
          </div>
          <ButtonGroup id='gruppe' className='btn-group' data-toggle='buttons' style={{width: 100 + '%'}}>
            <Button bsStyle='primary' className='gruppe' Gruppe='Fauna' onClick={this.showFauna}>Fauna</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Flora' onClick={this.showFlora}>Flora</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Moose' onClick={this.showMoose}>Moose</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Macromycetes' onClick={this.showPilze}>Pilze</Button>
            <Button bsStyle='primary' className='gruppe' Gruppe='Lebensräume' onClick={this.showLr}>Lebensräume</Button>
          </ButtonGroup>
        </div>
        <Input id='suchen' type='text' placeholder='filtern' className='suchfeld' bsSize='small' addonBefore={searchGlyphicon}/>

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
