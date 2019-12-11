import * as mongoose from 'mongoose';

import { fromCursor, toCursor } from './utils';

interface PaginationArgs {
	first: number;
	last: number;
	before: string;
	after: string;
}

interface PaginatedData<DocType = any> {
	data: DocType[];
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

type PaginatedQuery<DocType = any> = (
	initialQuery: mongoose.Query<DocType>,
	paginationArgs: PaginationArgs
) => Promise<PaginatedData<DocType>>;

export const connectionResolver = {
	edges(parent: PaginatedData) {
		return parent.data;
	},
	pageInfo(parent: PaginatedData) {
		return {
			hasNextPage: parent.hasNextPage,
			hasPreviousPage: parent.hasPreviousPage,
			...(parent.data.length > 0
				? {
						startCursor: toCursor(parent.data[0].id),
						endCursor: toCursor(parent.data[parent.data.length - 1].id)
				  }
				: {})
		};
	}
};

export const edgeResolver = {
	cursor(parent: mongoose.Document) {
		return toCursor(parent.id);
	},
	node(parent) {
		return parent;
	}
};

export const paginatedQuery: PaginatedQuery = async (initialQuery, { first, last, before, after }) => {
	const query = {
		...(before !== undefined ? { $lt: mongoose.Types.ObjectId(fromCursor(before)) } : {}),
		...(after !== undefined ? { $gt: mongoose.Types.ObjectId(fromCursor(after)) } : {})
	};
	const getQuery = (): mongoose.DocumentQuery<any[], any> =>
		initialQuery.find({ ...(Object.keys(query).length === 0 ? {} : { _id: query }) });

	const count = await getQuery().countDocuments();
	const dataQuery = getQuery();

	let hasNextPage = false;
	let hasPreviousPage = false;

	if (first !== undefined && first < count) {
		dataQuery.limit(first);
		hasNextPage = true;
	}

	if (last !== undefined && last < count) {
		dataQuery.skip(count - last);
		hasPreviousPage = true;
		if (hasNextPage) {
			hasNextPage = false;
		}
	}

	const data = await dataQuery;
	return { data, hasPreviousPage, hasNextPage };
};
