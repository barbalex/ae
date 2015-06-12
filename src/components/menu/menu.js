'use strict'

import React from 'react'
import { State } from 'react-router'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ResizeButton from './resizeButton.js'
import Filter from './filter.js'
import S1 from './tree/s1.js'

export default React.createClass({
  displayName: 'Menu',

  mixins: [State],

  showFauna () {
    window.router.transitionTo(`/Fauna`)
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
    const params = this.getParams()
    return (
      <fieldset id='menu' className='menu'>
        <div>
          <ResizeButton/>
          <div id='menu-div'>
            <div id='gruppeLabel'>Gruppe wählen:</div>
          </div>
          <ButtonGroup>
            <Button bsStyle='primary' onClick={this.showFauna}>Fauna</Button>
            <Button bsStyle='primary' onClick={this.showFlora}>Flora</Button>
            <Button bsStyle='primary' onClick={this.showMoose}>Moose</Button>
            <Button bsStyle='primary' onClick={this.showPilze}>Pilze</Button>
            <Button bsStyle='primary' onClick={this.showLr}>Lebensräume</Button>
          </ButtonGroup>
        </div>
        {params.s1 ? <Filter/> : ''}
        {params.s1 ? <S1/> : ''}
      </fieldset>
    )
  }
})
