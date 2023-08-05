import { z } from "zod";

export const SessionInfo = z.object({
	user_id: z.coerce.bigint(),
	username: z.string(),
	primary_wallet_id: z.coerce.bigint(),
	wallet_id: z.coerce.bigint(),
	wallet_user_id: z.coerce.bigint(),
	wallet_address: z.string()
});

export const Asset = z.object({
	asset: z.object({
		id: z.coerce.bigint(),
		name: z.string(),
		value: z.coerce.number()
	}),
	quantity: z.coerce.number()
});

export const Assets = z.array(Asset);

export const Transaction = z.object({
	id: z.coerce.bigint(),
	created_at: z.coerce.date(),
	memo: z
		.string()
		.optional()
		.transform((s) => (s === "" ? null : s)),
	receiving_username: z
		.string()
		.optional()
		.transform((s) => (s === "" ? null : s)),
	receiving_wallet_address: z.string(),
	receiving_wallet_id: z.coerce.bigint(),
	sending_username: z
		.string()
		.optional()
		.transform((s) => (s === "" ? null : s)),
	sending_wallet_address: z.string(),
	sending_wallet_id: z.coerce.bigint(),
	assets: Assets
});

export const Transactions = z.array(Transaction);

export const Wallet = z.object({
	id: z.coerce.bigint(),
	address: z.string(),
	user_id: z.coerce.bigint(),
	webhook: z
		.string()
		.optional()
		.transform((s) => (s === "" ? null : s))
});

export const Wallets = z.array(Wallet);
