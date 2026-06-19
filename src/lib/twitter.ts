/**
 * Twitter/X API 集成
 *
 * 需要在环境变量中配置:
 * - TWITTER_CLIENT_ID: Twitter App 的 Client ID
 * - TWITTER_CLIENT_SECRET: Twitter App 的 Client Secret
 */

const TWITTER_API_BASE = 'https://api.twitter.com/2';

interface TwitterToken {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

/**
 * 获取 Twitter OAuth 授权 URL
 */
export function getTwitterAuthUrl(state: string): string {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const redirectUri = `${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/api/twitter/callback`;

  if (!clientId) {
    throw new Error('Twitter Client ID 未配置');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'tweet.write users.read tweet.read offline.access',
    state: state,
    code_challenge: 'challenge',
    code_challenge_method: 'plain',
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

/**
 * 使用授权码交换访问令牌
 */
export async function exchangeCodeForToken(code: string): Promise<TwitterToken> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  const redirectUri = `${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/api/twitter/callback`;

  if (!clientId || !clientSecret) {
    throw new Error('Twitter API 凭证未配置');
  }

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: 'challenge',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`获取访问令牌失败: ${error}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

/**
 * 发布推文
 */
export async function postTweet(accessToken: string, text: string): Promise<{ id: string; text: string }> {
  const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`发布推文失败: ${JSON.stringify(error)}`);
  }

  const data = await response.json();

  return {
    id: data.data.id,
    text: data.data.text,
  };
}

/**
 * 刷新访问令牌
 */
export async function refreshAccessToken(refreshToken: string): Promise<TwitterToken> {
  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Twitter API 凭证未配置');
  }

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`刷新访问令牌失败: ${error}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}
