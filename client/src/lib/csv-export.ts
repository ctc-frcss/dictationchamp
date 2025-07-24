import { GameResult } from "@shared/schema";

export function exportToCsv(results: GameResult[], filename: string) {
  const headers = ['Word', 'User Answer', 'Correct', 'Hints Used'];
  
  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      result.word,
      result.userAnswer,
      result.correct ? 'Yes' : 'No',
      result.hintsUsed ? 'Yes' : 'No'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
