import {
	Chart,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	ChartConfiguration,
	ChartData,
} from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { customElement, property } from 'lit/decorators.js';
import { LitElement, PropertyValues } from 'lit';

Chart.register(
	BarController,
	BarElement,
	CategoryScale,
	LinearScale,
	AnnotationPlugin
);

@customElement('score-chartjs')
export class ScoreChartJs extends LitElement {
	@property({ attribute: false })
	config: ChartConfiguration = { type: 'bar', data: { datasets: [] } };

	@property({ attribute: false })
	data: ChartData = { datasets: [] };

	protected chart: Chart | undefined;

	protected createRenderRoot() {
		// XXX: No shadow root
		let canvas = document.createElement('canvas');
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.display = 'block';
		this.appendChild(canvas);
		return canvas;
	}

	render() {
		return null;
	}

	connectedCallback() {
		super.connectedCallback();
		this.config.data = this.data;
		this.chart = new Chart(this.renderRoot as HTMLCanvasElement, {
			...this.config,
			data: this.data,
		});
	}

	protected updated(changedProperties: PropertyValues) {
		if (this.chart && changedProperties.has('data')) {
			this.chart.data = this.data;
			this.chart.update();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.chart?.destroy();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'score-chartjs': ScoreChartJs;
	}
}
