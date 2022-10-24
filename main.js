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
  
  console.log("hit table changed", evt)

  hitDirection = evt.target.value
}

function handleClearButton() {
  const el = document.getElementById("resultArea")
  el.innerHTML = ``
}

function handleRollButton() {
  const roll = roll2d6()

  const total = rollTotal(roll)
  const location = hitTables[mechMode][hitDirection][total]

  const el = document.getElementById("resultArea")
  el.innerHTML = `<p>${roll[0]} + ${roll[1]} = ${total} on ${hitDirection} table: ${location} ${total == 2 ? 'CRIT' : ''}<p>` + el.innerHTML

}

function getClusterConfig() {
  const inputDamagePerHit = document.getElementById("inputDamagePerHit")
  const inputDamageCluster = document.getElementById("inputDamageCluster")
  const inputWeaponSize = document.getElementById("inputWeaponSize")

  return {
    damagePerHit: parseInt(inputDamagePerHit.value || 1),
    damagePerCluster: parseInt(inputDamageCluster.value || 1),
    weaponSize: parseInt(inputWeaponSize.value || 1),
  }
  
}

function handleSavePreset() {
  const inputPresetName = document.getElementById("inputPresetName")

  
  const { damagePerHit, damagePerCluster, weaponSize } = getClusterConfig()
  
  const presetName = inputPresetName.value || `${damagePerHit}/Msl,C${damagePerCluster}/${weaponSize}`
  
  const el = document.getElementById("presets")
  el.innerHTML = `<button onClick="handlePreset(${damagePerHit}, ${damagePerCluster}, ${weaponSize})">${presetName}</button>` + el.innerHTML
}

function handlePreset(damagePerHit, damagePerCluster, weaponSize) {
  document.getElementById("inputDamagePerHit").value = damagePerHit
  document.getElementById("inputDamageCluster").value = damagePerCluster
  document.getElementById("inputWeaponSize").value = weaponSize
  
}

function handleRollClustersButton() {


  const el = document.getElementById("resultArea")
  el.innerHTML = `<hr>` + el.innerHTML

  const roll = roll2d6()

  const { damagePerHit, damagePerCluster, weaponSize } = getClusterConfig()

  let weaponSizeIndex = weaponSize - 2
  // adjust index for this one
  if (weaponSize == 40) {
    weaponSizeIndex = 29
  }

  const clusterRoll = roll2d6()
  const total = rollTotal(clusterRoll)
  const clusterHits = clusterHitsTable[total][weaponSizeIndex]
  el.innerHTML = `<p>${roll[0]} + ${roll[1]} = ${total} on cluster hits table: ${clusterHits}/${weaponSize} hits<p>` + el.innerHTML

  const report = {}
  
  for (let totalDamage = clusterHits * damagePerHit; totalDamage > 0; totalDamage -= damagePerCluster) {
    const roll = roll2d6()

    const total = rollTotal(roll)
    const location = hitTables[mechMode][hitDirection][total]

    let thisDamage = damagePerCluster
    if (totalDamage - damagePerCluster < 0) {
      thisDamage = totalDamage
    }
    el.innerHTML = `<p>${roll[0]} + ${roll[1]} = ${total} on ${hitDirection} table: ${thisDamage} damage to ${location}<p>` + el.innerHTML

    if (!report[location]) {
      report[location] = thisDamage
    } else {
      report[location] += thisDamage 
    }
  }

  el.innerHTML = `<hr>` + el.innerHTML
  
  for (const loc in report) {
    el.innerHTML = `<p>${loc}: ${report[loc]} damage</p>` + el.innerHTML  
  }
  el.innerHTML = `<p>Totals:</p>` + el.innerHTML  
  
  el.innerHTML = `<hr>` + el.innerHTML
  

  

}

function addListener(elementID, event, func) {
  const el = document.getElementById(elementID)
  el.addEventListener(event, func)
  return function() {
    el.removeEventListener(event, func)
  }
}

addListener('selectHitTable', 'change', handleHitTableChange)
handlePreset(2, 2, 6)
