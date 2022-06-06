-- 
local lid = route.active
local parts = { "private", "levels", "l" .. lid }


-- Check for valid directory 
if not fs.exists( table.concat( parts, "/" ) )
then
	-- Return 404
	response = { status = 404, content = "Level not found" }
	return
end


-- Check for a manifest file
table.insert( parts, "level" )
if not fs.exists( table.concat( parts, "/" ) .. ".lua" )
then
	-- Return 404
	response = { status = 404, content = "Level info not found" }
	return
end


-- Load the level info 
local L = require( table.concat( parts, "." ) )


-- The make an array out of all the files that comprise the map
table.remove( parts, #parts )
table.insert( parts, "shots" )


local imgset = {}
local files = fs.list( table.concat( parts, "/" ) )
for _,v in ipairs( files.results ) 
do
	table.insert( imgset, { 
		path = table.concat( { "/res", lid, "shots", v.name }, "/" )
	, index = tonumber( string.match( v.name, "%-(%d+)", -7 ) )
	})
end


-- And sort in order
table.sort( imgset, function (a,b) return a.index < b.index end )


return {
	imgarray = imgset
, bgmusic = table.concat( { "/res", lid, "music", L.bgmusic }, "/" )
, level = lid
, tilecount = #imgset
, imgcount = #imgset
, width = L.width
, height = L.height
, backgroundcolor = L.background
, title = L.title
}
