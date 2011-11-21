"""
whiteboard model
"""
import model

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
	
	def before_post(self):
		"""update email of users (for gravatars)"""
		import database
		db = database.get()
		for user in self.obj.get('whiteboarduser'):
			if not user.get('email'):
				user['email'] = db.sql("""select email from user where name=%s""", user.get('user'))[0]['email']
	
	def check_allow(self, method):
		"""raise exception if user is not owner or in shared"""
		import common, session, database
		db = database.get()
		
		# anyone allowed to save new objects
		if method=='post' and self.obj.get('_new') and session.user!='guest':
			return

		# rest only allowed if owner or shared
		if session.user == self.obj.get('owner'):
			return
		if session.user in [a['value'] for a in \
			db.sql("select value from whiteboarduser where parent=%s", self.obj['name'])]:
			return
		
		raise Exception, "This whiteboard is private"