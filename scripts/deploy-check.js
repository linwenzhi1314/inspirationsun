#!/usr/bin/env node

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = 'prj_MJiITjzHKY3eBDvjtoNJygzl0wsq';
const TEAM_ID = 'team_MhaqhkrHO9Taybu8k8NRVC6X';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAPI(endpoint) {
  const response = await fetch(`https://api.vercel.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

async function getLatestDeployment() {
  const data = await fetchAPI(`/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=1`);
  return data.deployments?.[0];
}

async function getDeploymentEvents(deploymentId) {
  const data = await fetchAPI(`/v2/deployments/${deploymentId}/events?teamId=${TEAM_ID}`);
  return data;
}

async function waitForBuild(maxWait = 180) {
  console.log('⏳ 等待 Vercel 构建...');
  
  const startTime = Date.now();
  while ((Date.now() - startTime) < maxWait * 1000) {
    const deployment = await getLatestDeployment();
    
    if (!deployment) {
      console.log('⚠️  无法获取部署信息');
      await sleep(5000);
      continue;
    }
    
    const { state, readyState, uid } = deployment;
    console.log(`   状态: ${state || readyState} (${uid.substring(0, 8)}...)`);
    
    if (state === 'READY' || readyState === 'READY') {
      return { success: true, deployment };
    }
    
    if (state === 'ERROR' || readyState === 'ERROR') {
      return { success: false, deployment };
    }
    
    await sleep(10000);
  }
  
  return { success: false, error: '构建超时' };
}

async function getErrorLogs(deploymentId) {
  console.log('📋 获取错误日志...');
  
  const events = await getDeploymentEvents(deploymentId);
  const errorEvents = events.filter(e => 
    e.type === 'error' || 
    (e.text && e.text.toLowerCase().includes('error'))
  );
  
  if (errorEvents.length > 0) {
    console.log('\n❌ 发现以下错误:');
    errorEvents.forEach(e => {
      const text = e.text || e.payload?.text || JSON.stringify(e.payload);
      console.log(`   - ${text?.substring(0, 200)}`);
    });
    return errorEvents;
  }
  
  // 如果没有找到明确的错误事件，获取最后几个事件
  console.log('\n📄 最后构建事件:');
  const lastEvents = events.slice(-5);
  lastEvents.forEach(e => {
    const text = e.text || e.payload?.text || '';
    if (text) console.log(`   - ${text.substring(0, 150)}`);
  });
  
  return lastEvents;
}

async function main() {
  console.log('🚀 开始部署验证流程\n');
  
  // 1. 等待构建完成
  const result = await waitForBuild();
  
  if (result.success) {
    console.log('\n✅ 部署成功！');
    console.log(`   URL: https://${result.deployment.url}`);
    console.log(`   生产域名: https://inspirationsun.vercel.app`);
    
    // 验证功能
    console.log('\n🔍 尝试验证网站功能...');
    console.log('   由于沙箱网络限制，请手动测试以下功能:');
    console.log('   1. 访问 https://inspirationsun.vercel.app');
    console.log('   2. 访问 https://inspirationsun.vercel.app/admin');
    console.log('   3. 使用默认密码 admin123 登录');
    console.log('   4. 测试修改密码功能');
    
    process.exit(0);
  } else {
    console.log('\n❌ 部署失败！');
    
    if (result.deployment) {
      await getErrorLogs(result.deployment.uid);
    }
    
    process.exit(1);
  }
}

main();
