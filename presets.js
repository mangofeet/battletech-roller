'use strict'

const defaultPresets = {
  "LRM 20": [1, 5, 20, 0],
  "SRM 6": [2, 2, 6, 0],
  "LB 20-X AC": [1, 1, 20, 0],
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
