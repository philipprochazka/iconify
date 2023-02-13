import { promises as fs } from 'fs';
import { getCustomIcon } from '../lib/loader/custom';
import type { IconifyLoaderOptions } from '../lib/loader/types';

const fixturesDir = './tests/fixtures';

describe('Testing getCustomIcon', () => {
	test('CustomIconLoader', async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');
		expect(svg).toEqual(result);
	});

	test('CustomIconLoader without xmlns', async () => {
		const svg =
			'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>';
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			addXmlNs: true,
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
	});

	test('CustomIconLoader should apply trim', async () => {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="50"/>
</svg>
`;
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			customizations: { trimCustomSvg: true },
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
	});

	test('CustomIconLoader cleanups svg preface', async () => {
		const svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="50"/>
</svg>
`;
		const result = await getCustomIcon(() => svg, 'a', 'b', {
			customizations: { trimCustomSvg: true },
		});
		expect(result).toEqual(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/></svg>'
		);
	});

	test("CustomIconLoader with transform: scale/width/height shouldn't take effect", async () => {
		const svg = await fs.readFile(fixturesDir + '/circle.svg', 'utf8');
		const options: IconifyLoaderOptions = {
			scale: 2,
			customizations: {
				additionalProps: {
					width: '4em',
					height: '4em',
				},
				transform(svg) {
					return svg.replace(
						/<svg\s+/,
						'<svg width="1em" height="1em" '
					);
				},
			},
			usedProps: {},
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf('width="1em"') > -1).toBeTruthy();
		expect(result && result.indexOf('height="1em"') > -1).toBeTruthy();

		expect(options.usedProps).toBeTruthy();

		const usedProps = options.usedProps as Record<string, string>;
		expect(usedProps).toHaveProperty('width');
		expect(usedProps).toHaveProperty('height');
		expect(usedProps.width).toEqual('4em');
		expect(usedProps.height).toEqual('4em');
	});

	test('Icon with XML heading', async () => {
		// Intercept console.warn
		let warned = false;
		const warn = console.warn;
		console.warn = (/*...args*/) => {
			// warn.apply(this, args);
			warned = true;
		};

		const svg = await fs.readFile(fixturesDir + '/1f3eb.svg', 'utf8');
		const result = await getCustomIcon(() => svg, 'a', 'b');

		// Restore console.warn
		console.warn = warn;

		expect(result).toEqual(
			svg.replace(
				'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
				''
			)
		);
		expect(warned).toEqual(false);
	});

	test('Scale custom icon', async () => {
		const svg = `<?xml version="1.0" standalone="no"?>
		<svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
		  stroke="currentColor">
		  <path d="M12 14V20M10 12L4 10M14 12L20 10M21 12a9 9 0 11-18 0 9 9 0 0118 0zM14 12a2 2 0 11-4 0 2 2 0 014 0z" />
		</svg>`;

		const options: IconifyLoaderOptions = {
			scale: 1.2,
		};
		const result = await getCustomIcon(() => svg, 'a', 'b', options);
		expect(result && result.indexOf(' width="1.2em"') > -1).toBeTruthy();
		expect(result && result.indexOf(' height="1.2em"') > -1).toBeTruthy();
	});
});
