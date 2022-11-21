'use strict'

let mechMode = "biped"

const clusterHitsTable = {
  2:  [1, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 12],
  3:  [1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 12],
  4:  [1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 18],
  5:  [1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15, 16, 16, 17, 17, 17, 18, 18, 24],
  6:  [1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15, 16, 16, 17, 17, 17, 18, 18, 24],
  7:  [1, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15, 16, 16, 17, 17, 17, 18, 18, 24],
  8:  [2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 13, 14, 15, 16, 16, 17, 17, 17, 18, 18, 24],
  9:  [2, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 14, 15, 16, 17, 18, 19, 20, 21, 21, 22, 23, 23, 24, 32],
  10: [2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 14, 15, 16, 17, 18, 19, 20, 21, 21, 22, 23, 23, 24, 32],
  11: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40],
  12: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40],
}

const locationLabels = {
  "front": "Front/Rear",
  "left": "Left",
  "right": "Right"
}

const hitTables = {
  "biped": {
    "front": {
      2: "Center Torso",
      3: "Right Arm",
      4: "Right Arm",
      5: "Right Leg",
      6: "Right Torso",
      7: "Center Torso",
      8: "Left Torso",
      9: "Left Leg",
      10: "Left Arm",
      11: "Left Arm",
      12: "Head"
    },
    "left": {
      2: "Left Torso",
      3: "Left Leg",
      4: "Left Arm",
      5: "Left Arm",
      6: "Left Leg",
      7: "Left Torso",
      8: "Center Torso",
      9: "Right Torso",
      10: "Right Arm",
      11: "Right Leg",
      12: "Head"
    },
    "right": {
      2: "Right Torso",
      3: "Right Leg",
      4: "Right Arm",
      5: "Right Arm",
      6: "Right Leg",
      7: "Right Torso",
      8: "Center Torso",
      9: "Left Torso",
      10: "Left Arm",
      11: "Left Leg",
      12: "Head"
    }
  },
  "quad": {
    "front": {
      2: "Center Torso",
      3: "Right Front Leg",
      4: "Right Front Leg",
      5: "Right Rear Leg",
      6: "Right Torso",
      7: "Center Torso",
      8: "Left Torso",
      9: "Left Rear Leg",
      10: "Left Front Leg",
      11: "Left Front Leg",
      12: "Head"
    },
    "left": {
      2: "Left Torso",
      3: "Left Rear Leg",
      4: "Left Front Leg",
      5: "Left Front Leg",
      6: "Left Rear Leg",
      7: "Left Torso",
      8: "Center Torso",
      9: "Right Torso",
      10: "Right Front Leg",
      11: "Right Rear Leg",
      12: "Head"
    },
    "right": {
      2: "Right Torso",
      3: "Right Rear Leg",
      4: "Right Front Leg",
      5: "Right Front Leg",
      6: "Right Rear Leg",
      7: "Right Torso",
      8: "Center Torso",
      9: "Left Torso",
      10: "Left Front Leg",
      11: "Left Leg",
      12: "Head"
    }
  }
}

function rollD6() {
  return Math.floor(Math.random() * 6)+1
}

function roll2d6() {
  return [rollD6(), rollD6()]
}

function rollTotal(roll) {
  if (!Array.isArray(roll)) return -1
  if (roll.length != 2) return -2
  return roll[0] + roll[1]
}


function handleTargetTypeChange(evt) {
  mechMode = evt.target.value
}

function handleClearButton() {
  const el = document.getElementById("resultArea")
  el.innerHTML = ``
}

function preRoll() {
  const checkboxAutoClear = document.getElementById("checkboxAutoClear")
  if (checkboxAutoClear.checked) {
    handleClearButton()
  }
  
}

function renderDice(roll) {
  const dieSize = 24
  return `
<img class="icon" width="${dieSize}" height="${dieSize}" alt="${roll[0]}" src="img/d6-${roll[0]}.svg">
<img class="icon" width="${dieSize}" height="${dieSize}" alt="${roll[1]}" src="img/d6-${roll[1]}.svg">
`
}

function renderRollRow(locTable, roll, damage) {
  const total = rollTotal(roll)
  const location = hitTables[mechMode][locTable][total]
  
  const isCrit = total == 2
  
  let data = `
<td>${renderDice(roll)}</td>
<td>${total}</td>
<td>${location}${isCrit ? ' CRIT' : ''}</td>
`

  if (damage !== undefined) {
    data += `<td>${damage}</td>`
  }

  return `<tr class="${isCrit ? 'crit' : ''}">${data}</tr>`
}

function renderTableButtons(id, tableType) {
  let data = '<div class="btn-group">'
  for (const loc in hitTables[tableType]) {
    data += `<button id="btn-${id}-${tableType}-${loc}" class="btn-${id}">${locationLabels[loc]}</button>`
  }

  data += '</div>'

  return data
}

function getRowTableHeaders(damage) {
  let data = `
<td>Dice</td>
<td>Total</td>
<td>Location</td>
`

  if (damage !== undefined) {
    data += `<td>Damage</td>`
  }

  return `<tr>${data}</tr>`
}


function handleRollButton() {
  doRolling(false)
}

function getClusterConfig() {
  const inputClusterMod = document.getElementById("inputClusterMod")
  const inputDamagePerHit = document.getElementById("inputDamagePerHit")
  const inputDamageCluster = document.getElementById("inputDamageCluster")
  const inputWeaponSize = document.getElementById("inputWeaponSize")

  return {
    damagePerHit: parseInt(inputDamagePerHit.value || 1),
    damagePerCluster: parseInt(inputDamageCluster.value || 1),
    weaponSize: parseInt(inputWeaponSize.value || 1),
    clusterMod: parseInt(inputClusterMod.value || 0)
  }
  
}


function handleRollClustersButton() {
  doRolling(true)
}

function doRolling(clusters = false) {

  preRoll()


  const roll = roll2d6()

  let { damagePerHit, damagePerCluster, weaponSize, clusterMod } = getClusterConfig()
  if (!clusters) {
    damagePerHit = 1
    damagePerCluster = 1
    weaponSize = -1
    clusterMod = 0
  }

  let weaponSizeIndex = weaponSize - 2
  // adjust index for this one
  if (weaponSize == 40) {
    weaponSizeIndex = 29
  }

  const clusterRoll = roll2d6()
  const total = Math.max(Math.min(12, rollTotal(clusterRoll) + (clusterMod || 0)))
  
  let clusterHits = clusterHitsTable[total][weaponSizeIndex]
  
  if (!clusters) {
    // get the input for the roll count here, fake it as "clusterHits"
    const inputRollCount = document.getElementById("inputRollCount")
    clusterHits = parseInt(inputRollCount.value || 1)
  }

  let critCount = 0
  
  const rolls = []
  
  for (let totalDamage = clusterHits * damagePerHit; totalDamage > 0; totalDamage -= damagePerCluster) {
    let thisDamage = damagePerCluster
    if (totalDamage - damagePerCluster < 0) {
      thisDamage = totalDamage
    }
    
    const roll = roll2d6()
    
    const total = rollTotal(roll)
    if (total == 2) critCount++
    
    rolls.push({
      damage: thisDamage,
      roll
    })
  }

  let tables = ''

  const btnID = (new Date()).getTime()
  
  for (const locTable in hitTables[mechMode]) {
    
    const report = {}
    
    
    let rows = ''
    
    for (const data of rolls) {
      
      const roll = data.roll
      const thisDamage = data.damage
      
      const total = rollTotal(roll)


      
      rows += renderRollRow(locTable, roll, clusters ? thisDamage : undefined)

      const location = hitTables[mechMode][locTable][total]
      
      if (!report[location]) {
        report[location] = thisDamage
      } else {
        report[location] += thisDamage 
      }

    }

    
    let tableData = `
<div class="roll-totals-${btnID}" id="totals-${btnID}-${mechMode}-${locTable}" style="display: none;"> `
    

    if (clusters) {
      
    tableData += `

<h3>${locationLabels[locTable]} Totals:</h3>
<table>
<tr>
<th>Location</th>
<th>Damage</th>
</tr>
`
    
    for (const loc in report) {
      tableData += `<tr><td>${loc}</td><td>${report[loc]}</td></tr>`
    }
      
    }
    
    tableData+= `</table>
<h3>${locationLabels[locTable]} Location Rolls:</h3><table>${getRowTableHeaders(clusters ? true : undefined)}${rows}</table>
</div>`
    
    tables += tableData
    
  }

  let critData = ''
  if (critCount > 0) {
    critData = `<p><b>${critCount} possible critical hit${critCount > 1 ? 's' : ''}!</b></p>`
  }

  let rollData = critData+ renderTableButtons(btnID, mechMode) +tables
  
  let clusterModText = ''
  if (clusterMod != 0) {
    clusterModText = ` + <b>${clusterMod}</b> = <b>${clusterMod+rollTotal(clusterRoll)}</b> (max 12, min 2)`
  }
  
  if (clusters) {
  rollData = `<p>${renderDice(clusterRoll)} = <b>${rollTotal(clusterRoll)}</b>${clusterModText} on cluster hits table: <b>${clusterHits}</b>/${weaponSize} hits (<b>${clusterHits * damagePerHit}</b> total damage)<p>` + rollData  
  }
  
  const el = document.getElementById("resultArea")
  el.innerHTML = `<hr><h5>${date()}</h5>${rollData}</hr>` + el.innerHTML
  

  
  for (const locTable in hitTables[mechMode]) {
    const btn = document.getElementById(`btn-${btnID}-${mechMode}-${locTable}`)

    btn.addEventListener('click', () => {

      for (const el of document.getElementsByClassName(`btn-${btnID}`)) {
        el.classList.remove('active')
      }
      
      btn.classList.add('active')
      
      for (const el of document.getElementsByClassName(`roll-totals-${btnID}`)) {
        el.style.display = 'none'
      }

      const totals = document.getElementById(`totals-${btnID}-${mechMode}-${locTable}`)
      totals.style.display = 'block'
      
    })

    if (locTable == 'front') {
      btn.classList.add('active')
      document.getElementById(`totals-${btnID}-${mechMode}-${locTable}`).style.display = 'block'
    }
    
  }
  

}

function date() {
  return new Date().toLocaleString()
}

function addListener(elementID, event, func) {
  const el = document.getElementById(elementID)
  el.addEventListener(event, func)
  return function() {
    el.removeEventListener(event, func)
  }
}

addListener('selectTargetType', 'change', handleTargetTypeChange)
addListener('selectPreset', 'change', handlePresetChange)
handlePreset.apply(null, defaultPresets["LRM 20"])
renderPresets()
document.getElementById("inputRollCount").value = 1

const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      './sw.js',
      {
        scope: '/battletech-roller/',
      }
    );
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }
  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }
}

registerServiceWorker()


