#!/usr/bin/env python3
"""Read-only production SEO verification. Reports observations, not Google index inclusion."""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

BASE = "https://www.drvasundaragynec.com"
OUT = Path(os.environ.get("LIVE_SEO_OUTPUT", "live-seo-report"))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
USER_AGENT = "DrVasundaraLiveSeoCheck/1.0 (GitHub Actions; read-only)"
EXCLUDED = [
    "/testimonials/",
    "/blog/category/pcos-hormonal-health/",
    "/blog/category/fertility-reproductive-health/",
    "/blog/category/menopause-midlife-health/",
    "/blog/category/preventive-healthcare/",
]
def record(name, passed, detail):
    checks.append({"check":name,"status":"PASS" if passed else "FAIL","detail":str(detail)})
    print(f'{"PASS" if passed else "FAIL"} {name}: {detail}')

def fetch(url):
    error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent":USER_AGENT})
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = resp.read(5_000_000)
                return resp.status, resp.geturl(), body.decode("utf-8","replace"), dict(resp.headers)
        except urllib.error.HTTPError as exc:
            return exc.code, exc.geturl(), exc.read(5_000_000).decode("utf-8","replace"), dict(exc.headers)
        except Exception as exc:
            error = f"{type(exc).__name__}: {exc}"
            if attempt < 2: time.sleep(2 * (attempt + 1))
    return None, url, "", {"error":error}

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.robots = []
        self.canonicals = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "meta" and d.get("name","").lower() in ("robots","googlebot"):
            self.robots.append(d.get("content",""))
        if tag == "link" and "canonical" in d.get("rel","").lower().split():
            self.canonicals.append(d.get("href",""))

def check_html(path, should_index=True):
    url=BASE+path
    status,final,html,headers=fetch(url)
    parser=Head()
    parser.feed(html)
    robot=" ".join(parser.robots).lower()
    hdr=str(headers.get("X-Robots-Tag","")).lower()
    allowed = ("noindex" not in robot and "noindex" not in hdr) if should_index else ("noindex" in robot or "noindex" in hdr)
    canonical=BASE+path
    record("HTML "+path, status==200 and final==url and allowed and parser.canonicals==[canonical],
        f"status={status}, final={final}, robots={parser.robots}, x-robots={hdr}, canonical={parser.canonicals}")
    return status==200

status, final, robots, headers = fetch(BASE+"/robots.txt")
record("robots.txt", status==200 and final==BASE+"/robots.txt" and bool(re.search(r"(?im)^allow:\s*/\s*$",robots)) and not bool(re.search(r"(?im)^disallow:\s*/\s*$",robots)) and ("Sitemap: "+BASE+"/sitemap-index.xml") in robots,
       f"status={status}, final={final}, body={robots[:500]!r}")
status, final, index, headers=fetch(BASE+"/sitemap-index.xml")
sitemaps=[]
if status==200:
    try:
        root=ET.fromstring(index)
        sitemaps=[(node.text or "").strip() for node in root.iter() if node.tag.endswith("}loc") or node.tag=="loc"]
    except ET.ParseError as exc:
        record("sitemap-index XML",False,str(exc))
record("sitemap-index.xml", status==200 and final==BASE+"/sitemap-index.xml" and bool(sitemaps) and all(u.startswith(BASE+"/") for u in sitemaps),
       f"status={status}, sitemap files={sitemaps}")
urls=[]
for sitemap in sitemaps:
    status,final,xml,headers=fetch(sitemap)
    try:
        root=ET.fromstring(xml) if status==200 else None
        locs=[(x.text or "").strip() for x in root.iter() if x.tag.endswith("}loc") or x.tag=="loc"] if root is not None else []
    except ET.ParseError:
        locs=[]
    record("sitemap file "+sitemap, status==200 and final==sitemap and bool(locs), f"status={status}, count={len(locs)}")
    urls+=locs
unique=len(urls)==len(set(urls))
approved=all(u.startswith(BASE+"/") and urllib.parse.urlsplit(u).query=="" and urllib.parse.urlsplit(u).fragment=="" and urllib.parse.urlsplit(u).path not in EXCLUDED and "/404/" not in u for u in urls)
record("53 canonical eligible sitemap URLs",len(urls)==53 and unique and approved,f"count={len(urls)}, unique={unique}, eligible={approved}")
check_html("/")
sample=next((urllib.parse.urlsplit(u).path for u in urls if "/services/" in urllib.parse.urlsplit(u).path and urllib.parse.urlsplit(u).path!="/services/"),None)
if sample: check_html(sample)
else: record("medical service sample",False,"No eligible service URL in sitemap")
article=next((urllib.parse.urlsplit(u).path for u in urls if "/blog/" in urllib.parse.urlsplit(u).path and "/category/" not in u and urllib.parse.urlsplit(u).path!="/blog/"),None)
if article: check_html(article)
else: record("medical article sample",False,"No eligible article URL in sitemap")
for p in EXCLUDED: check_html(p,False)
# 404 is not expected to be a 200 page; it must remain outside sitemap.
st,final,body,h=fetch(BASE+"/404/")
p=Head();p.feed(body)
record("404 exclusion", BASE+"/404/" not in urls and (st==404 or ("noindex" in " ".join(p.robots).lower())),f"status={st}, robots={p.robots}")
st,final,body,h=fetch("https://drvasundaragynec.com/")
record("apex to www redirect", st==200 and final==BASE+"/",f"status={st}, final={final}")
report={"checked_at":datetime.now(timezone.utc).isoformat(),"site":BASE,"summary":{"passed":sum(c["status"]=="PASS" for c in checks),"failed":sum(c["status"]=="FAIL" for c in checks)},"checks":checks,"note":"Live technical eligibility only; Google Search Console is authoritative for actual indexed pages."}
(OUT/"results.json").write_text(json.dumps(report,indent=2)+"\n")
md=["# Production SEO live verification","",f"Checked: {report['checked_at']}","",f"Passed: {report['summary']['passed']} | Failed: {report['summary']['failed']}","", "| Check | Result | Details |","|---|---|---|"]
for c in checks:
    safe=c["detail"].replace("|","/").replace("\n"," ")[:240]
    md.append(f"| {c['check']} | {c['status']} | {safe} |")
md+=["","Technical checks do not prove inclusion in Google Search results. Check Search Console for indexed-page counts."]
(OUT/"summary.md").write_text("\n".join(md)+"\n")
with open(os.environ.get("GITHUB_STEP_SUMMARY","/dev/null"),"a") as f:f.write("\n".join(md)+"\n")
sys.exit(1 if report["summary"]["failed"] else 0)
