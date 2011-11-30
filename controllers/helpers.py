def get(**args):
	"""get list of my whiteboards"""
	if not 'cmd' in args:
		return {"error":"bad request"}
		
	if args['cmd'] == 'my whiteboards':
		import database, session
		
		if session.user=='guest':
			return {"error":"not logged in"}
		
		db = database.get()
		return {"data":db.sql("""select wb.name, wb.label
				from whiteboard wb, whiteboarduser wbuser
				where wbuser.user=%s
					and wbuser.parent = wb.name""" % session.user)}
		
if __name__=='__main__':
	import http_request
	http_request.main()

