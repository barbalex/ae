'use strict'

import React from 'react'
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import ButtonDeleteRcInstances from './buttonDeleteRcInstances/buttonDeleteRcInstances.js'
import ProgressbarImport from './progressbarImport.js'
import AlertFirst5Imported from '../alertFirst5Imported.js'
import AlertFirst5Deleted from '../alertFirst5Deleted.js'

export default React.createClass({
  displayName: 'Panel4',

  propTypes: {
    name: React.PropTypes.string,
    rcsRemoved: React.PropTypes.bool,
    idsOfAeObjects: React.PropTypes.array,
    idsNotImportable: React.PropTypes.array,
    importingProgress: React.PropTypes.number,
    deletingRcInstancesProgress: React.PropTypes.number,
    panel3Done: React.PropTypes.bool,
    replicatingToAe: React.PropTypes.string,
    replicatingToAeTime: React.PropTypes.string,
    onClickImportieren: React.PropTypes.func,
    onClickRemoveRcInstances: React.PropTypes.func
  },

  render () {
    const { name, rcsRemoved, idsOfAeObjects, idsNotImportable, panel3Done, importingProgress, deletingRcInstancesProgress, replicatingToAe, replicatingToAeTime, onClickImportieren, onClickRemoveRcInstances } = this.props
    const showDeleteRcInstancesButton = panel3Done
    const showProgressbarImport = importingProgress !== null && !rcsRemoved
    const showAlertFirst5Imported = importingProgress === 100 && !rcsRemoved

    return (
      <div>
        {
          panel3Done
          ? <Button
              className='btn-primary'
              onClick={onClickImportieren}>
              <Glyphicon glyph='download-alt'/> Eigenschaftensammlung "{name}" importieren
            </Button>
          : null
        }
        {
          showDeleteRcInstancesButton
          ? <ButtonDeleteRcInstances
              name={name}
              rcsRemoved={rcsRemoved}
              deletingRcInstancesProgress={deletingRcInstancesProgress}
              onClickRemoveRcInstances={onClickRemoveRcInstances} />
          : null
        }
        {
          showProgressbarImport
          ? <ProgressbarImport
              importingProgress={importingProgress} />
          : null
        }
        {
          showAlertFirst5Imported
          ? <AlertFirst5Imported
              idsOfAeObjects={idsOfAeObjects}
              idsNotImportable={idsNotImportable}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
          : null
        }
        {
          deletingRcInstancesProgress !== null
          ? <ProgressBar
              bsStyle='success'
              now={deletingRcInstancesProgress}
              label={`${deletingRcInstancesProgress}% entfernt`} />
          : null
        }
        {
          deletingRcInstancesProgress === 100
          ? <AlertFirst5Deleted
              idsOfAeObjects={idsOfAeObjects}
              nameBestehend={name}
              replicatingToAe={replicatingToAe}
              replicatingToAeTime={replicatingToAeTime} />
          : null
        }
      </div>
    )
  }
})