// actions/payment-projection-actions.ts

import { createClient } from "@/utils/supabase/server"

const supabase = await createClient()

export async function getPaymentProjections() {
  try {
    const { data, error } = await supabase.from("payment_projections").select("*")

    if (error) {
      console.error("Error fetching payment projections:", error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Unexpected error fetching payment projections:", error)
    return { data: [], error: error.message }
  }
}

export async function createPaymentProjection(paymentProjection: any) {
  try {
    const { data, error } = await supabase.from("payment_projections").insert([paymentProjection]).select()

    if (error) {
      console.error("Error creating payment projection:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Unexpected error creating payment projection:", error)
    return { data: null, error: error.message }
  }
}

export async function updatePaymentProjection(id: string, paymentProjection: any) {
  try {
    const { data, error } = await supabase.from("payment_projections").update(paymentProjection).eq("id", id).select()

    if (error) {
      console.error("Error updating payment projection:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Unexpected error updating payment projection:", error)
    return { data: null, error: error.message }
  }
}

export async function deletePaymentProjection(id: string) {
  try {
    const { data, error } = await supabase.from("payment_projections").delete().eq("id", id)

    if (error) {
      console.error("Error deleting payment projection:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("Unexpected error deleting payment projection:", error)
    return { data: null, error: error.message }
  }
}
