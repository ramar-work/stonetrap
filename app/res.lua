-- Retrieve the map image from the server

local level = route[2]
local rtype = route[3]
local parts = { "private", "levels", "l" .. level, rtype }
local path, resource
path = table.concat( parts, "/" )
table.insert( parts, route.active )
resource = table.concat( parts, "/" )

---[[
if fs.exists( path ) and fs.exists( resource )
then
	response = { file = resource }
	return
else
	response = { status = 404, content = "No file found." }
	return
end
--]]
