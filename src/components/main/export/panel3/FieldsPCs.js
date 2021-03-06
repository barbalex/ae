import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import FieldsPCsPanel from './FieldsPCsPanel.js'

export default React.createClass({
  displayName: 'FieldsPCs',

  propTypes: {
    pcFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    exportOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array
  },

  getInitialState() {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate() {
    const { pcFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(pcFields).length
    if (numberOfCollections === 1 && activePanel !== 0) {
      this.setState({ activePanel: 0 })
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
      pcFields,
      pcs,
      exportOptions,
      collectionsWithAllChoosen,
      onChooseAllOfCollection,
      onChooseField
    } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(pcFields).length
    const activePanelOpeningWhenOnlyOneCollection = (
      numberOfCollections === 1 ?
      0 :
      activePanel
    )

    const collectionKeysSorted = Object.keys(pcFields)
      .sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1
        return 1
      })
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const pc = pcs.find((c) =>
        c.name === cNameKey
      )
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={pc.name}
          eventKey={cIndex}
          onClick={(event) =>
            this.onClickPanel(cIndex, event)
          }
        >
          {
            activePanelOpeningWhenOnlyOneCollection === cIndex &&
            <FieldsPCsPanel
              cNameKey={cNameKey}
              pcFields={pcFields}
              exportOptions={exportOptions}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
            />
          }
        </Panel>
      )
    })

    return (
      <Accordion
        activeKey={activePanelOpeningWhenOnlyOneCollection}
      >
        {collections}
      </Accordion>
    )
  }
})
