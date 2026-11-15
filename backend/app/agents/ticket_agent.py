from uuid import uuid4

from app.agents.base_agent import BaseAgent
from app.messaging.message import Performative

from app.models import Booking, Ticket

from app.services.qr_service import generate_qr_code


class TicketAgent(BaseAgent):

    name = "TicketAgent"

    def handle_message(self, message, db):

        if message.performative != Performative.REQUEST:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "REQUEST message required"
                }
            }

        booking = db.query(Booking).filter(
            Booking.id == message.content.get("booking_id"),
            Booking.status == "confirmed",
            Booking.payment_status == "completed"
        ).first()

        if not booking:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "Paid confirmed booking not found"
                }
            }

        created_tickets = []

        for _ in range(booking.quantity):

            code = f"TKT-{uuid4().hex[:14].upper()}"

            qr_path = generate_qr_code(code)

            ticket = Ticket(
                ticket_code=code,
                booking_id=booking.id,
                user_id=booking.user_id,
                event_id=booking.event_id,
                ticket_category_id=booking.ticket_category_id,
                qr_code_path=qr_path,
                status="valid"
            )

            db.add(ticket)

            created_tickets.append(code)

        db.commit()

        return {
            "performative": "INFORM",
            "content": {
                "booking_id": booking.id,
                "ticket_codes": created_tickets
            }
        }