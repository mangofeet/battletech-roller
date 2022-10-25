'use strict'

const defaultPresets = {
  "LRM 20": [1, 5, 20, 0],
  "LRM 15": [1, 5, 15, 0],
  "LRM 10": [1, 5, 10, 0],
  "LRM 5": [1, 5, 5, 0],
  "SRM 6": [2, 2, 6, 0],
  "SRM 4": [2, 2, 4, 0],
  "SRM 2": [2, 2, 2, 0],
  "Streak SRM 6": [2, 2, 6, 12],
  "Streak SRM 4": [2, 2, 4, 12],
  "Streak SRM 2": [2, 2, 2, 12],
  "LB 20-X AC": [1, 1, 20, 0],
  "LB 10-X AC": [1, 1, 10, 0],
  "LB 5-X AC": [1, 1, 5, 0],
  "LB 2-X AC": [1, 1, 2, 0],
  "HAG 20": [1, 5, 20, 0],
  "HAG 30": [1, 5, 30, 0],
  "HAG 40": [1, 5, 40, 0],
  "Rocket Launcher 20": [1, 5, 20, 0],
  "Rocket Launcher 15": [1, 5, 15, 0],
  "Rocket Launcher 10": [1, 5, 10, 0],
  "MLM 9 LRM": [1, 5, 9, 0],
  "MLM 9 SRM": [2, 2, 9, 0],
  "MLM 7 LRM": [1, 5, 7, 0],
  "MLM 7 SRM": [2, 2, 7, 0],
  "MLM 5 LRM": [1, 5, 5, 0],
  "MLM 5 SRM": [2, 2, 5, 0],
  "MLM 3 LRM": [1, 5, 3, 0],
  "MLM 3 SRM": [2, 2, 3, 0],
  "MRM 40": [1, 5, 40, 0],
  "MRM 30": [1, 5, 30, 0],
  "MRM 20": [1, 5, 20, 0],
  "MRM 10": [1, 5, 10, 0],
  "ATM 12": [2, 5, 12, 2],
  "ATM 9": [2, 5, 9, 2],
  "ATM 6": [2, 5, 6, 2],
  "ATM 3": [2, 5, 3, 2],
  "ATM 12 ER": [1, 5, 12, 2],
  "ATM 9 ER": [1, 5, 9, 2],
  "ATM 6 ER": [1, 5, 6, 2],
  "ATM 3 ER": [1, 5, 3, 2],
  "ATM 12 HE": [3, 5, 12, 2],
  "ATM 9 HE": [3, 5, 9, 2],
  "ATM 6 HE": [3, 5, 6, 2],
  "ATM 3 HE": [3, 5, 3, 2],
}

function getPresetSelectElement() {
  return document.getElementById("selectPreset")
}

function handlePreset(damagePerHit, damagePerCluster, weaponSize, clusterMod) {
  document.getElementById("inputDamagePerHit").value = damagePerHit
  document.getElementById("inputDamageCluster").value = damagePerCluster
  document.getElementById("inputWeaponSize").value = weaponSize
  document.getElementById("inputClusterMod").value = clusterMod
}

function handlePresetChange(evt) {
  try{
    const newValues = JSON.parse(evt.target.value)
    handlePreset.apply(null, newValues)
  } catch (err) {
    alert(err)
  }
 
}

function handleSavePreset() {
  const inputPresetName = document.getElementById("inputPresetName")

  
  const { damagePerHit, damagePerCluster, weaponSize, clusterMod } = getClusterConfig()

  const presets = getPresets()
  
  const presetName = inputPresetName.value || `${damagePerHit}/Msl,C${damagePerCluster}/${weaponSize}`
  
  presets[presetName] = [damagePerHit, damagePerCluster, weaponSize, clusterMod]

  setPresets(presets)

  inputPresetName.value = ''
  
  renderPresets()
  
}

function getPresets() {
  const data = localStorage.getItem('presets')
  if (!data) return defaultPresets
  else try {
    return JSON.parse(data)
  } catch (err) {
    setPresets(defaultPresets)
    return defaultPresets
  }
}

function setPresets(data) {
  localStorage.setItem('presets', JSON.stringify(data))
}

function renderPresets() {

  let data = ''

  const presets = getPresets()
  
  for (const name in presets) {
    data += `<option value="${JSON.stringify(presets[name])}">${name}</option>`
  }

  
  getPresetSelectElement().innerHTML = data
  
}
