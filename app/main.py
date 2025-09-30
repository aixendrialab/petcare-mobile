from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
# if you already have dev_seed and lot_d, include them too
from .routers import lot_d

#app = FastAPI(title="PetCare API", version="1.0.0")
app = FastAPI(title="PetCare API", version="1.0.0", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get('/api/v1/health')
def health():
    return {"status":"ok"}

app.include_router(auth.router, prefix='/api/v1', tags=['auth'])
app.include_router(lot_d.router, prefix='/api/v1', tags=['lot-d'])