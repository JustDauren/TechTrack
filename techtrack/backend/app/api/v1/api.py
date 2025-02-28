from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, tasks, equipment, parts, reports, trips, knowledge

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(equipment.router, prefix="/equipment", tags=["equipment"])
api_router.include_router(parts.router, prefix="/parts", tags=["parts"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])