import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 这个 API 用于刷新 Supabase PostgREST 的 schema cache
// 调用方式: POST /api/admin/refresh-schema

export async function POST() {
  try {
    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const serviceRoleKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase 配置缺失' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 调用 PostgreSQL 函数来刷新 schema cache
    const { data, error } = await supabase.rpc('reload_schema_cache');

    if (error) {
      console.error('刷新 schema cache 失败:', error);
      return NextResponse.json({ 
        error: '刷新失败', 
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: data 
    });

  } catch (error) {
    console.error('刷新 schema cache 异常:', error);
    return NextResponse.json({ 
      error: '刷新异常', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
