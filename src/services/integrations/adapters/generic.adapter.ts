export class GenericAPIAdapter {
  endpoint: string;
  apiKey?: string;
  headers?: Record<string, string>;

  constructor(endpoint: string, apiKey?: string, headers?: Record<string, string>) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.headers = headers;
  }

  async sendData(data: any) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.headers || {}),
          ...(this.apiKey ? { "Authorization": `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("GenericAPIAdapter sendData error:", error);
      return null;
    }
  }
}
