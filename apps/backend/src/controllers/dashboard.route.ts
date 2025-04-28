import { getDashboardData } from "../services/dashboard.service";
import { Router } from "express";

const dashboardRoute = Router();

dashboardRoute.get("/", getDashboardData);

export default dashboardRoute;