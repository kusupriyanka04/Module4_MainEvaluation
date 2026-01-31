import { supabase } from "../config/supabase.js"

export const signup = async (req, res)=> {
    const { name, email, password, role } = req.body

    if(!['customer', 'owner', 'driver'].includes(role))
        return res.status(400).json({ message: "Invalid role" })

    const { data, error } = await supabase
    .from("users5")
    .insert([{ name, email, password, role }])

    if(error) return res.status(400).json(error)
    res.status(201).json(data)
}