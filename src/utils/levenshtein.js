export function levenshteinDistance(a, b) {
    const matrix = Array(b.length + 1)
        .fill(null)
        .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }

    return matrix[b.length][a.length];
}

export function normalizeString(str) {
    return (str || '').toLowerCase().trim().replace(/[^\w\s]/gi, '');
}

export function getMatchScore(query, text) {
    const normalizedQuery = normalizeString(query);
    const normalizedText = normalizeString(text);

    if (!normalizedText || !normalizedQuery) return 0;

    if (normalizedText === normalizedQuery) return 100;
    if (normalizedText.includes(normalizedQuery)) return 60;
    if (normalizedText.startsWith(normalizedQuery)) return 50;

    const words = normalizedText.split(/\s+/);
    if (words.some((word) => word.startsWith(normalizedQuery))) return 40;

    const distances = words.map((word) => levenshteinDistance(normalizedQuery, word));
    const minDistance = Math.min(...distances);
    if (minDistance <= 1) return 30;
    if (minDistance === 2) return 20;

    return 0;
}