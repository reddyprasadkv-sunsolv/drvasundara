import { test, expect } from '@playwright/test';
import { expectedRobots } from '../scripts/indexing-release.mjs';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.PAGES_PREVIEW === 'true' ? '/drvasundara' : '';
const routes = [
  '/',
  '/about/',
  '/services/',
  '/services/urogynecology-consultation/',
  '/services/laparoscopic-gynecological-surgery/',
  '/blog/',
  '/blog/laparoscopic-hysterectomy/',
  '/blog/category/menopause-midlife-health/',
  '/blog/authors/dr-vasundara/',
  '/faqs/',
  '/contact/',
  '/appointment/',
  '/privacy/',
  '/testimonials/',
];
for (const route of routes) {
  test(`${route} accessible, responsive and publication-safe`, async ({
    page,
  }, testInfo) => {
    const response = await page.goto(base + route);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    await testInfo.attach('axe-results', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
    expect(result.violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      expectedRobots(
        route === '/' ? 'index.html' : route.slice(1) + 'index.html',
        process.env.PAGES_PREVIEW === 'true',
      ),
    );
    await expect(
      page.locator('[data-video-kind="patient-experience"]'),
    ).toHaveCount(0);
    await expect(
      page.locator(
        'a[href^="mailto:"], a[href^="tel:"], a[href*="forms.gle"], a[href*="docs.google.com/forms"], form:not([role="search"])',
      ),
    ).toHaveCount(0);
    if (route === '/testimonials/') {
      const cards = page.locator('main .experience-card');
      await expect(cards).toHaveCount(3);
      await expect(page.locator('main')).not.toContainText(
        'currently unavailable',
      );
      for (const href of [
        '/services/pregnancy-antenatal-care/',
        '/services/general-gynecology/',
        '/appointment/',
        '/privacy/',
      ]) {
        await expect(
          page.locator(`main a[href="${base}${href}"]`).first(),
        ).toBeVisible();
      }
      const appointment = page.locator('main .experience-button');
      await appointment.focus();
      await expect(appointment).toBeFocused();
      await expect(appointment).toHaveCSS('outline-style', 'solid');
      const columns = await page
        .locator('.experience-grid')
        .evaluate(
          (grid) =>
            getComputedStyle(grid).gridTemplateColumns.split(' ').length,
        );
      expect(columns).toBe(testInfo.project.name === '1440px' ? 3 : 1);
    }
    if (route === '/contact/') {
      await expect(page.locator('main address')).toHaveText(
        'KIMS Hospital, Secunderabad',
      );
    }
    if (['/contact/', '/privacy/'].includes(route)) {
      const contact = page
        .locator('main a[data-contact-channel="whatsapp"]')
        .first();
      await expect(contact).toContainText('+91 93468 25723');
      await expect(contact).toHaveAttribute(
        'href',
        'https://wa.me/919346825723',
      );
      await contact.focus();
      await expect(contact).toBeFocused();
    }
  });
}
