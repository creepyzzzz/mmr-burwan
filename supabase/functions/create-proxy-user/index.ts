import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Create admin client with service role key for user creation
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
        },
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    const { email, password, adminId, adminName } = body;

    // Validate required fields
    if (!email || !password || !adminId || !adminName) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: email, password, adminId, adminName",
          received: { email: !!email, password: !!password, adminId: !!adminId, adminName: !!adminName }
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters long" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    const userEmail = email;

    // Verify environment variables are set
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing environment variables:", {
        hasUrl: !!SUPABASE_URL,
        hasKey: !!SUPABASE_SERVICE_ROLE_KEY,
      });
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    // Check if user with this email already exists
    console.log("Checking if user exists:", { email: userEmail });
    try {
      const { data: existingUsers, error: checkError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!checkError && existingUsers?.users) {
        const userExists = existingUsers.users.some(user => 
          user.email?.toLowerCase() === userEmail.toLowerCase()
        );
        
        if (userExists) {
          console.log("User already exists with email:", userEmail);
          return new Response(
            JSON.stringify({ 
              error: "A user with this email address already exists",
              code: "USER_ALREADY_EXISTS"
            }),
            {
              status: 409, // Conflict status code
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
              },
            }
          );
        }
      }
    } catch (checkErr) {
      console.error("Error checking existing users:", checkErr);
      // Continue with creation attempt - the createUser will fail if duplicate
    }

    // Create user with auto-verification
    console.log("Attempting to create user:", { email: userEmail, adminId, adminName });
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      password: password,
      email_confirm: true, // Auto-verify email
      user_metadata: {
        role: "client",
        is_proxy_user: true,
        created_by_admin_id: adminId,
        created_by_admin_name: adminName,
        offline_applicant: true,
      },
    });

    if (userError) {
      console.error("Error creating user:", userError);
      
      // Check if error is due to duplicate email
      if (userError.message?.includes("already registered") || 
          userError.message?.includes("already exists") ||
          userError.message?.includes("User already registered") ||
          userError.message?.includes("email address is already")) {
        return new Response(
          JSON.stringify({ 
            error: "A user with this email address already exists",
            code: "USER_ALREADY_EXISTS"
          }),
          {
            status: 409, // Conflict status code
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
            },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to create user: ${userError.message}`,
          details: userError
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
          },
        }
      );
    }

    if (!userData || !userData.user) {
      console.error("No user data returned:", userData);
      return new Response(
        JSON.stringify({ error: "User creation failed - no user data returned" }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        userId: userData.user.id,
        email: userEmail,
        password: password, // Return the provided password for storage
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
        },
      }
    );
  } catch (error: any) {
    console.error("Error in create-proxy-user function:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      cause: error.cause,
    });
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        type: error.name || "UnknownError",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
        },
      }
    );
  }
});

