"server only"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { userCreateProps } from "@/utils/types";

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userCreateProps) => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    console.log("Attempting to create user:", { email, first_name, last_name, user_id });
    const { data, error } = await supabase
      .from("User")
      .insert([
        {
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
          remaining_lead_finds: 1,
          remaining_reply_generations: 1,
        },
      ])
      .select();

    console.log("Supabase response - data:", data);
    console.log("Supabase response - error:", error);

    if (error?.code) {
      console.error("Error creating user:", error);
      return error;
    }
    return data;
  } catch (error: any) {
    console.error("Unexpected error in userCreate:", error);
    throw new Error(error.message);
  }
};
