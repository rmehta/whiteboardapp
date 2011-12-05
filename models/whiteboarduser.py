"""
whiteboarduser model
"""
from lib.py import model

class WhiteboardUser(model.Model):
	_name = "whiteboarduser"
	_parent = "whiteboard"
	_create_table = """
	create table `whiteboarduser` (
		parent varchar(180) not null,
		parent_type varchar(180) not null default "whiteboard",
		idx int(10) not null,
		user varchar(180) not null,
		email varchar(180),
		foreign key (parent) references whiteboard(name) on delete cascade,
		foreign key (user) references user(name) on delete cascade,
		unique (parent, idx)
	) engine=InnoDB
	"""