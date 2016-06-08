import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  text: {
    textDecoration: 'underline',
    paddingLeft: 5,
    color: 'red',
    fontWeight: 500,
    cursor: 'progress'
  }
})

const RebuildingRedundantData = ({ rebuildingRedundantData }) =>
  <OverlayTrigger
    placement="left"
    overlay={
      <Tooltip
        id="rebuildingRedundantDataTooltip"
        bsStyle="info"
      >
        Bitte Geduld: Die App kann zeitweise einfrieren!
      </Tooltip>
    }
  >
    <p
      className={css(styles.text)}
    >
      {rebuildingRedundantData}
    </p>
  </OverlayTrigger>

RebuildingRedundantData.displayName = 'RebuildingRedundantData'

RebuildingRedundantData.propTypes = {
  rebuildingRedundantData: React.PropTypes.string
}

export default RebuildingRedundantData
