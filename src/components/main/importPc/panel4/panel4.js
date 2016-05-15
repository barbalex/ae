'use strict'

import React from 'react'
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import ButtonDeletePcInstances from './buttonDeletePcInstances/buttonDeletePcInstances.js'
import ProgressbarImport from '../progressbarImport.js'
import AlertFirst5Imported from '../alertFirst5Imported.js'
import AlertFirst5Deleted from '../alertFirst5Deleted.js'

export default React.createClass({
  displayName: 'Panel4',

  propTypes: {
    name: React.PropTypes.string,
    pcsRemoved: React.PropTypes.bool,
    idsOfAeObjects: React.PropTypes.array,
    idsNotImportable: React.PropTypes.array,
    importingProgress: React.PropTypes.number,
    deletingPcInstancesProgress: React.PropTypes.number,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    onClickRemovePcInstances: React.PropTypes.func,
    onClickImportieren: React.PropTypes.func
  },

  render() {
    const { replicatingToAe, replicatingToAeTime, onClickRemovePcInstances, onClickImportieren, name, pcsRemoved, idsOfAeObjects, idsNotImportable, importingProgress, deletingPcInstancesProgress } = this.props
    const showProgressbarImport = importingProgress !== null && !pcsRemoved
    const showAlertFirst5Imported = importingProgress === 100 && !pcsRemoved

    return (
      <div>
        <Button
          className='btn-primary'
          onClick={onClickImportieren}>
            <Glyphicon glyph='download-alt'/> Eigenschaftensammlung "{name}" importieren
        </Button>
        <ButtonDeletePcInstances
          name={name}
          pcsRemoved={pcsRemoved}
          deletingPcInstancesProgress={deletingPcInstancesProgress}
          onClickRemovePcInstances={onClickRemovePcInstances} />
        {
          showProgressbarImport &&
          <ProgressbarImport
            importingProgress={importingProgress} />
        }
        {
          showAlertFirst5Imported &&
          <AlertFirst5Imported
            idsOfAeObjects={idsOfAeObjects}
            idsNotImportable={idsNotImportable}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime} />
        }
        {
          deletingPcInstancesProgress !== null &&
          <ProgressBar
            bsStyle='success'
            now={deletingPcInstancesProgress}
            label={`${deletingPcInstancesProgress}% entfernt`} />
        }
        {
          deletingPcInstancesProgress === 100 &&
          <AlertFirst5Deleted
            idsOfAeObjects={idsOfAeObjects}
            nameBestehend={name}
            replicatingToAe={replicatingToAe}
            replicatingToAeTime={replicatingToAeTime} />
        }
      </div>
    )
  }
})
