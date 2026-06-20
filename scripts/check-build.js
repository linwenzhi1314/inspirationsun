#!/usr/bin/env node

/**
 * Vercel 构建状态检查工具
 * 使用方法：
 * 1. 确保已安装 Vercel CLI: pnpm add -g vercel
 * 2. 运行: node scripts/check-build.js
 * 
 * 或者使用 Vercel API Token：
 * 1. 创建 .env.local 文件
 * 2. 添加 VERCEL_TOKEN=your_token（从 https://vercel.com/account/tokens 获取）
 * 3. 添加 VERCEL_PROJECT_ID=your_project_id（从项目设置获取）
 */

const { execSync } = require('child_process');
const https = require('https');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 Vercel CLI 是否安装
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// 使用 Vercel API 获取部署状态
async function getDeploymentStatus(token, projectId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: `/v13/deployments?projectId=${projectId}&limit=1`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 获取构建日志
async function getBuildLogs(token, deploymentId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: `/v2/deployments/${deploymentId}/events`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const events = data.split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
          resolve(events);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 主函数
async function main() {
  log('\n🔍 正在检查 Vercel 构建状态...\n', 'cyan');

  // 方法 1: 尝试使用 Vercel CLI
  if (checkVercelCLI()) {
    log('✅ 检测到 Vercel CLI', 'green');
    try {
      log('\n正在获取最新部署状态...', 'blue');
      const output = execSync('vercel list --yes 2>&1', { 
        encoding: 'utf8',
        cwd: process.cwd()
      });
      console.log(output);

      log('\n提示：要查看详细日志，请运行:', 'yellow');
      log('  vercel logs [deployment-url]', 'cyan');
      
    } catch (error) {
      log('⚠️  使用 Vercel CLI 获取状态失败', 'yellow');
      log(`错误: ${error.message}`, 'red');
    }
  } else {
    log('⚠️  未检测到 Vercel CLI', 'yellow');
    log('提示: 可以运行 "pnpm add -g vercel" 安装', 'cyan');
  }

  // 方法 2: 尝试使用 Vercel API
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    log('\n📝 检测到 .env.local 文件，尝试使用 API...', 'blue');
    
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const tokenMatch = envContent.match(/VERCEL_TOKEN=(.+)/);
      const projectIdMatch = envContent.match(/VERCEL_PROJECT_ID=(.+)/);
      
      if (tokenMatch && projectIdMatch) {
        const token = tokenMatch[1].trim();
        const projectId = projectIdMatch[1].trim();
        
        log('正在通过 API 获取部署状态...', 'blue');
        const result = await getDeploymentStatus(token, projectId);
        
        if (result.deployments && result.deployments.length > 0) {
          const deployment = result.deployments[0];
          
          log('\n📊 最新部署信息:', 'cyan');
          log(`  状态: ${deployment.readyState}`, 
            deployment.readyState === 'READY' ? 'green' : 
            deployment.readyState === 'ERROR' ? 'red' : 'yellow');
          log(`  URL: ${deployment.url}`, 'cyan');
          log(`  创建时间: ${new Date(deployment.created).toLocaleString()}`, 'cyan');
          log(`  提交: ${deployment.meta?.githubCommitMessage || 'N/A'}`, 'cyan');
          
          // 如果构建失败，获取详细日志
          if (deployment.readyState === 'ERROR') {
            log('\n❌ 构建失败！正在获取错误日志...\n', 'red');
            
            try {
              const events = await getBuildLogs(token, deployment.uid);
              
              log('📋 错误日志:', 'red');
              events.forEach(event => {
                if (event.type === 'stderr' || event.type === 'stdout') {
                  const text = event.text || event.payload || '';
                  if (text.toLowerCase().includes('error') || 
                      text.toLowerCase().includes('failed')) {
                    log(text, 'red');
                  }
                }
              });
            } catch (logError) {
              log('⚠️  无法获取详细日志', 'yellow');
              log(`错误: ${logError.message}`, 'red');
            }
          }
        }
      } else {
        log('⚠️  .env.local 文件中缺少 VERCEL_TOKEN 或 VERCEL_PROJECT_ID', 'yellow');
        log('\n请添加以下配置:', 'cyan');
        log('  VERCEL_TOKEN=your_token_here', 'cyan');
        log('  VERCEL_PROJECT_ID=your_project_id_here', 'cyan');
        log('\n获取方式:', 'yellow');
        log('  Token: https://vercel.com/account/tokens', 'cyan');
        log('  Project ID: Vercel Dashboard -> Settings -> General', 'cyan');
      }
    } catch (error) {
      log(`⚠️  API 调用失败: ${error.message}`, 'yellow');
    }
  } else {
    log('\n💡 提示：可以创建 .env.local 文件以使用 API 自动检查', 'yellow');
    log('  VERCEL_TOKEN=your_token', 'cyan');
    log('  VERCEL_PROJECT_ID=your_project_id', 'cyan');
  }

  log('\n✨ 检查完成\n', 'green');
}

main().catch(error => {
  log(`\n❌ 错误: ${error.message}`, 'red');
  process.exit(1);
});
