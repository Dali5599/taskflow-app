#!/bin/bash
cd /home/nexus/.openclaw/workspace/taskflow-app
pkill -f "next dev" 2>/dev/null || true
rm -rf .next
npm run dev
