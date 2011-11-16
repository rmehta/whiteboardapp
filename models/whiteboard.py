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