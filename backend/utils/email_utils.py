import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SENDER_EMAIL = "ourpgfinder@gmail.com"
APP_PASSWORD = "fnfq ctin eezc chci"   # NOT  real Gmail password

def send_email(to_email, subject, html_content):
    message = MIMEMultipart()
    message["From"] = SENDER_EMAIL
    message["To"] = to_email
    message["Subject"] = subject

    # Add HTML body
    message.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(message)
        server.quit()
        print(f"Email sent to {to_email}")

    except Exception as e:
        print("Email failed:", e)
