/* @__PURE__ */ export function toHex(ab: ArrayBuffer): string {
	let hashArray = Array.from(new Uint8Array(ab));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* @__PURE__ */ async function getPasswordV1(
	fileId: string,
	username: string,
	password: string
): Promise<string> {
	const PASSWORD_LENGTH = 5;

	let encoder = new TextEncoder();
	let data = encoder.encode(username + password + fileId);
	let hash = await window.crypto.subtle.digest('SHA-1', data);
	return toHex(hash).substring(0, PASSWORD_LENGTH);
}

/**
 * Get score filename compatible with the 2013 version of the software
 */
/* @__PURE__ */ export async function getFileNameV1(
	fileId: string,
	username: string,
	password: string
): Promise<string> {
	return `${fileId}/u${username}_${await getPasswordV1(fileId, username, password)}.json`;
}

/* @__PURE__ */ export async function pbkdf2(
	key: string,
	salt: string,
	iterations = 10_000,
	hash = 'SHA-256'
) {
	let encoder = new TextEncoder();
	let importedKey = await window.crypto.subtle.importKey(
		'raw',
		encoder.encode(key),
		'PBKDF2',
		false,
		['deriveBits']
	);
	let bits = await window.crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: encoder.encode(salt),
			iterations,
			hash,
		},
		importedKey,
		256
	);
	return toHex(bits);
}

/* @__PURE__ */ async function getPasswordV2(
	fileId: string,
	username: string,
	password: string
): Promise<string> {
	const PASSWORD_LENGTH = 8;

	let out = await pbkdf2(password, `${fileId}_${username}`);
	return out.substring(0, PASSWORD_LENGTH);
}

/**
 * Get a modern cryptographic score filename
 */
/* @__PURE__ */ export async function getFileNameV2(
	fileId: string,
	username: string,
	password: string
): Promise<string> {
	return `${fileId}/u${username}_${await getPasswordV2(fileId, username, password)}.json`;
}

export function isActivateKeyboardEvent(e: Event | KeyboardEvent): boolean {
	return 'key' in e && ['Enter', ' ', 'Spacebar'].includes(e.key);
}
