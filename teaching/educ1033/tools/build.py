"""Build self-contained slide decks for one week.

Usage:
    python tools/build.py w9            # build every deck in w9/src
    python tools/build.py w9 lecture    # build w9/src/lecture.html only

Each deck source <week>/src/<deck>.html may contain:
    <!--TITLE:...-->        page title (fills {{TITLE}} in the shared head)
    {{INCLUDE:_file.html}}  shared parts from <week>/src/
    {{IMG:name}}            image from <week>/src/img/, inlined as a data URI
    {{ICON:name}}           Lucide icon (ISC licence) from <week>/src/icons/
Slides written as <div data-n class="slide ..."> are numbered in order.
Output: <week>/<deck>/index.html
"""
import base64, pathlib, re, sys

week = pathlib.Path(__file__).resolve().parent.parent / sys.argv[1]
src = week / 'src'
decks = sys.argv[2:] or sorted(p.stem for p in src.glob('*.html') if not p.stem.startswith('_'))


def inline_img(m):
    p = next((src / 'img').glob(m.group(1) + '.*'))
    mime = 'image/png' if p.suffix == '.png' else 'image/jpeg'
    return f'data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}'


def inline_icon(m):
    svg = (src / 'icons' / (m.group(1) + '.svg')).read_text(encoding='utf-8')
    svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S)
    # strip size and class from the <svg> root only; <rect> needs its own width/height
    svg = re.sub(r'<svg[^>]*>', lambda t: re.sub(r'\s*(class|width|height)="[^"]*"', '', t.group(0)), svg, count=1)
    svg = re.sub(r'\s+', ' ', svg).strip().replace('<svg ', '<svg aria-hidden="true" ', 1)
    return svg.replace(' />', '/>').replace('> <', '><')


for deck in decks:
    html = (src / f'{deck}.html').read_text(encoding='utf-8')
    title = re.search(r'<!--TITLE:(.*?)-->\n?', html)
    html = html.replace(title.group(0), '') if title else html
    html = re.sub(r'\{\{INCLUDE:([\w.-]+)\}\}', lambda m: (src / m.group(1)).read_text(encoding='utf-8'), html)
    html = html.replace('{{TITLE}}', title.group(1) if title else deck.title())
    html = re.sub(r'\{\{IMG:(\w+)\}\}', inline_img, html)
    html = re.sub(r'\{\{ICON:([\w-]+)\}\}', inline_icon, html)
    n = iter(range(1, 1000))
    html = re.sub(r'<div data-n class="slide', lambda m: f'<div data-n="{next(n)}" class="slide', html)
    out = week / deck / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding='utf-8')
    print(out, f'{out.stat().st_size / 1e6:.2f} MB', html.count('class="frame"'), 'slides')
