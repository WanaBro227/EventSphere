from uuid import uuid4

from app.agents.base_agent import BaseAgent
from app.messaging.message import Performative

from app.models import (
    Booking,
    Event,
    TicketCategory
)


class BookingAgent(BaseAgent):

    name = "BookingAgent"

    def handle_message(self, message, db):

        if message.performative != Performative.REQUEST:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "REQUEST message required"
                }
            }

        data = message.content

        category = db.query(TicketCategory).filter(
            TicketCategory.id == data["ticket_category_id"],
            TicketCategory.event_id == data["event_id"],
            TicketCategory.is_active.is_(True)
        ).with_for_update().first()

        event = db.query(Event).filter(
            Event.id == data["event_id"],
            Event.status == "published"
        ).first()

        quantity = int(data.get("quantity", 1))

        if not category or not event or quantity < 1:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "Invalid event or ticket category"
                }
            }

        available = category.quantity - category.sold_count

        if quantity > available:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "Insufficient tickets",
                    "available": available
                }
            }

        category.sold_count += quantity

        booking = Booking(
            booking_reference=f"ES-{uuid4().hex[:10].upper()}",
            user_id=int(data["user_id"]),
            event_id=event.id,
            ticket_category_id=category.id,
            quantity=quantity,
            total_amount=category.price * quantity,
            status="confirmed",
            payment_status="pending"
        )

        db.add(booking)
        db.commit()
        db.refresh(booking)

        return {
            "performative": "AGREE",
            "content": {
                "booking_id": booking.id,
                "booking_reference": booking.booking_reference,
                "total_amount": str(booking.total_amount)
            }
        }