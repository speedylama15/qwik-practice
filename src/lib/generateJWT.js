import * as jose from "jose";

const alg = process.env['JWT_ALG'];
export const secret = new TextEncoder().encode(process.env['JWT_SECRET']);

const generateJWT = async (type, payload) => {
	const time = type === "accessToken" ? "10h" : "168h";

	const jwt = await new jose.SignJWT(payload)
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime(time)
		.sign(secret);

	return jwt;
};

export default generateJWT;