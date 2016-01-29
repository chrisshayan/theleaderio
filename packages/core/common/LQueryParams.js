/**
 * this class to receive and cast params type
 */
LQueryParams = Astro.Class({
	name: 'LQueryParams',
	fields: {
		limit: {
			type: 'number',
			default() {
				return 10;
			}
		},

		offset: {
			type: 'number',
			default() {
				return 0;
			}
		},

		sinceId: {
			type: 'string',
			default() {
				return null;
			}
		}
	}
})