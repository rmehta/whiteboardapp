"""
whiteboard model
"""
from lib.chai import model

class Whiteboard(model.Model):
	_name = "whiteboard"
	_create_table = """
	create table `whiteboard` (
		name varchar(180) primary key,
		label varchar(240) not null default "My List",
		owner varchar(240) not null,
		_updated timestamp,
		foreign key (owner) references user(name) on delete cascade
	) engine=InnoDB
	"""
	
	def __init__(self, obj):
		self.obj = obj
	
	def before_get(self):
		"""update whiteboard setting in user"""
		from lib.chai import db, sess
		db.setvalue('user', sess['user'], 'last_whiteboard', self.obj['name'], commit=True)
	
	def before_update(self):
		"""update email of users (for gravatars)"""
		from lib.chai import db, out
	
		for user in self.obj.get('whiteboarduser',[]):
			if not user.get('email'):
				user['email'] = db.getvalue('user', user['user'], 'email')
	
	def before_insert(self):
		self.before_update()
	
	def check_allow(self, method):
		"""raise exception if user is not owner or in shared"""
		from lib.chai import common, db, sess
		
		# rest only allowed if owner or shared
		if sess['user'] == self.obj.get('owner'):
			return
		if sess['user'] in [a['user'] for a in \
			db.sql("select user from whiteboarduser where parent=%s", self.obj['name'])]:
			return
		
		raise Exception, "This whiteboard is private"
