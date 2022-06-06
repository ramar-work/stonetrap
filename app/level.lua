-- Extract the level
local lid = route.active

-- Check for (and load) the level
local level = require( table.concat( {
	"private", "levels", "l" .. lid, "level" 
}, "." ) )

level.hintimage = table.concat{ "/hint/", lid }

return {
	level = level
}
