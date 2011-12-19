"""
request startup script
----------------------

if core models are overriden, they can be remove from lib.py.core_models here
"""

# app url
app_url = 'http://whiteboardapp.net/'

# list models (for update)
models = [
	'user',
	'item',
	'whiteboarduser',
	'whiteboard'
]

# user is not a core module (overriden)
from lib.py import core_models

core_models.remove('user')