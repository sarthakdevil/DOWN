import { type NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { form_id } = data;

        if (!form_id) {
            return NextResponse.json({ error: "Missing form_id" }, { status: 400 });
        }
        const { data: form, error } = await supabase
            .from('forms')
            .select('*')
            .eq('id', form_id)
            .single();
        if (error || !form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }
        return NextResponse.json({ form });
}
    catch (error) {
        console.error("Error fetching form:", error);
        return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 });
    }
}