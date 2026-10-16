#!/usr/bin/env python3
"""Read-only HTTPS evidence; never equates crawl eligibility with Google indexing."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import socket
import sys
import time
from urllib import error, parse, request, robotparser
import xml.etree.ElementTree as ET

BASE = 'https://www.drvasundaragynec.com'
UA = 'DrVasundaraLiveSeoCheck/2.0 (GitHub Actions; read-only)'
PATIENT_IDS = ('LQ5VBo9wZhw', 'ZjGuZZEki4w', 'Tn6soQyuW68', 'FcWkoQz6dko', 'gyG40rv_UOQ')

@dataclass
class Response:
    url: str
    status: int | None = None
    final: str = ''
    body: str = ''
    headers: dict = field(default_factory=dict)
    redirects: list = field(default_factory=list)
    errors: list = field(default_factory=list)
    attempts: int = 0

class Redirects(request.HTTPRedirectHandler):
    def __init__(self):
        self.steps = []
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.steps.append({'from': req.full_url, 'status': code, 'to': newurl})
        # Do not let a sitemap or production link redirect this verifier to another host.
        if parse.urlsplit(newurl).hostname not in ('drvasundaragynec.com', 'www.drvasundaragynec.com') or parse.urlsplit(newurl).scheme != 'https':
            raise error.HTTPError(req.full_url, code, 'Unexpected redirect destination', headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(url):
    result = Response(url=url, final=url)
    for attempt in range(2):
        tracker = Redirects()
        result.attempts = attempt + 1
        try:
            with request.build_opener(tracker).open(request.Request(url, headers={'User-Agent': UA}), timeout=10) as response:
                raw = response.read(5_000_001)
                if len(raw) > 5_000_000:
                    raise ValueError('Response exceeds 5 MB safety limit')
                result.status, result.final = response.status, response.url
                result.body = raw.decode('utf-8', 'replace')
                result.headers = {k.lower(): ', '.join(response.headers.get_all(k)) for k in response.headers.keys()}
                result.redirects = tracker.steps
                return result
        except error.HTTPError as exc:
            result.status, result.final = exc.code, exc.url
            result.body = exc.read(5_000_000).decode('utf-8', 'replace')
            result.headers = {k.lower(): ', '.join(exc.headers.get_all(k)) for k in exc.headers.keys()}
            result.redirects = tracker.steps
            if exc.code not in (429, 502, 503, 504) or attempt == 1:
                return result
        except (error.URLError, TimeoutError, OSError, ValueError) as exc:
            result.errors.append(f'{type(exc).__name__}: {exc}')
            result.redirects = tracker.steps
        if attempt == 0:
            time.sleep(1)
    return result

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.robots, self.canonicals, self.descriptions, self.og, self.links, self.schemas = [], [], [], [], [], []
        self.title, self.ids, self._title, self._schema = '', set(), False, None
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if 'id' in d: self.ids.add(d['id'])
        if tag == 'meta':
            name = d.get('name', '').lower()
            if name in ('robots', 'googlebot', 'bingbot'): self.robots.append(d.get('content', ''))
            if name == 'description': self.descriptions.append(d.get('content', ''))
            if d.get('property') == 'og:url': self.og.append(d.get('content', ''))
        if tag == 'link' and 'canonical' in d.get('rel', '').lower().split(): self.canonicals.append(d.get('href', ''))
        if tag == 'a' and 'href' in d: self.links.append(d['href'])
        if tag == 'title': self._title = True
        if tag == 'script' and d.get('type', '').lower() == 'application/ld+json': self._schema = ''
    def handle_data(self, data):
        if self._title: self.title += data
        if self._schema is not None: self._schema += data
    def handle_endtag(self, tag):
        if tag == 'title': self._title = False
        if tag == 'script' and self._schema is not None:
            self.schemas.append(self._schema)
            self._schema = None

def restricted(values):
    return bool(re.search(r'\b(noindex|nofollow|none)\b', ' '.join(values).lower()))

def schema_errors(raw, url=None):
    failures = []
    try:
        graphs = [json.loads(s) for s in raw]
        nodes = [n for graph in graphs for n in graph.get('@graph', [graph])]
        website = next(n for n in nodes if n.get('@type') == 'WebSite')
        person = website['about']
        route = parse.urlsplit(url or '').path
        types = {node.get('@type') for node in nodes}
        if route.startswith('/services/') and route != '/services/' and 'MedicalWebPage' not in types: failures.append('Missing service medical schema')
        if route.startswith('/blog/') and route.count('/') == 3 and route not in ('/blog/editorial-policy/',) and ('BlogPosting' not in types or 'MedicalWebPage' not in types): failures.append('Missing article/reviewer schema')
        if person.get('@id') != BASE + '/#doctor' or person.get('@type') != 'Person': failures.append('Doctor identity mismatch')
        def walk(value):
            if isinstance(value, dict):
                for child in value.values(): walk(child)
            elif isinstance(value, list):
                for child in value: walk(child)
            elif isinstance(value, str) and value.startswith(('http://', 'https://')):
                u = parse.urlsplit(value)
                if u.hostname in ('drvasundaragynec.com', 'www.drvasundaragynec.com') and not value.startswith(BASE + '/') and value != BASE: failures.append('Noncanonical structured-data host')
        walk(graphs)
        for node in nodes:
            if node.get('@type') == 'MedicalWebPage':
                if node.get('reviewedBy', {}).get('@id') != BASE + '/#doctor': failures.append('Medical reviewer identity mismatch')
                if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', node.get('lastReviewed', '')): failures.append('Missing medical review date')
            if node.get('@type') == 'BlogPosting' and not node.get('author', {}).get('name'): failures.append('Missing article author')
    except (ValueError, TypeError, KeyError, StopIteration, AttributeError) as exc:
        failures.append('Invalid/missing structured data: ' + str(exc))
    return failures

def html_result(response, expected, should_index, robots=None):
    if response.status is None:
        return 'UNVERIFIED', ['HTTPS retrieval exhausted bounded retries: ' + '; '.join(response.errors)], None
    problems = []
    head = Head(); head.feed(response.body)
    if response.status != expected: problems.append(f'HTTP {response.status}, expected {expected}')
    if response.final != response.url or response.redirects: problems.append('Unexpected page redirect')
    if 'text/html' not in response.headers.get('content-type', '').lower(): problems.append('Expected HTML content type')
    if head.canonicals != [response.url]: problems.append('Canonical mismatch or duplicates')
    if head.og != head.canonicals: problems.append('Open Graph URL mismatch')
    directives = head.robots + [response.headers.get('x-robots-tag', '')]
    noindex = bool(re.search(r'\b(noindex|none)\b', ' '.join(directives).lower()))
    if should_index and restricted(directives): problems.append('Restrictive meta/header robots')
    if not should_index and not noindex: problems.append('Missing intentional noindex')
    if should_index and not head.title.strip(): problems.append('Missing SEO title')
    if should_index and (len(head.descriptions) != 1 or not head.descriptions[0].strip()): problems.append('Missing/duplicate description')
    if robots is not None and should_index:
        for agent in ('Googlebot', 'Bingbot', '*'):
            if not robots.can_fetch(agent, response.url): problems.append('robots.txt blocks ' + agent)
    problems.extend(schema_errors(head.schemas, response.url))
    if any(video in response.body for video in PATIENT_IDS) or 'data-video-kind="patient-experience"' in response.body: problems.append('Withheld patient video published')
    return ('FAIL' if problems else 'PASS'), problems, head

def load_inventory(directory):
    root = Path(directory)
    if not (root / 'sitemap-index.xml').exists(): raise ValueError('Production build inventory missing; build before verification')
    eligible, excluded = set(), {}
    for file in root.rglob('*.html'):
        head = Head(); head.feed(file.read_text())
        if len(head.canonicals) != 1 or not head.canonicals[0].startswith(BASE + '/'): raise ValueError('Expected production-root www canonical build')
        url = head.canonicals[0]
        if restricted(head.robots): excluded[url] = 404 if file.name == '404.html' else 200
        else: eligible.add(url)
    if not eligible or not excluded: raise ValueError('Incomplete approved build inventory')
    return eligible, excluded

def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--expected-dir', default='dist')
    args = parser.parse_args()
    output = Path(os.environ.get('LIVE_SEO_OUTPUT', 'live-seo-report')); output.mkdir(parents=True, exist_ok=True)
    checks, responses, heads = [], {}, {}
    def record(name, status, detail, url=None):
        checks.append({'check': name, 'status': status, 'url': url, 'detail': detail})
        print(status, name, detail)
    try:
        expected, excluded = load_inventory(args.expected_dir)
    except (OSError, ValueError) as exc:
        expected, excluded = set(), {}
        record('Approved production inventory', 'FAIL', str(exc))
    def retrieve(url):
        if url not in responses: responses[url] = fetch(url)
        return responses[url]
    def resource(name, response, content_type):
        state = 'UNVERIFIED' if response.status is None else ('PASS' if response.status == 200 and response.final == response.url and not response.redirects and any(t in response.headers.get('content-type', '').lower() for t in content_type) else 'FAIL')
        record(name, state, {'http': response.status, 'content_type': response.headers.get('content-type'), 'errors': response.errors}, response.url)
        return state == 'PASS'
    robots_response = retrieve(BASE + '/robots.txt')
    robots = None
    if resource('robots.txt HTTPS', robots_response, ['text/plain']):
        robots = robotparser.RobotFileParser(); robots.parse(robots_response.body.splitlines())
        good = robots_response.body.strip() == f'User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap-index.xml'
        record('Production robots directives', 'PASS' if good else 'FAIL', robots_response.body)
    sitemap_urls, child_sitemaps = [], []
    index = retrieve(BASE + '/sitemap-index.xml')
    if resource('Sitemap index HTTPS', index, ['application/xml', 'text/xml']):
        try:
            tree = ET.fromstring(index.body)
            if tree.tag.split('}')[-1] != 'sitemapindex': raise ValueError('Expected sitemapindex')
            child_sitemaps = [n.text.strip() for n in tree.findall('{*}sitemap/{*}loc') if n.text]
            if not child_sitemaps or len(set(child_sitemaps)) != len(child_sitemaps): raise ValueError('Empty/duplicate child sitemaps')
            record('Sitemap index XML', 'PASS', child_sitemaps)
        except (ET.ParseError, ValueError) as exc: record('Sitemap index XML', 'FAIL', str(exc))
    for url in child_sitemaps:
        if not url.startswith(BASE + '/') or parse.urlsplit(url).query or parse.urlsplit(url).fragment:
            record('Child sitemap origin', 'FAIL', url); continue
        response = retrieve(url)
        if resource('Child sitemap HTTPS', response, ['application/xml', 'text/xml']):
            try:
                tree = ET.fromstring(response.body)
                if tree.tag.split('}')[-1] != 'urlset': raise ValueError('Expected urlset')
                locs = [n.text.strip() for n in tree.findall('{*}url/{*}loc') if n.text]
                if not locs: raise ValueError('Empty sitemap')
                sitemap_urls.extend(locs); record('Child sitemap XML', 'PASS', {'count': len(locs)}, url)
            except (ET.ParseError, ValueError) as exc: record('Child sitemap XML', 'FAIL', str(exc), url)
    if child_sitemaps and all(responses.get(u) and responses[u].status == 200 for u in child_sitemaps):
        good = len(sitemap_urls) == len(set(sitemap_urls)) and set(sitemap_urls) == expected
        record('Sitemap versus approved inventory', 'PASS' if good else 'FAIL', {'expected_count': len(expected), 'actual_count': len(sitemap_urls), 'missing': sorted(expected - set(sitemap_urls)), 'unexpected': sorted(set(sitemap_urls) - expected)})
    else: record('Sitemap versus approved inventory', 'UNVERIFIED', 'Sitemap retrieval incomplete; approved pages still checked independently')
    safe_sitemap = {u for u in sitemap_urls if u.startswith(BASE + '/') and not parse.urlsplit(u).query and not parse.urlsplit(u).fragment}
    urls = sorted(expected | set(excluded) | safe_sitemap)
    with ThreadPoolExecutor(max_workers=6) as pool:
        for response in pool.map(fetch, urls): responses[response.url] = response
    for url in urls:
        state, problems, head = html_result(responses[url], excluded.get(url, 200), url not in excluded, robots)
        heads[url] = head
        if robots is None and state == 'PASS' and url not in excluded: state, problems = 'UNVERIFIED', ['Page passed; robots.txt could not be verified']
        record('HTML', state, {'http': responses[url].status, 'title': head.title if head else None, 'robots': head.robots if head else None, 'canonical': head.canonicals if head else None, 'problems': problems}, url)
    for field in ('title', 'descriptions'):
        seen = {}
        for url in sorted(expected):
            head = heads.get(url)
            value = getattr(head, field) if head else None
            key = json.dumps(value)
            if value and key in seen: record('Duplicate SEO ' + field, 'FAIL', [seen[key], url])
            if value: seen[key] = url
    # Check all unique same-origin anchor destinations, including noindex pages and fragments.
    links, link_sources = set(), {}
    for url, head in heads.items():
        if head:
            for href in head.links:
                target = parse.urljoin(url, href); parsed = parse.urlsplit(target)
                if parsed.hostname in ('www.drvasundaragynec.com', 'drvasundaragynec.com'):
                    links.add(target)
                    link_sources.setdefault(target, set()).add(url)
    destinations = {parse.urldefrag(url)[0] for url in links}
    missing = sorted(destinations - responses.keys())
    if len(missing) > 100:
        record('Internal destinations', 'UNVERIFIED', 'More than 100 uncached destinations; bounded verification limit'); missing = missing[:100]
    with ThreadPoolExecutor(max_workers=6) as pool:
        for response in pool.map(fetch, missing): responses[response.url] = response
    broken, uncertain = [], []
    for link in sorted(links):
        url, fragment = parse.urldefrag(link); response = responses.get(url)
        if response is None or response.status is None: uncertain.append(link); continue
        if (response.status != 200 and not (response.status == 404 and excluded.get(url) == 404 and fragment and link_sources[link] == {url})) or parse.urlsplit(response.final).netloc != parse.urlsplit(BASE).netloc: broken.append(link); continue
        if fragment and 'text/html' in response.headers.get('content-type', ''):
            head = heads.get(url)
            if head is None: head = Head(); head.feed(response.body)
            if parse.unquote(fragment) not in head.ids: broken.append(link)
    record('Internal links', 'FAIL' if broken else 'UNVERIFIED' if uncertain else 'PASS', {'unique_links': len(links), 'destinations': len(destinations), 'broken': broken, 'unverified': uncertain})
    apex = retrieve('https://drvasundaragynec.com/')
    good = apex.status == 200 and apex.final == BASE + '/' and len(apex.redirects) == 1 and apex.redirects[0]['status'] == 301
    record('Apex to www 301 without loop', 'UNVERIFIED' if apex.status is None else 'PASS' if good else 'FAIL', {'http': apex.status, 'redirects': apex.redirects, 'errors': apex.errors})
    dns = {}
    for host in ('www.drvasundaragynec.com', 'drvasundaragynec.com'):
        try:
            dns[host] = sorted({(str(info[0]), info[4][0]) for info in socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)})
        except OSError as exc: dns[host] = str(exc)
    summary = {state: sum(c['status'] == state for c in checks) for state in ('PASS', 'FAIL', 'UNVERIFIED')}
    report = {'checked_at': datetime.now(timezone.utc).isoformat(), 'site': BASE, 'summary': summary, 'expected_eligible_urls': sorted(expected), 'excluded_urls': excluded, 'checks': checks, 'responses': {url: vars(response) | {'body': None} for url, response in responses.items()}, 'dns': dns, 'note': 'Technical crawl eligibility only; Google index coverage and search visibility are separate evidence. Network-inconclusive exit=2; demonstrated technical failure exit=1.'}
    (output / 'results.json').write_text(json.dumps(report, indent=2) + '\n')
    md = ['# Live production SEO verification', '', f"Checked: {report['checked_at']}", '', str(summary), '', '| Check / URL | Result | Evidence |', '|---|---|---|']
    for check in checks:
        detail = json.dumps(check['detail'], ensure_ascii=False) if not isinstance(check['detail'], str) else check['detail']
        md.append(f"| {check['check']} {check['url'] or ''} | {check['status']} | {detail.replace('|', '/').replace(chr(10), ' ')[:1000]} |")
    md.extend(['', report['note']]); text = '\n'.join(md) + '\n'
    (output / 'summary.md').write_text(text)
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as stream: stream.write(text)
    if summary['FAIL']: print('::error::Live technical verification failed; inspect URL-by-URL evidence')
    elif summary['UNVERIFIED']: print('::warning::Verification inconclusive; inspect retrieval errors before attributing a website failure')
    return 1 if summary['FAIL'] else 2 if summary['UNVERIFIED'] else 0

if __name__ == '__main__':
    sys.exit(main())
