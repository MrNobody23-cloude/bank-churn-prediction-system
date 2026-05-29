from firebase_functions import https_fn
from app import app

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    # This wraps the Flask app for Firebase Functions
    with app.request_context(req.environ):
        return app.full_dispatch_request()
