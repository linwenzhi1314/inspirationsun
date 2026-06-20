import { createClient } from '@supabase/supabase-js';

// Schema cache 刷新状态
let schemaCacheRefreshed = false;

// 创建 Supabase admin 客户端
function getSupabaseAdmin() {
  const supabaseUrl = process.env.COZE_SUPABASE_URL;
  const serviceRoleKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase 配置缺失');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// 刷新 PostgREST schema cache
async function refreshSchemaCache(): Promise<boolean> {
  if (schemaCacheRefreshed) {
    return true;
  }
  
  try {
    console.log('正在刷新 PostgREST schema cache...');
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('reload_schema_cache');
    
    if (error) {
      console.log('Schema cache 刷新失败:', error.message);
      return false;
    }
    
    console.log('Schema cache 刷新成功:', data);
    schemaCacheRefreshed = true;
    return true;
  } catch (error) {
    console.error('Schema cache 刷新异常:', error);
    return false;
  }
}

// 尝试使用数据库直连获取密码
async function getPasswordFromDirectDb(): Promise<{ success: boolean; password: string }> {
  try {
    const { Pool } = await import('pg');
    const connectionString = process.env.PGDATABASE_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return { success: false, password: 'admin123' };
    }
    
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 5000,
    });
    
    const result = await pool.query("SELECT value FROM settings WHERE key = 'admin_password'");
    await pool.end();
    
    return { 
      success: true, 
      password: result.rows[0]?.value || 'admin123'
    };
  } catch (error) {
    console.log('Direct DB connection failed:', error);
    return { success: false, password: 'admin123' };
  }
}

// 使用 Supabase REST API 获取密码
async function getPasswordFromRestApi(): Promise<string> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .maybeSingle();
    
    if (error) {
      // 检测是否是 schema cache 错误
      const errorMsg = error.message || '';
      if (errorMsg.includes('schema cache') || errorMsg.includes('Could not find')) {
        console.log('检测到 schema cache 错误，尝试刷新...');
        await refreshSchemaCache();
        // 刷新后重试一次
        const retryResult = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'admin_password')
          .maybeSingle();
        
        if (!retryResult.error && retryResult.data) {
          return retryResult.data.value || 'admin123';
        }
      }
      console.log('REST API error:', error);
      return 'admin123';
    }
    
    return data?.value || 'admin123';
  } catch (error) {
    console.error('Error fetching password via REST API:', error);
    return 'admin123';
  }
}

// 使用数据库直连更新密码
async function setPasswordViaDirectDb(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { Pool } = await import('pg');
    const connectionString = process.env.PGDATABASE_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return { success: false, error: 'DATABASE_URL not configured' };
    }
    
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 5000,
    });
    
    await pool.query(
      `INSERT INTO settings (key, value, updated_at) 
       VALUES ('admin_password', $1, NOW()) 
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [newPassword]
    );
    
    await pool.end();
    return { success: true };
  } catch (error) {
    console.error('Direct DB update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '数据库连接失败' 
    };
  }
}

// 使用 Supabase REST API 更新密码
async function setPasswordViaRestApi(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    
    // 先尝试更新
    const { error: updateError } = await supabase
      .from('settings')
      .update({ value: newPassword, updated_at: new Date().toISOString() })
      .eq('key', 'admin_password');
    
    if (!updateError) {
      return { success: true };
    }
    
    // 检测是否是 schema cache 错误
    const errorMsg = updateError.message || '';
    if (errorMsg.includes('schema cache') || errorMsg.includes('Could not find')) {
      console.log('检测到 schema cache 错误，尝试刷新...');
      await refreshSchemaCache();
      
      // 刷新后重试更新
      const { error: retryUpdateError } = await supabase
        .from('settings')
        .update({ value: newPassword, updated_at: new Date().toISOString() })
        .eq('key', 'admin_password');
      
      if (!retryUpdateError) {
        return { success: true };
      }
      
      // 如果更新失败，尝试插入
      const { error: retryInsertError } = await supabase
        .from('settings')
        .insert({ key: 'admin_password', value: newPassword, updated_at: new Date().toISOString() });
      
      if (!retryInsertError) {
        return { success: true };
      }
      
      return { 
        success: false, 
        error: `数据库操作失败: ${retryInsertError.message}` 
      };
    }
    
    console.log('Update failed, trying insert:', updateError);
    
    // 如果更新失败（可能没有记录），尝试插入
    const { error: insertError } = await supabase
      .from('settings')
      .insert({ key: 'admin_password', value: newPassword, updated_at: new Date().toISOString() });
    
    if (!insertError) {
      return { success: true };
    }
    
    console.log('Insert failed:', insertError);
    
    // 如果也失败，返回错误
    return { 
      success: false, 
      error: `数据库操作失败: ${insertError.message}` 
    };
  } catch (error) {
    console.error('Error setting password via REST API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '未知错误' 
    };
  }
}

// 获取管理员密码（自动选择最佳方式）
export async function getAdminPassword(): Promise<string> {
  // 先尝试数据库直连
  const dbResult = await getPasswordFromDirectDb();
  if (dbResult.success) {
    return dbResult.password;
  }
  
  // 回退到 REST API
  return getPasswordFromRestApi();
}

// 设置管理员密码（自动选择最佳方式）
export async function setAdminPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  // 先尝试数据库直连
  const dbResult = await setPasswordViaDirectDb(newPassword);
  if (dbResult.success) {
    return { success: true };
  }
  
  console.log('Direct DB failed, trying REST API...');
  
  // 回退到 REST API
  return setPasswordViaRestApi(newPassword);
}
