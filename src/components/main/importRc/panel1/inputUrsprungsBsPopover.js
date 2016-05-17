'use strict'

import React from 'react'
import { Popover } from 'react-bootstrap'

export default (
  <Popover
    id="InputUrsprungsBsPopover"
    trigger={['click', 'focus']}
    title='Was heisst "eigenständig"?'
  >
    <p>
      Eine zusammenfassende Beziehungssammlung wird zwei mal importiert:
    </p>
    <ol>
      <li>
        Als <strong>eigenständige</strong> Beziehungssammlung.
      </li>
      <li>
        Gemeinsam mit bzw. zusätzlich zu anderen in eine <strong>zusammenfassende</strong> Beziehungssammlung.
      </li>
    </ol>
    <p>
      Wählen Sie hier den Namen der eigenständigen Sammlung.
    </p>
    <p>
      <strong>Zweck:</strong>
      &nbsp;
      In der zusammenfassenden Sammlung ist bei jedem Datensatz beschrieben, woher er stammt.
    </p>
  </Popover>
)
