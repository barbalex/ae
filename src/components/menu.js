'use strict'

import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Input from 'react-bootstrap/lib/Input'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import ResizeButton from './resizeButton'
import Filter from 'react-select'

const searchGlyphicon = <Glyphicon glyph='search' />
let searchOptions = []

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    // creat mock species
    for (var i = 0; i < 20000; i++) {
      searchOptions.push({value: i, label: 'Art_' + i})
    }

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

  filter (val) {
    console.log('filtered:', val)
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
        <Filter
          name='test'
          placeholder='filtern'
          options={searchOptions}
          onChange={this.filter}/>

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
