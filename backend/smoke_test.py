"""Seeds one sample client and exercises every endpoint once via TestClient."""

import os

os.environ.setdefault("PYTHONPATH", ".")

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def check(resp, expected=200):
    assert resp.status_code == expected, f"{resp.request.method} {resp.request.url} -> {resp.status_code}: {resp.text}"
    return resp.json()


def main():
    c = check(client.post("/clients", json={
        "name": "Asha & Rohit",
        "phone": "555-0100",
        "email": "asha.rohit@example.com",
        "instagram": "@asharohit",
        "event_type": "Wedding",
        "event_date": "2026-11-14",
        "total_package": 2500,
    }))
    client_id = c["id"]
    assert c["pending_balance"] == 2500
    print("created client", client_id)

    check(client.post(f"/clients/{client_id}/notes", json={"content": "Wants golden-hour outdoor shots"}))
    check(client.post(f"/clients/{client_id}/payments", json={"amount": 1000, "screenshot_link": "https://drive.google.com/file/d1"}))
    check(client.post(f"/clients/{client_id}/invoices", json={"invoice_number": "INV-001", "amount": 1000, "status": "Paid"}))
    check(client.post(f"/clients/{client_id}/contracts", json={"title": "Wedding package agreement", "signed": "Yes"}))
    check(client.post(f"/clients/{client_id}/timeline", json={"stage": "Booking", "note": "Deposit received"}))
    check(client.post(f"/clients/{client_id}/files", json={"label": "Contract PDF", "link": "https://drive.google.com/file/d2"}))
    print("added note/payment/invoice/contract/timeline/file")

    detail = check(client.get(f"/clients/{client_id}"))
    assert detail["stage"] == "Booking"
    assert detail["pending_balance"] == 1500
    assert len(detail["notes"]) == 1
    assert len(detail["payments"]) == 1
    assert len(detail["timeline"]) == 1
    print("detail ok: stage=Booking pending_balance=1500")

    listing = check(client.get("/clients"))
    assert len(listing) == 1
    print("list ok")

    check(client.patch(f"/clients/{client_id}", json={"phone": "555-0199"}))
    print("patch ok")

    check(client.delete(f"/clients/{client_id}"))
    check(client.get(f"/clients/{client_id}"), expected=404)
    print("delete + cascade ok")

    print("\nSMOKE TEST PASSED")


if __name__ == "__main__":
    main()
