from uuid import uuid4


def simulate_payment(amount) -> dict:

    payment_reference = (
        f"SIM-{uuid4().hex[:12].upper()}"
    )

    return {
        "success": True,
        "reference": payment_reference,
        "amount": str(amount),
        "payment_method": "SIMULATED"
    }