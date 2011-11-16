"""
whiteboarduser model
"""
import model

class WhiteboardUser(model.Model):
	_name = "whiteboarduser"
	_parent = "whiteboard"
	_create_table = """
	create table `whiteboarduser` (
		parent varchar(180) not null,
		parent_type varchar(180) not null default "whiteboard",
		idx int(10) not null,
		value varchar(180) not null,
		foreign key (parent) references whiteboard(name) on delete cascade,
		foreign key (value) references user(name) on delete cascade,
		unique (parent, idx)
	) engine=InnoDB
	"""