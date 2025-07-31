declare function request<T = unknown>(url: string, type: string, withCredentials: boolean, headers: Record<string, string>): Promise<T>;
export default request;
