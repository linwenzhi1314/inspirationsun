import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const client = getSupabaseClient();

		const { data, error } = await client
			.from('articles')
			.select('*')
			.eq('slug', slug)
			.eq('published', true)
			.maybeSingle();

		if (error) {
			throw new Error(`获取文章失败: ${error.message}`);
		}

		if (!data) {
			return NextResponse.json(
				{ error: '文章不存在' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ article: data });
	} catch (error) {
		console.error('获取文章详情错误:', error);
		return NextResponse.json(
			{ error: '获取文章详情失败' },
			{ status: 500 }
		);
	}
}
