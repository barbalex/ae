'use strict'

import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  rootDiv: {
    marginBottom: 10,
    marginTop: 10
  },
  input: {
    top: 5
  },
  div: {
    marginTop: 0,
    marginBottom: 0
  },
  label: {
    float: 'none !important',
    marginLeft: 12,
  },
  p: {
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
    <p className={css(styles.p)}>
      <strong>
        Filterkriterien in Eigenschaften- und Beziehungssammlungen:
      </strong>
    </p>
    <div
      className={[css(styles.div), 'checkbox'].join(' ')}
    >
      <label className={css(styles.label)}>
        <input
          type="checkbox"
          onChange={() =>
            onChangeOnlyObjectsWithCollectionData(true)
          }
          checked={onlyObjectsWithCollectionData}
          className={css(styles.input)}
        />
        <strong>filtern Arten bzw. Lebensräume</strong><br />
        Beispiel:<br />
        Filtern Sie in der Eigenschaftensammlung "ZH Artwert (aktuell)" im Feld "Artwert" nach "> 5",<br />
        erhalten Sie im Resultat nur Arten mit Artwert > 5
      </label>
    </div>
    <div
      className={[css(styles.div), 'checkbox'].join(' ')}
    >
      <label className={css(styles.label)}>
        <input
          type="checkbox"
          onChange={() =>
            onChangeOnlyObjectsWithCollectionData(false)
          }
          checked={!onlyObjectsWithCollectionData}
          className={css(styles.input)}
        />
        <strong>
          filtern Eigenschaften- bzw. Beziehungssammlungen
        </strong><br />
        Beispiel:<br />
        Filtern Sie nach Artwert > 5, erhalten Sie im Resultat alle Arten der gewählten Gruppen.<br />
        Der Artwert wird aber nur mitgeliefert, wenn er > 5 ist
      </label>
    </div>
  </div>
)

CheckboxOnlyObjectsWithCollectionData.displayName = 'CheckboxOnlyObjectsWithCollectionData'

CheckboxOnlyObjectsWithCollectionData.propTypes = {
  onChangeOnlyObjectsWithCollectionData: React.PropTypes.func,
  onlyObjectsWithCollectionData: React.PropTypes.bool
}

export default CheckboxOnlyObjectsWithCollectionData
