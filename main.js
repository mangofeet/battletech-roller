'use strict'

let mechMode = "biped"
let hitDirection = "front"

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
      2: "Center Torso",
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
      2: "Center Torso",
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

function hitTableText() {
  switch (hitDirection) {
  case "front":
    return "Front/Rear"
  case "left":
    return "Left"
  case "right":
    return "Right"
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


function handleHitTableChange(evt) {
  hitDirection = evt.target.value
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

function renderRollRow(roll, damage) {
  const total = rollTotal(roll)
  const location = hitTables[mechMode][hitDirection][total]

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

  preRoll()
  
  const inputRollCount = document.getElementById("inputRollCount")
  const rollCount = parseInt(inputRollCount.value || 1)
  
  let rows = ''

  for (let i = 0; i < rollCount; i++) {
    rows += renderRollRow(roll2d6())
  }
  

  const el = document.getElementById("resultArea")
  el.innerHTML = `
<hr>
<h5>${date()}</h5>
<h3>${rollCount} Roll${rollCount > 1 ? 's' : ''} on ${hitTableText()} table</h3>
<table>${getRowTableHeaders()}${rows}</table>
</hr>` + el.innerHTML
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

  preRoll()


  const roll = roll2d6()

  const { damagePerHit, damagePerCluster, weaponSize, clusterMod } = getClusterConfig()

  let weaponSizeIndex = weaponSize - 2
  // adjust index for this one
  if (weaponSize == 40) {
    weaponSizeIndex = 29
  }

  const clusterRoll = roll2d6()
  const total = Math.max(Math.min(12, rollTotal(clusterRoll) + (clusterMod || 0)))
  const clusterHits = clusterHitsTable[total][weaponSizeIndex]

  const report = {}
  
  
  let rows = ''
  let critCount = 0
  
  for (let totalDamage = clusterHits * damagePerHit; totalDamage > 0; totalDamage -= damagePerCluster) {
    const roll = roll2d6()

    const total = rollTotal(roll)
    const location = hitTables[mechMode][hitDirection][total]

    let thisDamage = damagePerCluster
    if (totalDamage - damagePerCluster < 0) {
      thisDamage = totalDamage
    }

    if (total == 2) critCount++
    
    rows += renderRollRow(roll, thisDamage)

    if (!report[location]) {
      report[location] = thisDamage
    } else {
      report[location] += thisDamage 
    }
  }

  let rollData = `<h3>Location Rolls (${hitTableText()} table):</h3><table>${getRowTableHeaders(true)}${rows}</table>`
  
  let tableData = `
<h3>Totals:</h3>
<table>
<tr>
<th>Location</th>
<th>Damage</th>
</tr>
`
  
  for (const loc in report) {
    tableData += `<tr><td>${loc}</td><td>${report[loc]}</td></tr>`
  }
  tableData+= `</table>`

  let critData = ''
  if (critCount > 0) {
    critData = `<p><b>${critCount} possible critical hit${critCount > 1 ? 's' : ''}!</b></p>`
  }

  rollData = critData+tableData+rollData
  
  let clusterModText = ''
  if (clusterMod != 0) {
    clusterModText = ` + <b>${clusterMod}</b> = <b>${clusterMod+rollTotal(clusterRoll)}</b> (max 12, min 2)`
  }
  
  rollData = `<p>${renderDice(clusterRoll)} = <b>${rollTotal(clusterRoll)}</b>${clusterModText} on cluster hits table: <b>${clusterHits}</b>/${weaponSize} hits (<b>${clusterHits * damagePerHit}</b> total damage)<p>` + rollData
  
  
  const el = document.getElementById("resultArea")
  el.innerHTML = `<hr><h5>${date()}</h5>${rollData}</hr>` + el.innerHTML
  

  

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

addListener('selectHitTable', 'change', handleHitTableChange)
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


