'use strict'

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import FieldsTaxonomyPanel from './FieldsTaxonomyPanel.js'

export default React.createClass({
  displayName: 'FieldsTaxonomy',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    activePanel: React.PropTypes.number,
    urlOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array
  },

  getInitialState() {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate() {
    const { taxonomyFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(taxonomyFields).length
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
      taxonomyFields,
      urlOptions,
      onChooseField,
      onChooseAllOfCollection,
      collectionsWithAllChoosen
    } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(taxonomyFields).length
    const activePanelOpeningWhenOnlyOneCollection = (
      numberOfCollections === 1 ?
      0 :
      activePanel
    )
    const collectionKeysSorted = (
      Object.keys(taxonomyFields)
        .sort((cNameKey) =>
          cNameKey.toLowerCase()
        )
    )
    console.log('FieldsTaxonomy, render, taxonomyFields', taxonomyFields)
    console.log('FieldsTaxonomy, render, Object.keys(taxonomyFields)', Object.keys(taxonomyFields))
    console.log('FieldsTaxonomy, render, collectionKeysSorted', collectionKeysSorted)
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={cNameKey}
          eventKey={cIndex}
          onClick={this.onClickPanel.bind(this, cIndex)}
        >
          {
            activePanelOpeningWhenOnlyOneCollection === cIndex &&
            <FieldsTaxonomyPanel
              cNameKey={cNameKey}
              taxonomyFields={taxonomyFields}
              urlOptions={urlOptions}
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
