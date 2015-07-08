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
    let pcsOfSynonymsComponent = null
    let rcsComponent = null
    let rcsOfSynonymsComponent = null
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
        return !rc.Typ
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

      console.log('object.js, namesOfPcsBuilt before synonyms', namesOfPcsBuilt)
    }

    if (synonymObjects.length > 0) {
      _.forEach(synonymObjects, function (synonymObject) {
        // property collections
        if (synonymObject.Eigenschaftensammlungen && synonymObject.Eigenschaftensammlungen.length > 0) {
          _.each(synonymObject.Eigenschaftensammlungen, function (pc) {

            console.log('object.js, namesOfPcsBuilt', namesOfPcsBuilt)
            console.log('object.js, pc.Name', pc.Name)
            console.log('object.js, !_.includes(namesOfPcsBuilt, pc.Name)', !_.includes(namesOfPcsBuilt, pc.Name))
            
            if (!_.includes(namesOfPcsBuilt, pc.Name)) {
              // this pc is not yet shown
              pcsOfSynonyms.push(pc)
              // update namesOfPcsBuilt
              namesOfPcsBuilt.push(pc.Name)
            }
          })
        }

        console.log('object.js, namesOfPcsBuilt after synonyms', namesOfPcsBuilt)

        // relation collections
        if (synonymObject.Beziehungssammlungen && synonymObject.Beziehungssammlungen.length > 0) {
          _.each(synonymObject.Beziehungssammlungen, function (rcOfSynonym) {
            if (!_.includes(namesOfRcsBuilt, rcOfSynonym.Name) && rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is not yet shown and is not taxonomic
              rcsOfSynonyms.push(rcOfSynonym)
              // update namesOfRcsBuilt
              namesOfRcsBuilt.push(rcOfSynonym.Name)
            } else if (rcOfSynonym['Art der Beziehungen'] !== 'synonym' && rcOfSynonym.Typ !== 'taxonomisch') {
              // this rc is already shown
              // but there could be relations that are not shown yet
              const rcOfOriginal = _.find(object.Beziehungssammlungen, function (rc) {
                return rc.Name === rcOfSynonym.Name
              })

              if (rcOfSynonym.Beziehungen && rcOfSynonym.Beziehungen.length > 0 && rcOfOriginal && rcOfOriginal.Beziehungen && rcOfOriginal.Beziehungen.length > 0) {
                // Beide Arten haben in derselben Beziehungssammlung Beziehungen
                // in der Originalart vorhandene Beziehungen aus dem Synonym entfernen
                rcOfSynonym.Beziehungen = _.reject(rcOfSynonym.Beziehungen, function (relationOfSynonym) {
                  // suche in Beziehungen der Originalart eine mit denselben Beziehungspartnern
                  var beziehungDerOriginalArt = _.find(rcOfOriginal.Beziehungen, function (beziehungOrigArt) {
                    // return _.isEqual(relationOfSynonym, beziehungOrigArt);  Wieso funktioniert das nicht?
                    if (relationOfSynonym.Beziehungspartner.length > 0 && beziehungOrigArt.Beziehungspartner.length > 0) {
                      return relationOfSynonym.Beziehungspartner[0].GUID === beziehungOrigArt.Beziehungspartner[0].GUID
                    }
                    return false
                  })
                  return !!beziehungDerOriginalArt
                })
              }
              if (rcOfSynonym.Beziehungen.length > 0) {
                // falls noch darzustellende Beziehungen verbleiben, die DS pushen
                rcsOfSynonyms.push(rcOfSynonym)
              }
            }
          })
        }
      })

      if (pcsOfSynonyms.length > 0) {
        const pcComponent = _.map(pcsOfSynonyms, function (pc) {
          return <PropertyCollection key={pc.Name} pcType='Datensammlung' object={object} propertyCollection={pc}/>
        })
        pcsOfSynonymsComponent = (
          <div>
            <h4>Eigenschaften von Synonymen:</h4>
            {pcComponent}
          </div>
        )
      }
      if (rcsOfSynonyms.length > 0) {

      }
    }

    console.log('object.js, pcsOfSynonyms', pcsOfSynonyms)
    console.log('object.js, rcsOfSynonyms', rcsOfSynonyms)

    return (
      <fieldset id='main'>
        <form className={formClassNames} autoComplete='off'>
          <div id='formContent'>
            <h4>Taxonomie:</h4>
            {taxComponent ? taxComponent : ''}
            {taxRcsComponent ? taxRcsComponent : ''}
            {pcsComponent ? pcsComponent : ''}
            {rcsComponent ? rcsComponent : ''}
            {pcsOfSynonymsComponent ? pcsOfSynonymsComponent : ''}
            {rcsOfSynonymsComponent ? rcsOfSynonymsComponent : ''}
            {/*<Inspector data={object}/>*/}
          </div>
        </form>
      </fieldset>
    )
  }
})
