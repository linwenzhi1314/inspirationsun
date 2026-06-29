import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.COZE_SUPABASE_URL!;
const supabaseAnonKey = process.env.COZE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/pages/[slug] - 获取页面内容（公开）
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const key = `page_${slug}`;

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      return NextResponse.json({ content: null }, { status: 200 });
    }

    return NextResponse.json(JSON.parse(data.value));
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: '获取页面内容失败' },
      { status: 500 }
    );
  }
}
