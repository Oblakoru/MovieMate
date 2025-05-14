""" import grpc
from grpc import ServerInterceptor
import jwt
from dotenv import load_dotenv
import os


load_dotenv()
JWT_SECRET = os.getenv('JWT_SECRET')

class AuthInterceptor(ServerInterceptor):
    def __init__(self, exempt_methods=None):
        self.exempt_methods = exempt_methods or []

    def intercept_service(self, continuation, handler_call_details):
        method = handler_call_details.method

        if method in self.exempt_methods:
            return continuation(handler_call_details)

        # Extract metadata
        metadata = dict(handler_call_details.invocation_metadata)
        auth_header = metadata.get("authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            def deny_request(ignored_request, context):
                context.abort(grpc.StatusCode.UNAUTHENTICATED, "Missing or invalid token")
            return grpc.unary_unary_rpc_method_handler(deny_request)

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # You could attach user info to context here if needed
        except jwt.ExpiredSignatureError:
            def expired_request(ignored_request, context):
                context.abort(grpc.StatusCode.UNAUTHENTICATED, "Token expired")
            return grpc.unary_unary_rpc_method_handler(expired_request)
        except jwt.InvalidTokenError:
            def invalid_request(ignored_request, context):
                context.abort(grpc.StatusCode.UNAUTHENTICATED, "Invalid token")
            return grpc.unary_unary_rpc_method_handler(invalid_request)

        return continuation(handler_call_details) """