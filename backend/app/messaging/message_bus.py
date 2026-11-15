from app.models import AgentMessage


class MessageBus:

    def __init__(self):
        self.agents = {}

    def register(self, agent):

        self.agents[agent.name] = agent

    def send(self, message, db):

        log = AgentMessage(
            sender=message.sender,
            receiver=message.receiver,
            performative=message.performative.value,
            content=message.content,
            conversation_id=message.conversation_id,
            status="received"
        )

        db.add(log)
        db.commit()
        db.refresh(log)

        receiver = self.agents.get(message.receiver)

        if receiver is None:

            log.status = "failed"
            log.error_message = "Agent not registered"

            db.commit()

            return {
                "performative": "FAILURE",
                "content": {
                    "reason": "Agent not registered"
                }
            }

        try:

            response = receiver.handle_message(
                message,
                db
            )

            log.status = "processed"
            db.commit()

            return response

        except Exception as error:

            db.rollback()

            log.status = "failed"
            log.error_message = str(error)

            db.add(log)
            db.commit()

            return {
                "performative": "FAILURE",
                "content": {
                    "reason": str(error)
                }
            }


message_bus = MessageBus()