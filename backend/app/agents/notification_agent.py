from app.agents.base_agent import BaseAgent
from app.messaging.message import Performative

from app.services.notification_service import create_notification


class NotificationAgent(BaseAgent):

    name = "NotificationAgent"

    def handle_message(self, message, db):

        if message.performative != Performative.REQUEST:

            return {
                "performative": "REFUSE",
                "content": {
                    "reason": "REQUEST message required"
                }
            }

        data = message.content

        notification = create_notification(
            db=db,
            user_id=int(data["user_id"]),
            title=data["title"],
            message=data["message"],
            notification_type=data.get(
                "notification_type", "general"
            ),
            channel=data.get("channel", "in_app")
        )

        return {
            "performative": "INFORM",
            "content": {
                "notification_id": notification.id
            }
        }