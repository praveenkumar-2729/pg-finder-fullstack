import random
from datetime import datetime, timedelta

def generate_otp():
    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(seconds=30)
    return otp, expiry
