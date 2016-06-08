import React from 'react'
import { Accordion, Panel, Checkbox } from 'react-bootstrap'
import { get } from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import FieldsTaxonomy from './FieldsTaxonomy.js'
import FieldsPCs from './FieldsPCs.js'
import FieldsRCs from './FieldsRCs.js'

const styles = StyleSheet.create({
  fields: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cb: {
    width: 450
  },
  divAlleWaehlen: {
    fontStyle: 'italic',
    marginBottom: 5
  }
})

export default React.createClass({
  displayName: 'Fields',

  propTypes: {
    taxonomyFields: React.PropTypes.object,
    pcFields: React.PropTypes.object,
    relationFields: React.PropTypes.object,
    onChooseField: React.PropTypes.func,
    onChooseAllOfCollection: React.PropTypes.func,
    pcs: React.PropTypes.array,
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
      onChooseField,
      onChooseAllOfCollection,
      pcs,
      rcs,
      urlOptions,
      collectionsWithAllChoosen,
      oneRowPerRelation,
      onChangeOneRowPerRelation
    } = this.props
    const { activePanel } = this.state
    const guidChecked = get(urlOptions, 'object._id.export')
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
            <div
              className={css(styles.fields)}
            >
              <Checkbox
                onChange={(event) =>
                  onChooseField('object', '_id', 'cType', event)
                }
                checked={guidChecked}
              >
                GUID
              </Checkbox>
              <Checkbox
                onChange={(event) =>
                  onChooseField('object', 'Gruppe', 'cType', event)
                }
              >
                Gruppe
              </Checkbox>
            </div>
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
              urlOptions={urlOptions}
              taxonomyFields={taxonomyFields}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
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
              urlOptions={urlOptions}
              pcFields={pcFields}
              pcs={pcs}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
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
              urlOptions={urlOptions}
              relationFields={relationFields}
              rcs={rcs}
              collectionsWithAllChoosen={collectionsWithAllChoosen}
              oneRowPerRelation={oneRowPerRelation}
              onChooseField={onChooseField}
              onChooseAllOfCollection={onChooseAllOfCollection}
              onChangeOneRowPerRelation={onChangeOneRowPerRelation}
            />
          }
        </Panel>
      </Accordion>
    )
  }
})
