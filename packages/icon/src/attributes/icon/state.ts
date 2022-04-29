import type { IconifyIcon } from '@iconify/types';
import type { IconifyIconName } from '@iconify/utils/lib/icon/name';
import type { IconifyIconLoaderAbort } from '@iconify/core/lib/api/icons';

/**
 * Value for currently selected icon
 */
export interface CurrentIconData {
	// Value passed as parameter
	value: unknown;

	// Data, if available. Can be null if icon is missing in API
	data?: Required<IconifyIcon> | null;

	// Icon name as object, if `value` is a valid icon name
	name?: IconifyIconName | null;

	// Loader abort function, set if icon is being loaded. Used only when `name` is valid
	loading?: IconifyIconLoaderAbort;
}

/**
 * Same as above, if
 */
export interface RenderedCurrentIconData extends CurrentIconData {
	// Full icon data
	data: Required<IconifyIcon>;
}
