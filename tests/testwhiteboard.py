path = 'localhost/rmehta/whiteboardapp'

import unittest
import sys

class TestWhiteboard(unittest.TestCase):
	def test_helper(self):
		"""test helper"""
		import requests
		requests.get('localhost')