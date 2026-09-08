import re,json,html,sys,time,os,urllib.request,urllib.parse
OUT=os.environ.get('ASC_SCRATCH','./scratch')
API="https://eppro01.ativ.me/web/api.php"
def post(data):
    body=urllib.parse.urlencode(data).encode()
    for attempt in range(5):
        try:
            r=urllib.request.urlopen(urllib.request.Request(API,data=body,headers={'User-Agent':'Mozilla/5.0'}),timeout=120)
            return r.read().decode('utf-8','ignore')
        except Exception as e:
            print('retry',attempt,e,file=sys.stderr); time.sleep(2*(attempt+1))
    raise SystemExit('failed')
def page(table,offset):
    t=post({'interface':'filter','action':'list','confid':'ASC2026','table':table,'filters':'[]','order':'[]','offset':offset,'adapter':'null','limit':50})
    m=re.search(r'<Item success="([^"]*)" msg="([^"]*)">(.*?)</Item>',t,re.S)
    if not m or m.group(1)!='true': print('BAD',table,offset,t[:300],file=sys.stderr); return []
    d=html.unescape(m.group(3)).strip()
    if not d or d=='[]': return []
    return json.loads(d)
out={}
for table in sys.argv[1:]:
    allrows=[]; seen=set(); off=0
    while True:
        rows=page(table,off)
        if not rows: break
        new=0
        for r in rows:
            k=json.dumps(r,sort_keys=True)
            if k not in seen: seen.add(k); allrows.append(r); new+=1
        print(table,off,len(rows),'new',new,file=sys.stderr)
        if new==0: break
        off+=50
    json.dump(allrows,open(OUT+'/data/'+table+'.json','w'),ensure_ascii=False)
    print('DONE',table,len(allrows),file=sys.stderr)
