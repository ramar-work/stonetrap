-- Retrieve the hint image from the server

local level = route.active

if fs.exists( "private/levels/l" .. level )
then
	response = {}
	response.file = "private/levels/l" .. level .. "/hint.png"
	return
-- return response{ file = $path }
else
	response = {}
	response.status = 404
	response.content = "No file found."
	return
end
