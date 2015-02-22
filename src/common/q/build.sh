curl -o _q.js https://raw.githubusercontent.com/kriskowal/q/v1/q.js
cat q-prefix.txt _q.js q-suffix.txt > q.js
rm _q.js
