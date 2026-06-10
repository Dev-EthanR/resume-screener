export interface AnalyzeResult {
  score: number;
  skills: {
    missing: string[];
    matched: string[];
  };
  improvementBullets: string[];
}
