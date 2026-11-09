# Search Atlas

Personal search analytics over your Chrome Takeout export.

```
nvm use 20                                   # better-sqlite3 is built for Node 20
python3 ../replica/import_takeout.py ../data ../search.db
npm install
npm run dev                                  # http://127.0.0.1:3000
```

If every page returns 500 with "compiled against a different Node.js version", the SQLite binding was built for another Node. Fix:

```
cd node_modules/better-sqlite3 && rm -rf build && npx prebuild-install -r node -t "$(node -p process.versions.node)"
```
