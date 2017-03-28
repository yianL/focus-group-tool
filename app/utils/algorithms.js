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


// Returns the score for a given constraint
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
