import React from 'react'
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import ButtonDeletePcInstances from './buttonDeletePcInstances/ButtonDeletePcInstances.js'
import ProgressbarImport from '../ProgressbarImport.js'
import AlertFirst5Imported from '../AlertFirst5Imported.js'
import AlertFirst5Deleted from '../AlertFirst5Deleted.js'

const Panel4 = ({
  replicatingToAe,
  replicatingToAeTime,
  onClickRemovePcInstances,
  onClickImportieren,
  name,
  pcsRemoved,
  idsOfAeObjects,
  idsNotImportable,
  importingProgress,
  deletingPcInstancesProgress
}) => (
  <div>
    <Button
      className="btn-primary"
      onClick={onClickImportieren}
    >
      <Glyphicon glyph="download-alt" /> Eigenschaftensammlung "{name}" importieren
    </Button>
    <ButtonDeletePcInstances
      name={name}
      pcsRemoved={pcsRemoved}
      deletingPcInstancesProgress={deletingPcInstancesProgress}
      onClickRemovePcInstances={onClickRemovePcInstances}
    />
    {
      importingProgress !== null &&
      !pcsRemoved &&
      <ProgressbarImport
        importingProgress={importingProgress}
      />
    }
    {
      importingProgress === 100 &&
      !pcsRemoved &&
      <AlertFirst5Imported
        idsOfAeObjects={idsOfAeObjects}
        idsNotImportable={idsNotImportable}
        replicatingToAe={replicatingToAe}
        replicatingToAeTime={replicatingToAeTime}
      />
    }
    {
      deletingPcInstancesProgress !== null &&
      <ProgressBar
        bsStyle="success"
        now={deletingPcInstancesProgress}
        label={`${deletingPcInstancesProgress}% entfernt`}
      />
    }
    {
      deletingPcInstancesProgress === 100 &&
      <AlertFirst5Deleted
        idsOfAeObjects={idsOfAeObjects}
        nameBestehend={name}
        replicatingToAe={replicatingToAe}
        replicatingToAeTime={replicatingToAeTime}
      />
    }
  </div>
)

Panel4.displayName = 'Panel4'

Panel4.propTypes = {
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
}

export default Panel4
