import unittest
import sys

class TestWhiteboard(unittest.TestCase):
	def setUp(self):
		import lib.chai.tests
		lib.chai.tests.register()
		lib.chai.tests.login()
	
	def tearDown(self):
		from lib.chai import objstore
		import lib.chai.tests

		objstore.delete(type='whiteboard', name='test')
		lib.chai.tests.cleanup()
		
	def test_post(self):
		from lib.chai.tests import xcall
		import json
		
		res = xcall('lib.chai.objstore.post', {"obj":json.dumps({
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