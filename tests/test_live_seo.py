"""Offline regression cases for live verification, never Google inclusion claims."""
import importlib.util
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
import json

spec = importlib.util.spec_from_file_location('live_seo', Path(__file__).parents[1] / 'scripts/verify-live-seo.py')
live = importlib.util.module_from_spec(spec); sys.modules[spec.name] = live; spec.loader.exec_module(live)

class VerificationTests(unittest.TestCase):
    def page(self, status=200, robots='index, follow', headers=None, canonical=None):
        url = live.BASE + '/'
        graph = {'@type':'WebSite','about':{'@type':'Person','@id':live.BASE+'/#doctor'}}
        html = f'<title>Doctor</title><meta name="description" content="Approved profile"><meta name="robots" content="{robots}"><link rel="canonical" href="{canonical or url}"><meta property="og:url" content="{url}"><script type="application/ld+json">{json.dumps(graph)}</script>'
        return live.Response(url, status, url, html, headers or {'content-type':'text/html'})

    def test_indexable_html(self):
        self.assertEqual(live.html_result(self.page(), 200, True)[0], 'PASS')

    def test_conflicting_lowercase_header(self):
        self.assertEqual(live.html_result(self.page(headers={'content-type':'text/html','x-robots-tag':'googlebot: noindex'}),200,True)[0],'FAIL')

    def test_none_is_restrictive(self):
        self.assertEqual(live.html_result(self.page(robots='none'),200,True)[0],'FAIL')

    def test_duplicate_or_wrong_canonical(self):
        self.assertEqual(live.html_result(self.page(canonical='https://drvasundaragynec.com/'),200,True)[0],'FAIL')
        response=self.page();response.body+='<link rel="canonical" href="'+response.url+'">'
        self.assertEqual(live.html_result(response,200,True)[0],'FAIL')

    def test_404_requires_noindex_and_404(self):
        self.assertEqual(live.html_result(self.page(status=404,robots='noindex, nofollow'),404,False)[0],'PASS')
        self.assertEqual(live.html_result(self.page(status=404),404,False)[0],'FAIL')
        self.assertEqual(live.html_result(self.page(robots='noindex'),404,False)[0],'FAIL')

    def test_network_is_unverified_not_a_demonstrated_site_failure(self):
        response=live.Response(live.BASE+'/',errors=['URLError: temporary DNS failure'])
        self.assertEqual(live.html_result(response,200,True)[0],'UNVERIFIED')

    def test_bounded_network_retries(self):
        with patch.object(live.request,'build_opener') as opener, patch.object(live.time,'sleep'):
            opener.return_value.open.side_effect=URLError('temporary DNS failure')
            response=live.fetch(live.BASE+'/')
            self.assertEqual(response.attempts,2);self.assertEqual(len(response.errors),2)
            self.assertIsNone(response.status)

    def test_robots_blocks_specific_bot(self):
        robots=live.robotparser.RobotFileParser();robots.parse(['User-agent: Googlebot','Disallow: /','User-agent: *','Allow: /'])
        self.assertEqual(live.html_result(self.page(),200,True,robots)[0],'FAIL')

    def test_patient_video_and_invalid_schema_fail(self):
        response=self.page();response.body+=live.PATIENT_IDS[0]
        self.assertEqual(live.html_result(response,200,True)[0],'FAIL')
        self.assertTrue(live.schema_errors(['{bad json']))

    def test_patient_video_approval_is_exact_and_placement_scoped(self):
        response=self.page()
        response.body+='<article data-video-kind="patient-experience"><div data-video-id="'+live.PATIENT_IDS[0]+'"></div></article>'
        self.assertEqual(live.html_result(response,200,True,approved_videos=[live.PATIENT_IDS[0]])[0],'PASS')
        self.assertEqual(live.html_result(response,200,True,approved_videos=[live.PATIENT_IDS[1]])[0],'FAIL')
        response.url=response.final=live.BASE+'/contact/'
        self.assertEqual(live.html_result(response,200,True,approved_videos=[live.PATIENT_IDS[0]])[0],'FAIL')

    def test_inventory_count_is_derived_and_exclusions_not_indexable(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);(root/'sitemap-index.xml').write_text('<sitemapindex/>')
            (root/'index.html').write_text(self.page().body)
            (root/'404.html').write_text(self.page(robots='noindex, nofollow').body.replace(live.BASE+'/',live.BASE+'/404/'))
            eligible,excluded=live.load_inventory(root)
            self.assertEqual(eligible,{live.BASE+'/'})
            self.assertEqual(excluded,{live.BASE+'/404/':404})

    def test_all_sitemap_pages_and_404_fragment_are_checked(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);(root/'sitemap-index.xml').write_text('<sitemapindex/>')
            (root/'index.html').write_text(self.page().body)
            (root/'404.html').write_text(self.page(robots='noindex').body.replace(live.BASE+'/',live.BASE+'/404/'))
            normal=self.page(); normal.body+='<a href="/404/">broken destination</a>'
            missing=self.page(status=404,robots='noindex');missing.url=missing.final=live.BASE+'/404/';missing.body=missing.body.replace(live.BASE+'/',live.BASE+'/404/')+'<a href="#main">Skip</a><main id="main"></main>';missing.body=missing.body.replace(live.BASE+'/404/#doctor',live.BASE+'/#doctor')
            robots=live.Response(live.BASE+'/robots.txt',200,live.BASE+'/robots.txt','User-agent: *\nAllow: /\nSitemap: '+live.BASE+'/sitemap-index.xml',{'content-type':'text/plain'})
            index=live.Response(live.BASE+'/sitemap-index.xml',200,live.BASE+'/sitemap-index.xml','<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>'+live.BASE+'/sitemap-0.xml</loc></sitemap></sitemapindex>',{'content-type':'application/xml'})
            sitemap=live.Response(live.BASE+'/sitemap-0.xml',200,live.BASE+'/sitemap-0.xml','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+live.BASE+'/</loc></url></urlset>',{'content-type':'application/xml'})
            apex=live.Response('https://drvasundaragynec.com/',200,live.BASE+'/',redirects=[{'status':301}])
            data={r.url:r for r in [normal,missing,robots,index,sitemap,apex]}
            with patch.object(sys,'argv',['verify','--expected-dir',str(root)]),patch.dict(live.os.environ,{'LIVE_SEO_OUTPUT':str(root/'out')}),patch.object(live,'fetch',side_effect=lambda u:data[u]),patch.object(live.socket,'getaddrinfo',return_value=[]),patch.object(live,'approved_patient_ids',return_value=[]):
                self.assertEqual(live.main(),1)
            report=json.loads((root/'out/results.json').read_text())
            links=next(c for c in report['checks'] if c['check']=='Internal links')
            self.assertEqual(links['detail']['broken'],[live.BASE+'/404/'])
            self.assertEqual(sum(c['check']=='HTML' for c in report['checks']),2)
            self.assertTrue(all(c['status']=='PASS' for c in report['checks'] if c['check']=='HTML'))
            normal.body=normal.body.replace('<a href="/404/">broken destination</a>','')
            with patch.object(sys,'argv',['verify','--expected-dir',str(root)]),patch.dict(live.os.environ,{'LIVE_SEO_OUTPUT':str(root/'out')}),patch.object(live,'fetch',side_effect=lambda u:data[u]),patch.object(live.socket,'getaddrinfo',return_value=[]),patch.object(live,'approved_patient_ids',return_value=[]):
                self.assertEqual(live.main(),0)

if __name__=='__main__': unittest.main()
