import datetime as dt

from pydantic import BaseModel, ConfigDict


class ClientCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    instagram: str | None = None
    event_type: str | None = None
    event_date: dt.date | None = None
    total_package: float | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    instagram: str | None = None
    event_type: str | None = None
    event_date: dt.date | None = None
    total_package: float | None = None
    stage: str | None = None


class ClientOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    phone: str | None
    email: str | None
    instagram: str | None
    event_type: str | None
    event_date: dt.date | None
    total_package: float | None
    stage: str
    created_at: dt.datetime
    pending_balance: float


class NoteCreate(BaseModel):
    content: str


class NoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    content: str
    created_at: dt.datetime


class PaymentCreate(BaseModel):
    amount: float
    payment_date: dt.date | None = None
    screenshot_link: str | None = None


class PaymentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    amount: float
    payment_date: dt.date
    screenshot_link: str | None


class InvoiceCreate(BaseModel):
    invoice_number: str | None = None
    amount: float
    status: str = "Unpaid"
    doc_link: str | None = None
    date: dt.date | None = None


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    invoice_number: str | None
    amount: float
    status: str
    doc_link: str | None
    date: dt.date


class ContractCreate(BaseModel):
    title: str | None = None
    signed: str = "No"
    doc_link: str | None = None
    date: dt.date | None = None


class ContractOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    title: str | None
    signed: str
    doc_link: str | None
    date: dt.date


class TimelineCreate(BaseModel):
    stage: str
    note: str | None = None


class TimelineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    stage: str
    note: str | None
    updated_at: dt.datetime


class FileCreate(BaseModel):
    label: str | None = None
    link: str


class FileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    client_id: int
    label: str | None
    link: str
    added_at: dt.datetime


class ClientDetail(ClientOut):
    notes: list[NoteOut]
    payments: list[PaymentOut]
    invoices: list[InvoiceOut]
    contracts: list[ContractOut]
    timeline: list[TimelineOut]
    files: list[FileOut]
