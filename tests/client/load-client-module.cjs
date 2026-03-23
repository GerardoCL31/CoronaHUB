const fs = require("node:fs");
const path = require("node:path");
const { transformSync } = require("../../client/node_modules/@babel/core");

const presetEnv = require("../../client/node_modules/@babel/preset-env");

function resolveRelativeImport(fromPath, specifier) {
  let resolved = path.resolve(path.dirname(fromPath), specifier);
  if (path.extname(resolved)) {
    return resolved;
  }

  for (const extension of [".js", ".jsx", ".json"]) {
    if (fs.existsSync(`${resolved}${extension}`)) {
      return `${resolved}${extension}`;
    }
  }

  return resolved;
}

function loadClientModule(filePath, { mocks = new Map(), cache = new Map() } = {}) {
  const absolutePath = path.resolve(filePath);
  if (cache.has(absolutePath)) {
    return cache.get(absolutePath).exports;
  }

  const source = fs.readFileSync(absolutePath, "utf8");
  const transformed = transformSync(source, {
    filename: absolutePath,
    sourceType: "module",
    presets: [[presetEnv, { targets: { node: "current" }, modules: "commonjs" }]],
  }).code;

  const module = { exports: {} };
  cache.set(absolutePath, module);

  const localRequire = (specifier) => {
    const resolvedSpecifier =
      specifier.startsWith(".") || path.isAbsolute(specifier)
        ? resolveRelativeImport(absolutePath, specifier)
        : specifier;

    if (mocks.has(specifier)) {
      return mocks.get(specifier);
    }
    if (mocks.has(resolvedSpecifier)) {
      return mocks.get(resolvedSpecifier);
    }

    if (!specifier.startsWith(".") && !path.isAbsolute(specifier)) {
      return require(specifier);
    }

    return loadClientModule(resolvedSpecifier, { mocks, cache });
  };

  const evaluator = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    transformed
  );

  evaluator(module.exports, localRequire, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

module.exports = {
  loadClientModule,
};
