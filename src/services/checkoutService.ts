
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorName: string;
  date: Date;
}

export const createCheckoutSession = async (cartItems: CartItem[]) => {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        cartItems,
        successUrl: `${window.location.origin}/orders?status=success`,
        cancelUrl: `${window.location.origin}/cart`,
      },
    });

    if (error) {
      console.error("Error creating checkout session:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Checkout service error:", error);
    throw error;
  }
};
