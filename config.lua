return {
	db = "none"
,	title = "S T O N E T R A P  -  A Matching Game for the Browser"
, shorttitle = "stonetrap"
,	fqdn = "stonetrap.org"
,	static = { "/assets", "/ROBOTS.TXT", "/favicon.ico" }
,	routes = {

		["/"] = { model="default", view = "home" },

		["options"] = { model="options", view = "options" },

		["select"] = { 
			model="select"
		, view = "select" 
		},

		["hint"] = { [":id=number"] = { model="hint" } },

		["res"] = { [":id=number"] = { ["{music,shots}"] = { ["*"] = { model="res" } } } },

		["level"] = {
			[":id=number"] = {
				model="level"
			, view = "level" 
			}
		},

		["fetch"] = {
			[":id=number"] = { model="fetch" }
		}

	}	
}
