import React from 'react'
import { Accordion, Panel } from 'react-bootstrap'
import InputFilterGuid from './InputGuid.js'
import FieldsTaxonomy from './FieldsTaxonomy.js'
import FieldsPCs from './FieldsPCs.js'
import FieldsRCs from './FieldsRCs.js'

export default React.createClass({
  displayName: 'Fields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChangeFilterField: React.PropTypes.func,
    onChangeCoSelect: React.PropTypes.func,
    pcs: React.PropTypes.array,
    rcs: React.PropTypes.array,
    exportOptions: React.PropTypes.object,
    activePanel: React.PropTypes.number,
    groupsLoadedOrLoading: React.PropTypes.array,
    groupsLoadingObjects: React.PropTypes.array
  },

  getInitialState() {
    return {
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
      pcFields,
      relationFields,
      onChangeFilterField,
      onChangeCoSelect,
      pcs,
      rcs,
      exportOptions
    } = this.props
    const { activePanel } = this.state
    const taxonomyHeader = (
      Object.keys(taxonomyFields).length > 1 ?
      'Taxonomien' :
      'Taxonomie'
    )

    return (
      <Accordion
        activeKey={activePanel}
      >
        <Panel
          collapsible
          header="Art / Lebensraum"
          eventKey={1}
          onClick={(event) =>
            this.onClickPanel(1, event)
          }
        >
          {
            activePanel === 1 &&
            <InputFilterGuid
              onChangeFilterField={onChangeFilterField}
            />
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header={taxonomyHeader}
          eventKey={2}
          onClick={(event) =>
            this.onClickPanel(2, event)
          }
        >
          {
            activePanel === 2 &&
            <FieldsTaxonomy
              taxonomyFields={taxonomyFields}
              exportOptions={exportOptions}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect}
            />
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header="Eigenschaftensammlungen"
          eventKey={3}
          onClick={(event) =>
            this.onClickPanel(3, event)
          }
        >
          {
            activePanel === 3 &&
            <FieldsPCs
              pcFields={pcFields}
              pcs={pcs}
              exportOptions={exportOptions}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect}
            />
          }
        </Panel>
        <Panel
          className="collectionPanel"
          collapsible
          header="Beziehungssammlungen"
          eventKey={4}
          onClick={(event) =>
            this.onClickPanel(4, event)
          }
        >
          {
            activePanel === 4 &&
            <FieldsRCs
              relationFields={relationFields}
              rcs={rcs}
              exportOptions={exportOptions}
              onChangeFilterField={onChangeFilterField}
              onChangeCoSelect={onChangeCoSelect}
            />
          }
        </Panel>
      </Accordion>
    )
  }
})
