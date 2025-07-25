import { supabase } from '@/shared/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, lat, lng, address } = body;

  if (!userId || !lat || !lng || !address) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      latitude: lat,
      longitude: lng,
      address,
    })
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
