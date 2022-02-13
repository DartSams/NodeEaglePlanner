from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from FutureEagles.consumers import EchoConsumer

application = ProtocolTypeRouter({
    'websocket':URLRouter([
        path("ws/FutureEagles/",EchoConsumer())
    ])
})