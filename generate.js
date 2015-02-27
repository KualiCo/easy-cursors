// Generate .json file from YML
var yaml = require("js-yaml")
var fs = require("fs")

var input = process.argv[2]
var output = process.argv[3]
console.log("GENERATE", input, "==>", output)

var content = fs.readFileSync(input, "utf8")

var docs = []
yaml.safeLoadAll(content, function(doc) {
  docs.push(doc)
})

console.log(" - docs:", docs.length)

var jsonContent = "var GLOBAL_ENTRY_DATA = " + JSON.stringify(docs, null, "  ")
fs.writeFileSync(output, jsonContent, 'utf8')

console.log(" - [OK]")

