
from getpass import getpass

from app.database import SessionLocal, engine
from app.models import User
from app.services.security_service import verify_password


def check_login():
    print("\n========== EventSphere Login Diagnostic ==========")

    email = input("Enter your registered email: ").strip().lower()
    password = getpass("Enter your registered password: ")

    db = SessionLocal()

    try:
        print("\nDatabase:", engine.url.database)

        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:
            print("\nRESULT: USER NOT FOUND")
            print("The email does not exist in this database.")
            return

        print("\nUser found: YES")
        print("User ID:", user.id)
        print("Account active:", user.is_active)
        print("Role:", user.role)

        if not user.is_active:
            print("\nRESULT: ACCOUNT INACTIVE")
            return

        password_matches = verify_password(
            password,
            user.hashed_password
        )

        print("Password matches:", password_matches)

        if password_matches:
            print("\nRESULT: AUTHENTICATION CHECK PASSED")
        else:
            print("\nRESULT: PASSWORD DOES NOT MATCH")

    except Exception as error:
        print("\nDIAGNOSTIC ERROR:", str(error))

    finally:
        db.close()


if __name__ == "__main__":
    check_login()
