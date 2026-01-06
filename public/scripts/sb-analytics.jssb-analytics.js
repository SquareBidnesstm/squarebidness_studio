cd ~/Desktop/code/squarebidness_studio
mkdir -p public/scripts
cat > public/scripts/sb-analytics.js <<'EOF'
(() => {
  // SB Analytics placeholder (safe no-op).
  // Drop your real analytics logic here when ready.
  window.SB_ANALYTICS = window.SB_ANALYTICS || { loaded: true, ts: Date.now() };
})();
EOF
