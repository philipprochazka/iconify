import type { ActualRenderMode, IconifyRenderMode } from './types';

/**
 * Get render mode
 */
export function getRenderMode(body: string, mode?: string): ActualRenderMode {
	switch (mode as ActualRenderMode | '') {
		// Force mode
		case 'svg':
		case 'bg':
		case 'mask':
			return mode as ActualRenderMode;
	}

	// Check for animation, use 'style' for animated icons
	// (only <a>, which should be ignored or animations start with '<a')
	if ((mode as IconifyRenderMode) !== 'style' && body.indexOf('<a') === -1) {
		// Render <svg>
		return 'svg';
	}

	// Use background or mask
	return body.indexOf('currentColor') === -1 ? 'bg' : 'mask';
}
