import unittest
import sys

class TestWhiteboard(unittest.TestCase):
	def setUp(self):
		import lib.py.tests
		lib.py.tests.register()
		lib.py.tests.login()
	
	def tearDown(self):
		from lib.py import objstore
		import lib.py.tests

		objstore.delete(type='whiteboard', name='test')
		lib.py.tests.cleanup()
		
	def test_post(self):
		from lib.py.tests import xcall
		import json
		
		res = xcall('lib.py.objstore.post', {"obj":json.dumps({
			'type':'whiteboard',
			'name':'test',
			'label':'Test',
			'owner':'testuser',
			'item': [
				{'content':'line1'},
				{'content':'line2'},
			]
		})})
					
		self.assertTrue(res.get('message')=='ok')

if __name__=='__main__':
	unittest.main()