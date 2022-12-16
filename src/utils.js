function isEmptyObject (x) {
  return typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0
}

function arraysAreDifferent (list1, list2) {
  return JSON.stringify(list1) !== JSON.stringify(list2)
}

module.exports = { isEmptyObject, arraysAreDifferent }
