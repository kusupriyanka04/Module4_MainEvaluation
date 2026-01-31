import { supabase } from "../config/supabase.js";

export const addVehicle = async (req, res)=> {
    const { role } = req.body
    if(role !== 'owner') return res.status(403).json({ message: "Only owners allowed" })

        const { data, error } = await supabase.from('vehicles').insert([req.body])
        if (error) return res.status(400).json(error)

        res.status(201).json(data)    
}

export const assignDriver = async (req, res) => {
    const { vehicleId } = req.params
    const {driver_id } = req.body

    const { data, error } = await supabase
    .from('vehicles')
    .update({ driver_id })
    .eq('id', vehicleId)

    if(error) return res.status(400).json(error)
    res.json(data)    
}

export const getVehicle = async (req, res) => {
    const { vehicleId } = req.params
    const { data } = await supabase.from('vehicles').select("*")
    .eq('id', vehicleId)
    res.json(data)
}