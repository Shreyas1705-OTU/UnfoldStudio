from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .crud import client_to_out, pending_balance
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Photography Client Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_client_or_404(db: Session, client_id: int) -> models.Client:
    client = db.get(models.Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@app.get("/clients", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(get_db)):
    clients = db.query(models.Client).order_by(models.Client.created_at.desc()).all()
    return [client_to_out(db, c) for c in clients]


@app.post("/clients", response_model=schemas.ClientOut)
def create_client(payload: schemas.ClientCreate, db: Session = Depends(get_db)):
    client = models.Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client_to_out(db, client)


@app.get("/clients/{client_id}", response_model=schemas.ClientDetail)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = get_client_or_404(db, client_id)
    return {
        **client_to_out(db, client),
        "notes": client.notes,
        "payments": client.payments,
        "invoices": client.invoices,
        "contracts": client.contracts,
        "timeline": client.timeline,
        "files": client.files,
    }


@app.patch("/clients/{client_id}", response_model=schemas.ClientOut)
def update_client(client_id: int, payload: schemas.ClientUpdate, db: Session = Depends(get_db)):
    client = get_client_or_404(db, client_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client_to_out(db, client)


@app.delete("/clients/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = get_client_or_404(db, client_id)
    db.delete(client)
    db.commit()
    return {"ok": True}


@app.post("/clients/{client_id}/notes", response_model=schemas.NoteOut)
def add_note(client_id: int, payload: schemas.NoteCreate, db: Session = Depends(get_db)):
    get_client_or_404(db, client_id)
    note = models.Note(client_id=client_id, **payload.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@app.post("/clients/{client_id}/payments", response_model=schemas.PaymentOut)
def add_payment(client_id: int, payload: schemas.PaymentCreate, db: Session = Depends(get_db)):
    get_client_or_404(db, client_id)
    data = payload.model_dump()
    if data.get("payment_date") is None:
        data["payment_date"] = datetime.utcnow().date()
    payment = models.Payment(client_id=client_id, **data)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@app.post("/clients/{client_id}/invoices", response_model=schemas.InvoiceOut)
def add_invoice(client_id: int, payload: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    get_client_or_404(db, client_id)
    data = payload.model_dump()
    if data.get("date") is None:
        data["date"] = datetime.utcnow().date()
    invoice = models.Invoice(client_id=client_id, **data)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


@app.post("/clients/{client_id}/contracts", response_model=schemas.ContractOut)
def add_contract(client_id: int, payload: schemas.ContractCreate, db: Session = Depends(get_db)):
    get_client_or_404(db, client_id)
    data = payload.model_dump()
    if data.get("date") is None:
        data["date"] = datetime.utcnow().date()
    contract = models.Contract(client_id=client_id, **data)
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


@app.post("/clients/{client_id}/timeline", response_model=schemas.TimelineOut)
def add_timeline_event(client_id: int, payload: schemas.TimelineCreate, db: Session = Depends(get_db)):
    client = get_client_or_404(db, client_id)
    event = models.TimelineEvent(client_id=client_id, **payload.model_dump())
    db.add(event)
    client.stage = payload.stage
    db.commit()
    db.refresh(event)
    return event


@app.post("/clients/{client_id}/files", response_model=schemas.FileOut)
def add_file(client_id: int, payload: schemas.FileCreate, db: Session = Depends(get_db)):
    get_client_or_404(db, client_id)
    file_link = models.FileLink(client_id=client_id, **payload.model_dump())
    db.add(file_link)
    db.commit()
    db.refresh(file_link)
    return file_link
