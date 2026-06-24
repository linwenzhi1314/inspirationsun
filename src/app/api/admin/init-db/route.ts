import { NextResponse } from 'next/server';

// Supabase Management API 自动创建表
// 需要用户提供 SUPABASE_PAT (Personal Access Token)

const CREATE_TABLES_SQL = `
-- 创建 articles 表
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'signal_capture',
  published BOOLEAN DEFAULT false,
  twitter_post_id TEXT,
  twitter_posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 创建 settings 表
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 插入管理员密码设置
INSERT INTO settings (key, value, updated_at) 
VALUES ('admin_password', 'lwz131452@', NOW()) 
ON CONFLICT (key) DO NOTHING;

-- 授权
GRANT ALL ON articles TO anon;
GRANT ALL ON articles TO authenticated;
GRANT ALL ON articles TO service_role;
GRANT ALL ON settings TO anon;
GRANT ALL ON settings TO authenticated;
GRANT ALL ON settings TO service_role;

-- 刷新 schema cache
NOTIFY pgrst, 'reload schema';
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pat } = body;

    if (!pat) {
      return NextResponse.json(
        { 
          error: '需要提供 Supabase Personal Access Token (PAT)',
          hint: '请在 https://supabase.com/dashboard/account/tokens 创建一个 PAT'
        },
        { status: 400 }
      );
    }

    // 从环境变量获取项目信息
    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Supabase URL 未配置' },
        { status: 500 }
      );
    }

    // 提取项目 ref (如 mfdqhxkkthnbxoxiimiq)
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

    // 使用 Management API 执行 SQL
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CREATE_TABLES_SQL }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Management API 错误:', errorText);
      
      // 如果 PAT 权限不足，尝试使用 service_role key 通过数据库直接执行
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { 
            error: 'PAT 权限不足或无效',
            hint: '请确保 PAT 有足够的权限，或手动在 Dashboard SQL Editor 中执行创建表语句',
            sql: CREATE_TABLES_SQL,
            dashboardUrl: `https://supabase.com/dashboard/project/${projectRef}/sql/new`
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: `创建表失败: ${errorText}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: '数据库表已成功创建',
      tables: ['articles', 'settings'],
      result
    });

  } catch (error) {
    console.error('初始化数据库错误:', error);
    return NextResponse.json(
      { error: `初始化失败: ${error instanceof Error ? error.message : '未知错误'}` },
      { status: 500 }
    );
  }
}

// 检测表是否存在
export async function GET() {
  try {
    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const anonKey = process.env.COZE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        initialized: false,
        error: 'Supabase 环境变量未配置'
      });
    }

    // 尝试访问 articles 表
    const response = await fetch(`${supabaseUrl}/rest/v1/articles?select=id&limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({
        initialized: true,
        message: '数据库表已存在'
      });
    }

    const errorData = await response.json();
    
    // 如果是 schema cache 错误，说明表不存在
    if (errorData.code === 'PGRST205' || errorData.message?.includes('schema cache')) {
      return NextResponse.json({
        initialized: false,
        error: 'articles 表不存在',
        hint: '请调用 POST /api/admin/init-db 并提供 PAT 来自动创建表',
        sql: CREATE_TABLES_SQL
      });
    }

    return NextResponse.json({
      initialized: false,
      error: errorData.message || '未知错误'
    });

  } catch (error) {
    return NextResponse.json({
      initialized: false,
      error: error instanceof Error ? error.message : '检测失败'
    });
  }
}