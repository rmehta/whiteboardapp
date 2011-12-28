"""
helper functions

- get list of my whiteboards
"""
from lib.chai import db, whitelist

@whitelist()
def mywblist(**args):
	"""get list of my whiteboards and those i am shared"""
	from lib.chai import sess
	
	if sess['user']=='guest':
		return {"error":"not logged in"}
	
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
			order by wb.label asc""", sess), 'user':sess['user']}

@whitelist()
def style_change(**args):
	"""update last_whiteboard, pen_font, pen_color"""
	from lib.chai import sess
	
	for key in args:
		if key not in ('name', '_method'):
			db.setvalue('user', sess['user'], key, args[key])
		