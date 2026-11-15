from pathlib import Path
import qrcode


QR_DIRECTORY = Path("static/qr-codes")


def generate_qr_code(ticket_code: str) -> str:

    QR_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True
    )

    file_path = QR_DIRECTORY / f"{ticket_code}.png"

    qr_image = qrcode.make(ticket_code)
    qr_image.save(file_path)

    return file_path.as_posix()