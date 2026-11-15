from .booking_agent import BookingAgent
from .ticket_agent import TicketAgent
from .waitlist_agent import WaitlistAgent
from .notification_agent import NotificationAgent


def register_agents(message_bus):

    agents = [
        BookingAgent(),
        TicketAgent(),
        WaitlistAgent(),
        NotificationAgent()
    ]

    for agent in agents:
        message_bus.register(agent)