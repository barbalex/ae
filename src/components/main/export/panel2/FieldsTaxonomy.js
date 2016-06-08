import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import FieldsTaxonomyPanel from './FieldsTaxonomyPanel.js'

export default React.createClass({
  displayName: 'FieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    exportOptions: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    activePanel: React.PropTypes.number
  },

  getInitialState() {
    return {
      // don't set this to null - chrome will crash!!??
      activePanel: ''
    }
  },

  onClickPanel(number, event) {
    const { activePanel } = this.state
    // prevent higher level panels from reacting
    event.stopPropagation()

    // make sure the heading was clicked
    const parent = event.target.parentElement
    const headingWasClicked = (
      parent.className.includes('panel-title') ||
      parent.className.includes('panel-heading')
    )
    if (headingWasClicked) {
      // always close panel if it is open
      if (activePanel === number) {
        return this.setState({ activePanel: '' })
      }
        // open the panel clicked
      this.setState({ activePanel: number })
    }
  },

  render() {
    const {
      taxonomyFields,
      exportOptions,
      onChangeCoSelect,
      onChangeFilterField
    } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(taxonomyFields).length
    const activePanelOpeningWhenOnlyOneCollection = (
      numberOfCollections === 1 ?
      0 :
      activePanel
    )
    const collectionKeysSorted = Object.keys(taxonomyFields)
      .sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        return 1
      })
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const openPanel = activePanelOpeningWhenOnlyOneCollection === cIndex
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={cNameKey}
          eventKey={cIndex}
          onClick={(event) =>
            this.onClickPanel(cIndex, event)
          }
        >
          {
            openPanel &&
            <FieldsTaxonomyPanel
              cNameKey={cNameKey}
              taxonomyFields={taxonomyFields}
              exportOptions={exportOptions}
              onChangeCoSelect={onChangeCoSelect}
              onChangeFilterField={onChangeFilterField}
            />
          }
        </Panel>
      )
    })

    return (
      <Accordion activeKey={activePanelOpeningWhenOnlyOneCollection}>
        {collections}
      </Accordion>
    )
  }
})
