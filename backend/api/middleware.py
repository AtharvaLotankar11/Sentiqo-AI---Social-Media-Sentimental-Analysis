from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class ErrorHandlingMiddleware:
    """
    Middleware to catch unhandled exceptions and return JSON responses
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            logger.exception(f"Unhandled exception: {str(e)}")
            return JsonResponse(
                {
                    'error': 'Internal Server Error',
                    'message': str(e) if request.META.get('DEBUG') else 'An unexpected error occurred.'
                },
                status=500
            )
