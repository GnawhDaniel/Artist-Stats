from datetime import UTC
from uuid import uuid4
from sqlalchemy import Column, DateTime, String, Text
from database import Base
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = 'user_info'
    __table_args__= {'schema': 'auth'}
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    hashed_password = Column(Text, nullable=False)
    created_date = Column(DateTime(timezone=True), server_default='CURRENT_TIMESTAMP')
    session_id = Column(Text)
    session_id_expiry = Column(DateTime(timezone=True), server_default='CURRENT_TIMESTAMP')
    user_role = Column(String, server_default='user')
