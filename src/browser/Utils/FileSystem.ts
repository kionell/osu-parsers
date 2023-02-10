const browserFSOperation = function() {
  throw new Error(
    'Filesystem operations are not available in a browser environment',
  );
} as (...args: any[]) => any;

export {
  // fs
  browserFSOperation as mkdir,
  browserFSOperation as access,
  browserFSOperation as stat,
  browserFSOperation as readFile,
  browserFSOperation as writeFile,

  // path
  browserFSOperation as dirname,
};
