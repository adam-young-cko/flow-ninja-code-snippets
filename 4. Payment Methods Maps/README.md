The config for the payment methods maps is slightly complex, since it hasn't been refactored or touched by anyone in quite a long time. The maps are built with AMCharts, which handles most of the heavy lifting around country highlighting.

The flow is as follows:

- Data is stored in the CMS about which countries each payment method supports. These are comma-separated.
- Two layers are built within AMCharts, one for _Merchant_ country data and one for _Customer_ country data.
- Within the map, the countries are split apart into an array, and used to assign focus points on the map using AMCharts functions.
- The data is assigned to each layer, and two buttons are added to the left of the map to control which layer is visible.

There's some additional logic to ensure blank layers aren't initially selected, most of this will be more visible in the code snippets attached.
