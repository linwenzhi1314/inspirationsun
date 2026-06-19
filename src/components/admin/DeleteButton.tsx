'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DeleteButtonProps {
	articleId: number;
	articleTitle: string;
}

export function DeleteButton({ articleId, articleTitle }: DeleteButtonProps) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);

	const handleDelete = async () => {
		if (!confirm(`确定要删除文章"${articleTitle}"吗？此操作不可撤销。`)) {
			return;
		}

		setDeleting(true);

		try {
			const res = await fetch(`/api/admin/articles/${articleId}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				throw new Error('删除失败');
			}

			alert('文章已删除');
			router.refresh();
		} catch (error) {
			console.error('删除文章错误:', error);
			alert('删除失败，请重试');
		} finally {
			setDeleting(false);
		}
	};

	return (
		<button
			onClick={handleDelete}
			disabled={deleting}
			className="text-red-600 hover:text-red-900 disabled:text-gray-400"
		>
			{deleting ? '删除中...' : '删除'}
		</button>
	);
}
