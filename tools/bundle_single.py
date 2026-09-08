#!/usr/bin/env python3
"""Bundle app/www into one self-contained HTML fragment (CSS, data and JS inlined) for publishing as a hosted page."""
import os,re,sys
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
w=os.path.join(root,'app/www')
css=open(os.path.join(w,'style.css'),encoding='utf-8').read()
data=open(os.path.join(w,'data.js'),encoding='utf-8').read().replace('</script','<\\/script')
js=open(os.path.join(w,'app.js'),encoding='utf-8').read().replace('</script','<\\/script')
html=open(os.path.join(w,'index.html'),encoding='utf-8').read()
body=re.search(r'<body>(.*?)<script src="data.js">',html,re.S).group(1)
out=f"""<title>ASC 2026 Navigator</title>
<meta name="theme-color" content="#0f1420">
<style>
{css}
</style>
{body}
<script>{data}</script>
<script>{js}</script>
"""
dst=sys.argv[1] if len(sys.argv)>1 else os.path.join(root,'app/dist/asc2026-navigator.html')
os.makedirs(os.path.dirname(dst),exist_ok=True)
open(dst,'w',encoding='utf-8').write(out)
print(dst,len(out),'bytes')
