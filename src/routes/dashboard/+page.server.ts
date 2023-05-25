import { PUBLIC_STL_API } from "$env/static/public";
import type { PageServerLoad } from "./$types";
import { parse, parseNumberAndBigInt } from "lossless-json";
import { z } from "zod";

export const load = (async ({ fetch }) => {
	const Assets = z.array(
		z.object({
			asset: z.object({
				id: z.coerce.bigint(),
				name: z.string(),
				value: z.coerce.bigint()
			}),
			quantity: z.coerce.number()
		})
	);

	let assetError: string | undefined;

	let assetResponse = await fetch(`${PUBLIC_STL_API}/wallet/assets`, {
		method: "GET",
		credentials: undefined
	});

	if (assetResponse.status >= 400) {
		assetError = await assetResponse.text();
	}

	const Transactions = z.array(
		z.object({
			id: z.coerce.bigint(),
			sending_wallet_id: z.coerce.bigint(),
			receiving_wallet_id: z.coerce.bigint(),
			created_at: z.string(),
			memo: z.string(),
			assets: Assets
		})
	);

	let txError: string | undefined;

	let txResponse = await fetch(`${PUBLIC_STL_API}/wallet/transactions`, {
		method: "GET",
		credentials: undefined
	});

	if (txResponse.status >= 400) {
		txError = await txResponse.text();
	}

	return {
		assetError,
		assets: assetError
			? undefined
			: Assets.safeParse(parse(await assetResponse.text(), undefined, parseNumberAndBigInt)),
		txError,
		transactions: txError
			? undefined
			: Transactions.safeParse(parse(await txResponse.text(), undefined, parseNumberAndBigInt))
	};
}) satisfies PageServerLoad;
