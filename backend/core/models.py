from pydantic import BaseModel

class FAQ(BaseModel):
    question: str
    answer: str

class Email(BaseModel):
    sender: str
    message: str
