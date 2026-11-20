from pathlib import Path
from html import escape
import argparse,json

ROOT=Path(__file__).resolve().parent.parent
VERSION='archives-20261120'

def render(archive):
    key=archive['id']; title=archive['title']; groups=[]; jumps=[]
    for group in archive['groups']:
        jumps.append(f'<a href="#{escape(group["id"])}">{escape(group["title"])}</a>')
        rows=[]
        for entry in group['entries']:
            links=[]
            for label,url in entry['formats'].items():
                target=(ROOT/url.lstrip('/')).resolve()
                if url.endswith('/'):target=target/'index.html'
                assert target.is_relative_to(ROOT) and target.is_file(),url
                links.append(f'<a class="archive-format" href="{escape(url)}" target="_blank" rel="noopener" aria-label="{escape(entry["title"]+" — "+label+" (opens in a new tab)")}">{escape(label)}</a>')
            language=' lang="ko"' if entry.get('lang')=='ko' else ''
            rows.append(f'<li class="archive-entry" id="{escape(entry["id"])}"><div><h3{language}>{escape(entry["title"])}</h3><p>{escape(entry["description"])}</p></div><div class="archive-formats">'+''.join(links)+'</div></li>')
        groups.append(f'<section class="archive-group" id="{escape(group["id"])}" aria-labelledby="{escape(group["id"])}-title"><h2 id="{escape(group["id"])}-title">{escape(group["title"])}</h2><ul class="archive-items">'+''.join(rows)+'</ul></section>')
    nav=[]
    for name,url in [('About','/'),('Publications','/publications/'),('Projects','/projects/'),('Teaching','/teaching/'),('Talks','/talks/')]:
        active=' class="active" aria-current="page"' if url=='/'+key+'/' else ''
        nav.append(f'<li><a href="{url}"{active}>{name}</a></li>')
    return f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} | Wonyong Park</title>
<meta name="description" content="{escape(archive['description'])}"><meta name="robots" content="noindex">
<link rel="canonical" href="https://www.wonyongpark.com/{key}/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&amp;family=Figtree:ital,wght@0,400..700;1,400..600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css?v={VERSION}"><link rel="stylesheet" href="/assets/css/archives.css?v={VERSION}">
<script src="/assets/js/archives.js?v={VERSION}" defer></script>
</head>
<body class="page-archive">
<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="site-header"><div class="header-inner"><a class="site-logo" href="/">Wonyong Park</a><nav class="site-nav" aria-label="Main navigation"><ul>{''.join(nav)}</ul></nav></div></header>
<main id="main-content" class="archive-main" data-archive="{key}" data-password-hash="{archive['password_hash']}">
<div class="page-title-band"><div class="page-title-inner"><div class="archive-title-row"><div><h1 id="archive-title" tabindex="-1">{escape(title)}</h1><p class="page-subtitle">{escape(archive['description'])}</p></div><button class="btn btn-secondary" type="button" id="archive-lock" hidden>Lock archive</button></div></div></div>
<div class="main-wrapper">
<section class="archive-gate" id="archive-gate" aria-label="Open the archive"><p>Enter the shared password to view this archive.</p><form id="archive-password-form"><label class="archive-password-label" for="archive-password">Password</label><div class="archive-password-row"><input type="password" id="archive-password" autocomplete="current-password" inputmode="numeric" required aria-describedby="archive-error"><button class="btn btn-primary" id="archive-unlock" type="submit">Open archive</button></div><p id="archive-error" class="archive-error" role="alert"></p></form><noscript><p>Enable JavaScript to open this archive list.</p></noscript></section>
<div id="archive-content" class="archive-content" hidden><nav class="archive-jumps" aria-label="Archive sections">{''.join(jumps)}</nav>{''.join(groups)}</div>
</div></main>
<footer class="site-footer">© 2026 Wonyong Park | University of Southampton</footer>
</body></html>
'''

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
    catalogue=json.loads((ROOT/'assets/data/archives.json').read_text(encoding='utf-8'))
    for archive in catalogue['archives']:
        result=render(archive);target=ROOT/archive['id']/'index.html'
        if args.check: assert target.read_text(encoding='utf-8')==result,f'Rebuild {target}'
        else: target.parent.mkdir(parents=True,exist_ok=True);target.write_text(result,encoding='utf-8')
        print(archive['id']+': '+str(sum(len(g['entries']) for g in archive['groups']))+' entries')

if __name__=='__main__':main()
