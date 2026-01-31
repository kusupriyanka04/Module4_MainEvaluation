import express from "express";
import { logger } from "./routes/middlewares/logger.middleware.js";
import { rateLimiter } from "./routes/middlewares/rateLimiter.middleware.js";
import { notFound } from "./routes/middlewares/notFound.middleware.js";

import { signup } from "./routes/controllers/user.controller.js";
import { addVehicle, assignDriver, getVehicle } from "./routes/controllers/vehicle.controller.js";
import { createTrip, endTrip } from "./routes/controllers/trip.controller.js";
import { analytics } from "./routes/controllers/analytics.controller.js";

const app = express()
app.use(express.json())
app.use(logger)

app.post('/users/signup', signup)

app.post('/vehicles/add', rateLimiter, addVehicle)
app.patch('/vehicles/assign-driver/:vehicleId', assignDriver)
app.get('/vehicles/:vehicleId', getVehicle)

app.post('/trips/create', createTrip)
app.patch('/trips/end/:tripId', endTrip)

app.get('/analytics', analytics)

app.use(notFound)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
   console.log(`server running on port ${PORT}`)
);