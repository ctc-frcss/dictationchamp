import { apiRequest } from "./queryClient";

export async function parseFile(file: File): Promise<string[]> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/parse-file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to parse file');
    }

    const data = await response.json();
    return data.words;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while parsing the file');
  }
}
