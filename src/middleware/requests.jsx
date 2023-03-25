import { API } from './config';

export const CORSHeaders = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET',
};

export function post(path: string, signal: any, data: any) {
	return bodyRequest('POST', path, signal, data);
}

export function put(path: string, data: any) {
	return bodyRequest('PUT', path, data);
}

function bodyRequest(method: string, path: string, signal, data: any) {
	if (signal) {
		return fetch(API + path, {
			method: method,
			headers: CORSHeaders,
			body: JSON.stringify(data),
			signal: signal
		});
	}
	return fetch(API + path, {
		method: method,
		headers: CORSHeaders,
		body: JSON.stringify(data)
	});
}

export function get(path: string) {
	return fetch(API + path, {
		method: 'GET',
		headers: CORSHeaders
	});
}