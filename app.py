"""
WSGI handler
============

WSGI server for handling dynamic reqeusts. The requests will be directly passed
on to the relevant python module to be executed and response will be in json.

The method to be called must be explicitly allowed by calling the @whitelist decorator.

method="package.module.method"

the query_string and environ will be passed to the method
"""

def simplifyargs(args):
	"""convert list properties into single"""
	for key in args:
		if len(args[key])==1:
			args[key] = args[key][0]
			
	return args

def application(environ, start_response):
	import urlparse, sys, json
	
	args = simplifyargs(urlparse.parse_qs(environ['QUERY_STRING']))
	
	start_response('200 OK', [('Content-Type','text/html')])
	
	try:
	
		# execute a method
		if 'method' in args:
		
			parts = args['method'].split('.')
			module = '.'.join(parts[:-1])
			method = parts[-1]
		
			# import the module
			__import__(module)
		
			from lib.py import whitelisted
						
			if module in sys.modules:
				# check if the method is whitelisted
				if getattr(sys.modules[module], method) not in whitelisted:
					return '{"error":"Method `%s` not allowed"}' % method

				args['environ'] = environ

				resp = getattr(sys.modules[module], method)(**args)
				if not type(resp)==str:
					resp = json.dumps(resp)
				
				return resp
			else:
				return '{"error":"Unable to load method"}'
		else:
			return '{"error":"Query string must have method"}'
			
	except Exception, e:
		from lib.py.common import traceback
		return '{"error": "%s"}' % str(traceback())