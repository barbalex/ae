import React from 'react'
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap'
import ButtonDeleteRcInstances from './buttonDeleteRcInstances/ButtonDeleteRcInstances.js'
import ProgressbarImport from './ProgressbarImport.js'
import AlertFirst5Imported from '../AlertFirst5Imported.js'
import AlertFirst5Deleted from '../AlertFirst5Deleted.js'

const Panel4 = ({
  name,
  rcsRemoved,
  idsOfAeObjects,
  idsNotImportable,
  panel3Done,
  importingProgress,
  deletingRcInstancesProgress,
  replicatingToAe,
  replicatingToAeTime,
  onClickImportieren,
  onClickRemoveRcInstances
}) => {
  const showDeleteRcInstancesButton = panel3Done
  const showProgressbarImport = importingProgress !== null && !rcsRemoved
  const showAlertFirst5Imported = importingProgress === 100 && !rcsRemoved

  return (
    <div>
      {
        panel3Done &&
        <Button
          className="btn-primary"
          onClick={onClickImportieren}
        >
          <Glyphicon glyph="download-alt" />
          &nbsp;
          Eigenschaftensammlung "{name}" importieren
        </Button>
      }
      {
        showDeleteRcInstancesButton &&
        <ButtonDeleteRcInstances
          name={name}
          rcsRemoved={rcsRemoved}
          deletingRcInstancesProgress={deletingRcInstancesProgress}
          onClickRemoveRcInstances={onClickRemoveRcInstances}
        />
      }
      {
        showProgressbarImport &&
        <ProgressbarImport importingProgress={importingProgress} />
      }
      {
        showAlertFirst5Imported &&
        <AlertFirst5Imported
          idsOfAeObjects={idsOfAeObjects}
          idsNotImportable={idsNotImportable}
          replicatingToAe={replicatingToAe}
          replicatingToAeTime={replicatingToAeTime}
        />
      }
      {
        deletingRcInstancesProgress !== null &&
        <ProgressBar
          bsStyle="success"
          now={deletingRcInstancesProgress}
          label={`${deletingRcInstancesProgress}% entfernt`}
        />
      }
      {
        deletingRcInstancesProgress === 100 &&
        <AlertFirst5Deleted
          idsOfAeObjects={idsOfAeObjects}
          nameBestehend={name}
          replicatingToAe={replicatingToAe}
          replicatingToAeTime={replicatingToAeTime}
        />
      }
    </div>
  )
}


Panel4.displayName = 'Panel4'

Panel4.propTypes = {
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
}

export default Panel4
