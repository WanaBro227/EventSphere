class BaseAgent:

    name = "BaseAgent"

    def handle_message(self, message, db):

        raise NotImplementedError(
            "Each agent must implement handle_message()"
        )