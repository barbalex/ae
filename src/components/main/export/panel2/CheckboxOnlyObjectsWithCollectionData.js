'use strict'

import React from 'react'
import { Checkbox } from 'react-bootstrap'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  rootDiv: {
    marginBottom: 10,
    marginTop: 10
  },
  title: {
    marginBottom: 1,
    marginLeft: 6,
    marginTop: 10
  }
})

const CheckboxOnlyObjectsWithCollectionData = ({
  onlyObjectsWithCollectionData,
  onChangeOnlyObjectsWithCollectionData
}) => (
  <div
    className={css(styles.rootDiv)}
  >
    <p className={css(styles.title)}>
      <strong>
        Filterkriterien in Eigenschaften- und Beziehungssammlungen:
      </strong>
    </p>
    <Checkbox
      onChange={() =>
        onChangeOnlyObjectsWithCollectionData(true)
      }
      checked={onlyObjectsWithCollectionData}
    >
      <strong>filtern Arten bzw. Lebensräume</strong><br />
      Beispiel:<br />
      Filtern Sie in der Eigenschaftensammlung "ZH Artwert (aktuell)" im Feld "Artwert" nach "> 5",<br />
      erhalten Sie im Resultat nur Arten mit Artwert > 5
    </Checkbox>
    <Checkbox
      onChange={() =>
        onChangeOnlyObjectsWithCollectionData(false)
      }
      checked={!onlyObjectsWithCollectionData}
    >
      <strong>
        filtern Eigenschaften- bzw. Beziehungssammlungen
      </strong><br />
      Beispiel:<br />
      Filtern Sie nach Artwert > 5, erhalten Sie im Resultat alle Arten der gewählten Gruppen.<br />
      Der Artwert wird aber nur mitgeliefert, wenn er > 5 ist
    </Checkbox>
  </div>
)

CheckboxOnlyObjectsWithCollectionData.displayName = 'CheckboxOnlyObjectsWithCollectionData'

CheckboxOnlyObjectsWithCollectionData.propTypes = {
  onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
  onlyObjectsWithCollectionData: React.PropTypes.bool
}

export default CheckboxOnlyObjectsWithCollectionData
