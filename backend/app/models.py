import datetime as dt

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str | None] = mapped_column(String)
    email: Mapped[str | None] = mapped_column(String)
    instagram: Mapped[str | None] = mapped_column(String)
    event_type: Mapped[str | None] = mapped_column(String)
    event_date: Mapped[dt.date | None] = mapped_column(Date)
    total_package: Mapped[float | None] = mapped_column(Numeric(10, 2))
    stage: Mapped[str] = mapped_column(String, default="Inquiry", server_default="Inquiry")
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    notes: Mapped[list["Note"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    payments: Mapped[list["Payment"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    contracts: Mapped[list["Contract"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    timeline: Mapped[list["TimelineEvent"]] = relationship(back_populates="client", cascade="all, delete-orphan")
    files: Mapped[list["FileLink"]] = relationship(back_populates="client", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    client: Mapped["Client"] = relationship(back_populates="notes")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_date: Mapped[dt.date] = mapped_column(Date, default=dt.date.today)
    screenshot_link: Mapped[str | None] = mapped_column(String)

    client: Mapped["Client"] = relationship(back_populates="payments")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    invoice_number: Mapped[str | None] = mapped_column(String)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String, default="Unpaid")
    doc_link: Mapped[str | None] = mapped_column(String)
    date: Mapped[dt.date] = mapped_column(Date, default=dt.date.today)

    client: Mapped["Client"] = relationship(back_populates="invoices")


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    title: Mapped[str | None] = mapped_column(String)
    signed: Mapped[str] = mapped_column(String, default="No")
    doc_link: Mapped[str | None] = mapped_column(String)
    date: Mapped[dt.date] = mapped_column(Date, default=dt.date.today)

    client: Mapped["Client"] = relationship(back_populates="contracts")


class TimelineEvent(Base):
    __tablename__ = "timeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    stage: Mapped[str] = mapped_column(String, nullable=False)
    note: Mapped[str | None] = mapped_column(Text)
    updated_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    client: Mapped["Client"] = relationship(back_populates="timeline")


class FileLink(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    label: Mapped[str | None] = mapped_column(String)
    link: Mapped[str] = mapped_column(String, nullable=False)
    added_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    client: Mapped["Client"] = relationship(back_populates="files")


class FreelanceEvent(Base):
    """Unbooked/freelancing opportunities not tied to a client, e.g. car shows."""

    __tablename__ = "freelance_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    event_date: Mapped[dt.date] = mapped_column(Date, nullable=False)
    location: Mapped[str | None] = mapped_column(String)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)
