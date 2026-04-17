from django.urls import re_path
from walks import consumers

websocket_urlpatterns = [
    re_path(r'ws/walks/(?P<walk_id>\w+)/$', consumers.WalkConsumer.as_asgi()),
]
