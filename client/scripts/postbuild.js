const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, ".htaccess");
const target = path.join(root, "dist", ".htaccess");

if (fs.existsSync(source)) {
  fs.copyFileSync(source, target);
  console.log(`Copied ${path.basename(source)} to dist`);
} else {
  console.warn("No .htaccess found in client root; skipping postbuild copy");
}
