import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { type ArticleCategory, isValidCategory } from '@/lib/constants';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ category: string }> }
) {
	try {
		const { category } = await params;

		// 验证分类是否有效
		if (!isValidCategory(category as ArticleCategory)) {
			return NextResponse.json(
				{ error: '无效的文章分类' },
				{ status: 400 }
			);
		}

		const client = getSupabaseClient();

		const { data, error } = await client
			.from('articles')
			.select('*')
			.eq('category', category)
			.eq('published', true)
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`获取文章失败: ${error.message}`);
		}

		return NextResponse.json({ articles: data || [] });
	} catch (error) {
		console.error('获取分类文章错误:', error);
		return NextResponse.json(
			{ error: '获取文章失败' },
			{ status: 500 }
		);
	}
}
