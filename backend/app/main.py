from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base
from backend.app.seed_data import seed_database
from backend.app.routers import (
    auth_router,
    crop_router,
    market_router,
    ai_router,
    offer_router,
    fpo_router,
    buyer_router,
    admin_router,
    dispute_router
)

app = FastAPI(
    title="Kisan Market API",
    description="Market Intelligence and Transaction Enablement Platform API",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

@app.get("/")
def read_root():
    return {
        "platform": "Kisan Market",
        "tagline": "Better Prices. Better Buyers. Better Decisions.",
        "status": "Online & Ready",
        "docs_url": "/docs"
    }

# Include Routers
app.include_router(auth_router.router)
app.include_router(crop_router.router)
app.include_router(market_router.router)
app.include_router(ai_router.router)
app.include_router(offer_router.router)
app.include_router(fpo_router.router)
app.include_router(buyer_router.router)
app.include_router(admin_router.router)
app.include_router(dispute_router.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
