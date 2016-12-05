var InsurancePlz = InsurancePlz || {};

/**
 * Creates an array of target data objects which it parses from the provided JSON
 * String.
 * @param {String} targetsJSON A string in JSON format containing all target data.
 * @return {Array} targets An array containing all the target data in the JSON string.
 */
function createAttacksFromJSON(targetJSON) {
  let list = JSON.parse(targetJSON).targets;
  var targets = [];
  for (i = 0; i < list.length; i++) {
    targets.push(new InsurancePlz.TargetData(list[i].targetName, list[i].targetCategory, list[i].securityVector, list[i].impact, list[i].attackImage));
  }
  return targets;
}
