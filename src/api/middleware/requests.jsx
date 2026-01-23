import { API } from '../config';
import { getHeaders } from './utils';


export function post(path: string, data: any, userdata) {
	return bodyRequest('POST', path, undefined, data, getHeaders(userdata));
}

export function put(path: string, data: any, userdata) {
	console.log(getHeaders(userdata));
	return bodyRequest('PUT', path, undefined, data, getHeaders(userdata));
}

export function cancellablePost(path: string, signal: any, data: any, userdata) {
	return bodyRequest('POST', path, signal, data, getHeaders(userdata));
}

function bodyRequest(method: string, path: string, signal, data: any, headers: any) {
	if (signal) {
		return fetch(API + path, {
			method: method,
			headers: headers,
			body: JSON.stringify(data),
			signal: signal
		});
	}
	return fetch(API + path, {
		method: method,
		headers: headers,
		body: JSON.stringify(data)
	});
}

export function get(path: string, userdata) {
	return fetch(API + path, {
		method: 'GET',
		headers: getHeaders(userdata)
	});
}