export function deepMerge(target: any, source: any): any {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export function validateEmail(email: string): boolean {
  const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

export function parseUserInput(input: string): Record<string, any> {
  const result: any = {};
  input.split("&").forEach(pair => {
    const [key, value] = pair.split("=");
    const keys = key.split(".");
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = decodeURIComponent(value);
  });
  return result;
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<script>/gi, "").replace(/<\/script>/gi, "");
}
