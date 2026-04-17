"""
ASGI config for dog_walk_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import dog_walk_backend.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dog_walk_backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            dog_walk_backend.routing.websocket_urlpatterns
        )
    ),
})
