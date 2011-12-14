from lib.py.core import user

class User(user.User):
	_create_table = """
	create table `user` (
		name varchar(180) primary key,
		fullname varchar(240),
		email varchar(180),
		password varchar(100),
		last_whiteboard varchar(100),
		pen_color varchar(100),
		pen_font varchar(100),
		_updated timestamp,
		foreign key (last_whiteboard) references whiteboard(name) on update set null
	) engine=InnoDB
	"""
	def __init__(self, obj):
		super(User, self).__init__(obj)
	