// import reshaper from 'arabic-persian-reshaper';
// import Bidi from 'bidi-js';

// const { ArabicShaper } = (reshaper as any);

// export const prepareArabicText = (text: string): string => {
//   if (!text) return '';

//   const reshaped = ArabicShaper.convertArabic(text);

//   const bidi = new Bidi();
//   const result = bidi.getEmbeddingLevels(reshaped);

//   // result.levels is an array of levels per character
//   // result.runs is an array of {level, start, length}

//   // We can reorder by runs (typically reverse runs with odd level)
//   const chars = reshaped.split('');
//   let reordered = '';

//   // Reorder runs according to the bidi algorithm
//   // For simplicity, runs with odd levels should be reversed
//   for (const run of result.runs) {
//     const runChars = chars.slice(run.start, run.start + run.length);
//     if (run.level % 2 === 1) {
//       runChars.reverse();
//     }
//     reordered += runChars.join('');
//   }

//   return reordered;
// };
