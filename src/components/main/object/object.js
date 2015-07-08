'use strict'

// import app from 'ampersand-app'
import React from 'react'
// import Inspector from 'react-json-inspector'
import _ from 'lodash'
import PropertyCollection from './propertyCollection.js'
import RelationCollection from './relationCollection.js'
import getGuidsOfSynonymsFromTaxonomicRcs from '../../../modules/getGuidsOfSynonymsFromTaxonomicRcs.js'

export default React.createClass({
  displayName: 'Object',

  propTypes: {
    object: React.PropTypes.object,
    items: React.PropTypes.object
  },

  getInitialState () {
    const formClassNames = window.innerWidth > 700 ? 'form form-horizontal' : 'form'
    return {
      formClassNames: formClassNames
    }
  },

  componentDidMount () {
    window.addEventListener('resize', this.onResize)
  },

  onResize () {
    const thisWidth = React.findDOMNode(this).offsetWidth
    const formClassNames = thisWidth > 700 ? 'form form-horizontal' : 'form'
    this.setState({
      formClassNames: formClassNames
    })
  },

  render () {
    const { object, items } = this.props
    const { formClassNames } = this.state
    let taxComponent = null
    let pcsComponent = null
    let rcsComponent = null
    let taxRcsComponent = null
    let objectRcs = []
    let taxRcs = []
    let guidsOfSynonyms = []
    let synonymObjects = []
    let pcsOfSynonyms = []
    let rcsOfSynonyms = []
    let namesOfPcsBuilt = []
    let namesOfRcsBuilt = []

    // no object? > return empty component
    if (!object || _.keys(object).length === 0) {
      return (
        <fieldset id='main'>
        </fieldset>
      )
    }

    // taxonomy collection
    if (object.Taxonomie) {
      taxComponent = <PropertyCollection pcType='Taxonomie' object={object} propertyCollection={object.Taxonomie} />
    }

    // relation collections
    if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
      const rcs = object.Beziehungssammlungen
      // regular relation collections
      objectRcs = _.filter(rcs, function (rc) {
        return rc.Typ && rc.Typ !== 'taxonomisch'
      })
      if (objectRcs.length > 0) {
        const rcComponent = _.map(objectRcs, function (rc) {
          return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
        })
        rcsComponent = (
          <div>
            <h4>Beziehungen:</h4>
            {rcComponent}
          </div>
        )
      }

      // taxonomic relation collections
      taxRcs = _.filter(rcs, function (rc) {
        return rc.Typ && rc.Typ === 'taxonomisch'
      })
      if (taxRcs.length > 0) {
        const taxRcComponent = _.map(taxRcs, function (rc) {
          return <RelationCollection key={rc.Name} object={object} relationCollection={rc} />
        })
        taxRcsComponent = (
          <div>
            <h4>Taxonomische Beziehungen:</h4>
            {taxRcComponent}
          </div>
        )
      }

      // list of names of relation collections
      // needed to choose which relation collections of synonym objects need to be built
      namesOfRcsBuilt = _.pluck(object.Beziehungssammlungen, function (rc) {
        if (rc.Name) return rc.Name
      })

      // synonym objects
      guidsOfSynonyms = getGuidsOfSynonymsFromTaxonomicRcs(taxRcs)
      synonymObjects = _.filter(items, function (object, guid) {
        return _.includes(guidsOfSynonyms, guid)
      })
    }

    // property collections
    if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
      const pcs = object.Eigenschaftensammlungen
      const pcComponent = _.map(pcs, function (pc) {
        return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
      })
      pcsComponent = (
        <div>
          <h4>Eigenschaften:</h4>
          {pcComponent}
        </div>
      )

      // list names of property collections
      // needed to choose which property collections of synonym objects need to be built
      namesOfPcsBuilt = _.pluck(object.Eigenschaftensammlungen, function (pc) {
        if (pc.Name) return pc.Name
      })
    }

    if (synonymObjects.length > 0) {
      _.forEach(synonymObjects, function (object) {
        if (object.Eigenschaftensammlungen && object.Eigenschaftensammlungen.length > 0) {
          _.each(object.Eigenschaftensammlungen, function (pc) {
            if (!_.includes(namesOfPcsBuilt, pc.Name)) {
              // this pc is not yet shown
              pcsOfSynonyms.push(pc)
              // update namesOfPcsBuilt
              namesOfPcsBuilt.push(pc.Name)
            }
          })
        }
        if (object.Beziehungssammlungen && object.Beziehungssammlungen.length > 0) {
          _.each(object.Beziehungssammlungen, function (rc) {
            if (!_.includes(namesOfRcsBuilt, rc.Name) && rc['Art der Beziehungen'] !== 'synonym' && rc.Typ !== 'taxonomisch') {
              // this rc is not yet shown and is not taxonomic
              rcsOfSynonyms.push(rc)
              // update namesOfRcsBuilt
              namesOfRcsBuilt.push(rc.Name)
            } else if (rc['Art der Beziehungen'] !== 'synonym' && rc.Typ !== 'taxonomisch') {
              // this rc is already shown
              // but there could be relations that are not shown yet
              var bsDerSynonymenArt = rc,
                bsDerOriginalArt = _.find(art.Beziehungssammlungen, function (rc) {
                  return rc.Name === bsDerSynonymenArt.Name
                })

              if (bsDerSynonymenArt.Beziehungen && bsDerSynonymenArt.Beziehungen.length > 0 && bsDerOriginalArt && bsDerOriginalArt.Beziehungen && bsDerOriginalArt.Beziehungen.length > 0) {
                // Beide Arten haben in derselben Beziehungssammlung Beziehungen
                // in der Originalart vorhandene Beziehungen aus dem Synonym entfernen
                bsDerSynonymenArt.Beziehungen = _.reject(bsDerSynonymenArt.Beziehungen, function (beziehungDesSynonyms) {
                  // suche in Beziehungen der Originalart eine mit denselben Beziehungspartnern
                  var beziehungDerOriginalArt = _.find(bsDerOriginalArt.Beziehungen, function (beziehungOrigArt) {
                    // return _.isEqual(beziehungDesSynonyms, beziehungOrigArt);  Wieso funktioniert das nicht?
                    if (beziehungDesSynonyms.Beziehungspartner.length > 0 && beziehungOrigArt.Beziehungspartner.length > 0) {
                      return beziehungDesSynonyms.Beziehungspartner[0].GUID === beziehungOrigArt.Beziehungspartner[0].GUID
                    }
                    return false
                  })
                  return !!beziehungDerOriginalArt
                })
              }
              if (bsDerSynonymenArt.Beziehungen.length > 0) {
                // falls noch darzustellende Beziehungen verbleiben, die DS pushen
                rcsOfSynonyms.push(bsDerSynonymenArt)
              }
            }
          })
        }
      })
    }

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {taxComponent ? taxComponent : ''}
            {taxRcsComponent ? taxRcsComponent : ''}
            {pcsComponent ? pcsComponent : ''}
            {rcsComponent ? rcsComponent : ''}
            {/*<Inspector data={object}/>*/}
          </div>
        </form>
      </fieldset>
    )
  }
})
