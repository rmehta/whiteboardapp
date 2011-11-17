"""
item model
"""
import model

class Item(model.Model):
	_name = "item"
	_parent = "whiteboard"
	_create_table = """
	create table `item` (
		parent varchar(240) not null,
		parent_type varchar(240) not null default "whiteboard",
		idx int(10) not null,
		content text,
		color varchar(20) not null default "black",
		`size` varchar(20) not null default "medium",
		_updated timestamp,
		foreign key (parent) references whiteboard(name) on delete cascade,
		unique (parent, idx)
	) engine=InnoDB
	"""