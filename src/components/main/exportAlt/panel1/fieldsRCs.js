'use strict'

import React from 'react'
import { Accordion, Panel, Checkbox } from 'react-bootstrap'
import FieldsRCsPanel from './FieldsRCsPanel.js'

export default React.createClass({
  displayName: 'FieldsRCs',

  propTypes: {
    relationFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    rcs: React.PropTypes.array,
    activePanel: React.PropTypes.number,
    urlOptions: React.PropTypes.object,
    collectionsWithAllChoosen: React.PropTypes.array,
    oneRowPerRelation: React.PropTypes.bool,
    onChangeOneRowPerRelation: React.PropTypes.func
  },

  getInitialState() {
    return {
      activePanel: ''
    }
  },

  componentWillUpdate() {
    const { relationFields } = this.props
    const { activePanel } = this.state
    // open collection panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
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
      relationFields,
      rcs,
      urlOptions,
      onChooseField,
      onChooseAllOfCollection,
      onChangeOneRowPerRelation,
      collectionsWithAllChoosen,
      oneRowPerRelation
    } = this.props
    const { activePanel } = this.state
    // open panel if there is only one
    const numberOfCollections = Object.keys(relationFields).length
    const activePanelOpeningWhenOnlyOneCollection = (
      numberOfCollections === 1 ?
      0 :
      activePanel
    )
    const divStyle = {
      marginLeft: 24,
      marginTop: 3,
      marginBottom: 3
    }

    const collectionKeysSorted = Object
      .keys(relationFields)
      .sort((cNameKey) =>
        cNameKey.toLowerCase()
      )
    const collections = collectionKeysSorted.map((cNameKey, cIndex) => {
      const collectionKey = cNameKey.toLowerCase()
      const rc = rcs.find((c) =>
        c.name === cNameKey
      )
      return (
        <Panel
          key={collectionKey}
          collapsible
          header={rc.name}
          eventKey={cIndex}
          onClick={(event) =>
            this.onClickPanel(cIndex, event)
          }
        >
          {
            activePanelOpeningWhenOnlyOneCollection === cIndex &&
            <FieldsRCsPanel
              cNameKey={cNameKey}
              relationFields={relationFields}
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
      <div>
        <div
          id="rcOptions"
          style={divStyle}
        >
          <Checkbox
            checked={oneRowPerRelation}
            onChange={() =>
              onChangeOneRowPerRelation(true)
            }
            style={{ marginBottom: 0 }}
          >
            Pro Beziehung eine Zeile
          </Checkbox>
          <Checkbox
            checked={!oneRowPerRelation}
            onChange={() =>
              onChangeOneRowPerRelation(false)
            }
          >
            Pro Art/Lebensraum eine Zeile und alle Beziehungen kommagetrennt in einem Feld
          </Checkbox>
        </div>
        <Accordion
          activeKey={activePanelOpeningWhenOnlyOneCollection}
        >
          {collections}
        </Accordion>
      </div>
    )
  }
})
