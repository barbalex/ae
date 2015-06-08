'use strict'

import React from 'react'
import app from 'ampersand-app'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ResizeButton from './resizeButton'
import Filter from 'react-select'

let searchOptions = []

export default React.createClass({
  displayName: 'Menu',

  getInitialState () {
    // creat mock species
    for (var i = 0; i < 200; i++) {
      searchOptions.push({value: i, label: 'Art_' + i})
    }

    return {
      // ??
    }
  },

  showFauna () {
    console.log('showFauna clicked')
    // TODO
    // call action initializeFaunaStore
    app.Actions.initializeFaunaStore()
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
          <ButtonGroup id='gruppe' className='gruppeButtonGroup'>
            <Button bsStyle='primary' className='gruppe' onClick={this.showFauna} Gruppe='Fauna'>Fauna</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showFlora} Gruppe='Flora'>Flora</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showMoose} Gruppe='Moose'>Moose</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showPilze} Gruppe='Macromycetes'>Pilze</Button>
            <Button bsStyle='primary' className='gruppe' onClick={this.showLr} Gruppe='Lebensräume'>Lebensräume</Button>
          </ButtonGroup>
        </div>
        <Filter
          name='test'
          placeholder='filtern'
          noResultsText='keine Treffer'
          multi={true}
          options={searchOptions}
          onChange={this.filter}/>

        <div id='treeMitteilung' style={{display: 'none'}}>hole Daten...</div>
        <div className='treeBeschriftung'></div>
        <div className='baum'></div>

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
