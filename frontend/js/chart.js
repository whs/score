var Chart = require('chart.js/src/core/core.js')();

require('chart.js/src/core/core.helpers')(Chart);
require('chart.js/src/core/core.element')(Chart);
require('chart.js/src/core/core.animation')(Chart);
require('chart.js/src/core/core.controller')(Chart);
require('chart.js/src/core/core.datasetController')(Chart);
require('chart.js/src/core/core.layoutService')(Chart);
require('chart.js/src/core/core.legend')(Chart);
require('chart.js/src/core/core.scale')(Chart);
require('chart.js/src/core/core.scaleService')(Chart);
require('chart.js/src/core/core.title')(Chart);
require('chart.js/src/core/core.tooltip')(Chart);

require('chart.js/src/controllers/controller.bar')(Chart);

require('chart.js/src/scales/scale.category')(Chart);
require('chart.js/src/scales/scale.linear')(Chart);

require('chart.js/src/elements/element.arc')(Chart);
require('chart.js/src/elements/element.line')(Chart);
require('chart.js/src/elements/element.point')(Chart);
require('chart.js/src/elements/element.rectangle')(Chart);

require('chart.js/src/charts/Chart.Bar')(Chart);

window.Chart = module.exports = Chart;
