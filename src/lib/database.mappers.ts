import type { PostMeta, Post, Category, Comment, Tag } from '$lib/types';
import { objectsToHierarchy } from '$lib/util';

export const dataToPostMeta = (data: any): PostMeta => {
	return {
		title: data.title,
		slug: data.slug,
		date: new Date(data.rawDate),
		authors: data.additionalFields.authorgroup
			? data.additionalFields.authorgroup.replace(' ', '').split(',')
			: [ data.author.node.name ],
		featuredImage: data.additionalFields.featuredimage,
		commentCount: data.commentCount
	};
};

export const dataToPost = (data: any): Post | null => {
	if (!data) return null;
	const post: Post = {
		title: data.title,
		slug: data.slug,
		date: new Date(data.rawDate),
		authors: data.additionalFields.authorgroup
			? data.additionalFields.authorgroup.replace(' ', '').split(',')
			: [ data.author.node.name ],
		featuredImage: data.additionalFields.featuredimage,
		commentCount: data.commentCount,
		initialLetter: data.additionalFields.initialletter,
		scripts: data.additionalFields.scripts,
		styles: data.additionalFields.styles,
		theme: data.additionalFields.theme,
		content: data.content,
		categories: data.categories.nodes.map((category: any) => {
			return {
				slug: category.slug,
				name: category.name
			};
		}),
		tags: data.tags.nodes.map((tag: any) => {
			return {
				slug: tag.slug,
				name: tag.name
			};
		}),
		comments: data.comments.nodes.map((comment: any) => {
			return {
				date: new Date(comment.date),
				author: comment.author.node.name,
				content: comment.content,
				children: [],
				_id: comment.id,
				_parentId: comment.parentId
			};
		})
	};
	post.comments = objectsToHierarchy(post.comments) as Comment[];
	return post;
};

export const dataToCategories = (data: any): Category[] => {
	let categories = data.map((category: any) => {
		return {
			slug: category.slug,
			name: category.name,
			children: [],
			_id: category.id,
			_parentId: category.parentId
		};
	});
	categories = objectsToHierarchy(categories) as Category[];
	return categories;
};

export const dataToTags = (data: any): Tag[] => {
	return data.map((tag: any) => {
		return {
			slug: tag.slug,
			name: tag.name
		};
	});
};
