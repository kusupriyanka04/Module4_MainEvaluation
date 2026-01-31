import { supabase } from "../config/supabase.js";

export const createTrip = async (req, res)=>{
    const { vehicle_id, passengers } = req.body

    const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicle_id)
    .single()

    if(!vehicle.isAvailable)
        return res.status(400).json({ message: "Vehicle not available" })
    if(passengers > vehicle.allowed_passengers)
        return res.status(400).json({message: "Passenger limit exceeded"})

    await supabase.from('vehicles')
    .update({ isAvailable: false })
    .eq('id', vehicle_id)

    const { data, error } = await supabase.from('trip')
    .insert([req.body])

    if(error) return res.status(400).json(error)

    res.status(201).json(data)    
}

export const endTrip = async(req, res)=> {
    const { tripId } = req.params

    const { data: trip } = await supabase
    .from('trip')
    .select('*, vehicles(rate_per_km)')
    .eq('id', tripId)
    .single()

    const cost = trip.distance_km * trip.vehicles.rate_per_km

    await supabase.from('trips')
    .update({ isCompleted: true, tripCost: cost })
    .eq('id', tripId)

    await supabase.from('trip')
    .update({ isCompleted: true, tripCost: cost })
    .eq('id', tripId)

    await supabase.from('trip')
    .update({ isAvailable: true})
    .eq('id', trip.vehicle_id)

    res.json({ message: "Trip Ended", cost })
}