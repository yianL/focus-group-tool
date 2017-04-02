import { getRandomInt } from "helper";
// Does a simple algorithm: Selects initial people at random then replaces people 
// to see if they improve the score. It saves the best replacement for each person
var selectFocusGroup = ( people, constraints) => {
  let size = getFocusGroupSize(constraints)
  if(size > people)
    return null

  var focusGroup = grabRandomFocusGroup(people, size)

  for (i=0; i<people.length; i++) {
    focuGroup = tryPersonInGroup(i, people, focusGroup, constraints)
  }

  return focusGroup.values()
}

// Tries to see if a person is a better fit in the group. Finds its optimal swap
// and replaces that person. If no swap, it returns the same group.
//
// Returns a focus group object.
var tryPersonInGroup = ( id, people, group, constraints ) => {
  // Person is in group already
  if(group[id] != null)
    return group
  
  var minId = null
  var minScore = scoreDataset(group.values(), constraints)
  
  for (var personId in group) {
    if (group.hasOwnProperty(personId)) {
      var hold = group[personId]
      group[personId] = people[id]  

      // Try to see score replacing each person
      var score = scoreDataset(group.values(), constraints)
      group[personId] = hold

      // Find the best replacement
      if(score < minScore) {
        minId = personId
        minScore = score
      }
    }
  }

  if(minId != null) {
    delete group[minId]
    group[id] = people[id]
  }

  return group
}

// Returns a JS Object with random people using their 'index' as keys to identify them
var grabRandomFocusGroup = ( people, size ) => {
  var grabbed = {}
  while(grabbed.length < size) {
    var index = getRandomInt(0, people.length)
    if(grabbed[index] != null)
      grabbed[index] = people[index]
  }

  return grabbed
}

var getFocusGroupSize = ( constraints ) => {
  var size = 0
  for (let constraint of constraints)
    size += constraint.count

  return size
}

// Returns the score of a set of people and how closely they follow
// a set of constraints.
// People Array: [ {age: "10-20", ...} ]
// Constraints Array: [ {category: "age", target: "10-20", count: 4 } ]
var scoreDataset = ( people, constraints ) => {
  var score = 0

  for (let constraint of constraints) {
    score += scoreConstraint(people, constraint)
  }

  return score
}


// Returns the score for a given constraint, this is defined as the difference 
// between actual matches to a category and expected matches.
var scoreConstraint = ( people, constraint ) => {
  var matches = 0

  for (let person of people) {
    if personFitsConstraint(person, constraint) 
      matches++
  }

  return Math.abs(matches - constraint.count)
}

// Return true if a person matches the given constraint
// Return false if a person fails a given constraint
var personFitsConstraint = ( person, constraint ) => {
  var category = constraint.category
  var target = constraint.target
  var actual = person[category] 

  return (Array.isArray(actual) ? actual[0] : actual) == target
}

export default {
  personFitsConstraint,
  scoreConstraint,
  tryPersonInGroup,
  selectFocusGroup,
};
