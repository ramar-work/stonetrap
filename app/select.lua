-- Read a file and return it

-- The base directory for all the levels shouldn't change
local dir = {
	path = "private/levels"
, luapath = "private.levels"
}

-- Store the list of levels here (may need to sort)
local list = {}

-- Get a list of all files in the levels directory 
--local aa = fs.list( dir.path )
for _,v in ipairs( fs.list( dir.path ).results ) do
	if v.type == "directory" then
		local a = require( table.concat( { dir.luapath, v.name, "level" }, "." ) )
		--table.insert( list, a )
		a.hintimage = table.concat{"/hint/", a.level}
		a.levelhref = table.concat{"/level/", a.level}
		list[ a.level ] = a
	end
end

return {
	L = list 
}
