from datetime import datetime, timezone

from app.agents.base_agent import BaseAgent
from app.messaging.message import Performative

from app.models import Waitlist, TicketCategory


class WaitlistAgent(BaseAgent):

    name = "WaitlistAgent"

    def handle_message(self, message, db):

        if message.performative != Performative.REQUEST:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "REQUEST message required"
                }
            }

        data = message.content

        if data.get("action") == "join":

            category = db.query(TicketCategory).filter(
                TicketCategory.id == data["ticket_category_id"],
                TicketCategory.event_id == data["event_id"]
            ).first()

            if not category:

                return {
                    "performative": "REFUSE",
                    "content": {
                        "reason": "Ticket category not found"
                    }
                }

            position = db.query(Waitlist).filter(
                Waitlist.ticket_category_id == category.id,
                Waitlist.status == "waiting"
            ).count() + 1

            item = Waitlist(
                user_id=data["user_id"],
                event_id=data["event_id"],
                ticket_category_id=data["ticket_category_id"],
                quantity=data.get("quantity", 1),
                position=position,
                status="waiting"
            )

            db.add(item)
            db.commit()
            db.refresh(item)

            return {
                "performative": "AGREE",
                "content": {
                    "waitlist_id": item.id,
                    "position": position
                }
            }

        if data.get("action") == "expire":

            now = datetime.now(timezone.utc)

            expired = db.query(Waitlist).filter(
                Waitlist.status == "offered",
                Waitlist.offer_expires_at < now
            ).all()

            for item in expired:
                item.status = "expired"

            db.commit()

            return {
                "performative": "INFORM",
                "content": {
                    "expired_count": len(expired)
                }
            }

        return {
            "performative": "REFUSE",
            "content": {
                "reason": "Unsupported waitlist action"
            }
        }