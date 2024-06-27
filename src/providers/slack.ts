import {
	AuthorizationCodeAuthorizationURL,
	AuthorizationCodeTokenRequestContext
} from "@oslojs/oauth2";
import { sendTokenRequest } from "../request.js";

import type { OAuth2Tokens } from "../oauth2.js";

const authorizeEndpoint = "https://slack.com/openid/connect/authorize";
const tokenEndpoint = "https://slack.com/api/openid.connect.token";

export class Slack {
	private clientId: string;
	private clientSecret: string;
	private redirectURI: string;

	constructor(clientId: string, clientSecret: string, redirectURI: string) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectURI = redirectURI;
	}

	public createAuthorizationURL(state: string): AuthorizationCodeAuthorizationURL {
		const url = new AuthorizationCodeAuthorizationURL(authorizeEndpoint, this.clientId);
		url.setRedirectURI(this.redirectURI);
		url.setState(state);
		return url;
	}

	public async validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		const context = new AuthorizationCodeTokenRequestContext(code);
		context.authenticateWithRequestBody(this.clientId, this.clientSecret);
		context.setRedirectURI(this.redirectURI);
		const tokens = await sendTokenRequest(tokenEndpoint, context);
		return tokens;
	}
}
