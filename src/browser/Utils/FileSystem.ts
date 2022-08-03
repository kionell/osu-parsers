const browserFSOperation = function() {
  throw new Error(
    'Filesystem operations are not available in a browser environment',
  );
} as (...args: any[]) => any;

export {
  // fs
  browserFSOperation as existsSync,
  browserFSOperation as readFileSync,
  browserFSOperation as statSync,
  browserFSOperation as mkdirSync,
  browserFSOperation as writeFileSync,

  // path
  browserFSOperation as dirname,
};
