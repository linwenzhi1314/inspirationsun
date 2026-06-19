import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const client = getSupabaseClient();

		const { data, error } = await client
			.from('articles')
			.select('*')
			.eq('id', parseInt(id))
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
		console.error('获取文章错误:', error);
		return NextResponse.json(
			{ error: '获取文章失败' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { title, slug, content, excerpt, cover_image, category, published } = body;

		if (!title || !slug || !content) {
			return NextResponse.json(
				{ error: '标题、链接和内容不能为空' },
				{ status: 400 }
			);
		}

		const client = getSupabaseClient();

		// 检查 slug 是否已被其他文章使用
		const { data: existingArticle } = await client
			.from('articles')
			.select('id')
			.eq('slug', slug)
			.neq('id', parseInt(id))
			.maybeSingle();

		if (existingArticle) {
			return NextResponse.json(
				{ error: '该链接别名已被其他文章使用' },
				{ status: 400 }
			);
		}

		// 更新文章
		const { data, error } = await client
			.from('articles')
			.update({
				title,
				slug,
				content,
				excerpt,
				cover_image,
				category,
				published,
				updated_at: new Date().toISOString(),
			})
			.eq('id', parseInt(id))
			.select()
			.single();

		if (error) {
			throw new Error(`更新文章失败: ${error.message}`);
		}

		return NextResponse.json({ article: data });
	} catch (error) {
		console.error('更新文章错误:', error);
		return NextResponse.json(
			{ error: '更新文章失败' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const client = getSupabaseClient();

		const { error } = await client
			.from('articles')
			.delete()
			.eq('id', parseInt(id));

		if (error) {
			throw new Error(`删除文章失败: ${error.message}`);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('删除文章错误:', error);
		return NextResponse.json(
			{ error: '删除文章失败' },
			{ status: 500 }
		);
	}
}
