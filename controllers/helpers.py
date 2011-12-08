"""
helper functions

- get list of my whiteboards
"""
from lib.py import database, sess, whitelist

@whitelist
def mywblist(**args):
	"""get list of my whiteboards and those i am shared"""
	
	if sess['user']=='guest':
		return {"error":"not logged in"}
	
	db = database.get()
	return {'result': db.sql("""
			select name, label from whiteboard
			where owner = %(user)s
			order by label asc""", sess) + \
			db.sql("""
			select wb.name, wb.label
			from whiteboard wb, whiteboarduser wbuser
			where 
				wbuser.user=%(user)s and 
				wbuser.parent = wb.name
			order by wb.label asc""", sess)}
