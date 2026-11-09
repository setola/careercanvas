const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const read = file => fs.readFileSync(path.join('public', file), 'utf8');
const home = read('index.html');
const cssHref = home.match(/href=["']?(\/css\/[^"' >]+\.css)/)?.[1];
assert.ok(cssHref, 'home links to a compiled CSS resource');
const css = read(cssHref.slice(1));

test('home renders all theme sections without local layout overrides', () => {
  assert.equal(fs.existsSync('layouts'), false);
  assert.equal(fs.existsSync('assets/css/main.css'), false);
  assert.equal(fs.existsSync('tailwind.config.js'), false);
  assert.match(home, /Alex/);
  for (const section of ['home', 'about', 'skills', 'experience', 'technical', 'testimonials', 'contact']) {
    assert.match(home, new RegExp(`id=["']?${section}["' >]`));
  }
  assert.match(home, /Read more|Learn more/);
});

test('Tailwind, typography and class-based dark variants compile', () => {
  assert.match(cssHref, /main\.[a-f0-9]+\.css$/);
  for (const selector of ['.hidden', '.flex', '.lg\\:flex-row', '.prose', '.font-heading']) {
    assert.ok(css.includes(selector), `compiled ${selector}`);
  }
  assert.match(css, /:where\(\.dark/);
  assert.ok(css.includes('Nunito Sans'));
  assert.ok(!/@(?:config|source|plugin|tailwind)\b/.test(css), 'no unprocessed Tailwind directives');
  assert.ok(!/@import\s+["']tailwindcss/.test(css), 'Tailwind package import was resolved');
});

test('modal alpha utilities and runtime toast utilities are emitted', () => {
  for (const selector of ['.bg-surface\\/50', '.bottom-6', '.right-6', '.rounded-sm', '.shadow-lg']) {
    assert.ok(css.includes(selector), `compiled ${selector}`);
  }
  assert.match(home, /bg-surface\/50/);
});

test('docs list, single, taxonomy and 404 use the upstream theme templates', () => {
  assert.match(read('docs/index.html'), /shadow-xs/);
  assert.match(read('docs/example/index.html'), /Content and shortcode example/);
  assert.match(read('tags/examples/index.html'), /Content and shortcode example/);
  assert.match(read('404.html'), /Page not found/i);
  assert.match(read('404.html'), /bg-surface\/20/);
});

test('shortcodes render with native aspect ratio and local fixtures', () => {
  const article = read('docs/example/index.html');
  assert.match(article, /aspect-video/);
  assert.match(article, /player\.vimeo\.com\/video\/76979871/);
  assert.match(article, /\/embeds\/example\.html/);
  assert.match(article, /images\/gallery\/workspace\.svg/);
  assert.match(article, /rounded-sm shadow-sm/);
  assert.ok(css.includes('.aspect-video'));
  assert.ok(fs.existsSync('public/images/profile.svg'));
  assert.ok(fs.existsSync('public/embeds/example.html'));
});

test('language selector and resume map support a second language', () => {
  const result = spawnSync('hugo', [
    '--config', 'hugo.toml,tests/multilingual.toml',
    '--environment', 'production', '--minify', '--panicOnWarning', '--printI18nWarnings',
    '--destination', '.docker/multilingual',
  ], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const french = fs.readFileSync('.docker/multilingual/fr/index.html', 'utf8');
  assert.match(french, /Français/);
  assert.match(french, /Example/);
});
