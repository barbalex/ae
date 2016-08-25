/*
 * contains ui for main
 * changes ui depending on size of window
 */

import debounce from 'lodash/debounce'
import { ListenerMixin } from 'reflux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Form } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'
import Objekt from './object/Object.js'
import ImportPc from './importPc/ImportPc.js'
import ImportRc from './importRc/ImportRc.js'
import Export from './export/Export.js'
import ExportAlt from './exportAlt/ExportAlt.js'
import Organizations from './organizations/Organizations.js'

// wenn main unter menu kommt muss ein margin vorhanden sein
// bootstrap-glyphicons.css vergibt Eigenschaften > korrigieren
const styles = StyleSheet.create({
  mainRootDiv: {
    margin: '0 0 7px 0',
    border: 'none',
    padding: 0,
    position: 'relative',
    width: '100%'
  }
})

export default React.createClass({
  displayName: 'Main',

  propTypes: {
    object: React.PropTypes.object,
    mainComponent: React.PropTypes.string,
  },

  mixins: [ListenerMixin],

  getInitialState() {
    const formHorizontal = window.innerWidth > 700
    return { formHorizontal }
  },

  componentDidMount() {
    window.addEventListener('resize', debounce(this.onResize, 150))
  },

  componentWillUnmount() {
    window.removeEventListener('resize', debounce(this.onResize, 150))
  },

  onResize() {
    const thisWidth = ReactDOM.findDOMNode(this).offsetWidth
    const formHorizontal = thisWidth > 700
    this.setState({ formHorizontal })
  },

  render() {
    const {
      object,
      mainComponent,
    } = this.props
    const { formHorizontal } = this.state
    const showObject = (
      object &&
      Object.keys(object).length > 0
      // && !mainComponent
    )
    console.log('Main.js, render, showObject:', showObject)

    return (
      <Form
        id="main"
        horizontal={formHorizontal}
        className={css(styles.mainRootDiv)}
      >
        {
          showObject &&
          <Objekt />
        }
        {
          mainComponent === 'importPc' &&
          <ImportPc />
        }
        {
          mainComponent === 'importRc' &&
          <ImportRc />
        }
        {
          mainComponent === 'exportieren' &&
          <Export />
        }
        {
          mainComponent === 'exportierenAlt' &&
          <ExportAlt />
        }
        {
          mainComponent === 'organizations' &&
          <Organizations />
        }
      </Form>
    )
  }
})
