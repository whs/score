import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { cache } from 'lit/directives/cache.js';
import { ScoreSubjectStats, SubjectScore } from './schema.ts';
import type { ChartData } from 'chart.js';
import './score-button.ts';
import './score-bar.ts';
import { msg, str } from '@lit/localize';
import icQuestion from 'remixicon/icons/System/question-line.svg';
import icBack from 'remixicon/icons/Arrows/arrow-left-line.svg';
import icTeam from 'remixicon/icons/User & Faces/team-fill.svg';
import icAvg from 'remixicon/icons/Editor/align-center.svg';
import icSd from 'remixicon/icons/Finance/xrp-fill.svg';
import icArrowUp from 'remixicon/icons/Arrows/arrow-up-s-fill.svg';
import ranks from './ranks';
import { styleMap } from 'lit/directives/style-map.js';
import { until } from 'lit/directives/until.js';
import { isActivateKeyboardEvent } from './utils.ts';

const averageBarSvg = html`<svg
	width="20"
	height="36"
	viewBox="0 0 20 36"
	fill="none"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M0 36H20C15.5817 36 12 32.4183 12 28V8C12 3.58172 15.5817 0 20 0H0C4.41828 0 8 3.58172 8 8V28C8 32.4183 4.41828 36 0 36Z"
		fill="white"
	/>
</svg> `;

@customElement('score-subject-stats')
export class ScoreSubjectStatsComponent extends LitElement {
	@property()
	subject: string = '';

	@property()
	score: SubjectScore | undefined;

	@property()
	stats: ScoreSubjectStats | undefined;

	@property({ type: Boolean })
	topten: boolean = false;

	@property({ type: Boolean })
	nohistogram: boolean = false;

	@state()
	showWhyMin2: boolean = false;

	@state()
	toptenLoad: Promise<{}> | undefined;

	chartPromise: Promise<TemplateResult> | undefined;

	numberFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 2,
	});

	connectedCallback() {
		super.connectedCallback();
		this.chartPromise = this.nohistogram
			? undefined
			: import('./score-chartjs.ts').then(
					() =>
						html`<score-chartjs
							.data=${this.buildScoreStatsHistogram()}
							.config=${{
								type: 'bar',
								options: {
									categoryPercentage: 1,
									barPercentage: 1,
									scales: {
										x: {
											type: 'linear',
											bounds: 'data',
											min: 0,
											max: this.stats!.max,
											beginAtZero: true,
											offset: false,
											ticks: { maxRotation: 0, precision: 0 },
											grid: { display: false },
											title: { text: msg('Score'), display: true },
										},
										y: {
											beginAtZero: true,
											ticks: { precision: 0 },
											title: { text: msg('# of People'), display: true },
										},
									},
									plugins: {
										annotation: {
											annotations: {
												average: {
													type: 'line',
													scaleID: 'x',
													value: this.stats!.average,
													borderColor: '#10df87',
													borderDash: [5, 5],
													label: {
														content: msg('Average'),
														display: true,
														backgroundColor: 'transparent',
														color: 'rgba(0,0,0,0.5)',
														rotation: 'auto',
														position: '20%',
														font: {
															family: '"IBM Plex Sans Thai", sans-serif',
															weight: 500,
															size: 16,
														},
													},
												},
											},
										},
									},
								},
							}}
						>
						</score-chartjs>`
				);
	}

	render() {
		let stats = this.stats!;
		let score = this.score!;
		if (!('percent' in score)) {
			return null;
		}

		let needLowScore2 = stats.lowscore2 !== stats.lowscore;

		return html`<nav class="fab-bar">
				<div
					class="fab"
					role="button"
					tabindex="0"
					@click=${this.onClose}
					@keyup=${this.onClose}
				>
					<img src="${icBack}" alt="${msg('Back')}" />
				</div>
			</nav>
			<main class="data">
				<header>
					<div class="subject">${this.subject}</div>
					<div class="score" id="score">
						<div
							class="userscore"
							aria-label="${msg(str`Score: ${score.score}`)}"
						>
							${this.numberFormatter.format(score.score)}
						</div>
						<div
							class="fullscore"
							aria-label="${msg(str`Full mark: ${stats.max}`)}"
						>
							<span aria-hidden="true">/</span>${this.numberFormatter.format(
								stats.max
							)}
						</div>
					</div>
					<div class="bar" aria-describedby="score">
						<score-bar
							role="meter"
							aria-label="${msg('Score')}"
							aria-valuemin="0"
							aria-valuemax="${stats.max}"
							aria-valuenow="${score.score}"
							percent="${score.percent}"
							noglow
						></score-bar>
						<div
							class="average"
							aria-hidden="true"
							style="${styleMap({
								left: `${(stats.average / stats.max) * 100}%`,
							})}"
						>
							${averageBarSvg}
							<img src="${icArrowUp}" alt="^" />${msg('Average')}
						</div>
					</div>
				</header>
				<div class="box">
					<div class="legend" id="ranklabel">${msg('Your rank is')}</div>
					<div class="stats rank">
						${ranks[score.rank.toString()]
							? html`<img
									src="${ranks[score.rank.toString()]}"
									alt="${this.numberFormatter.format(score.rank)}"
									title="${this.numberFormatter.format(score.rank)}"
									role="presentation"
									aria-labelledby="ranklabel"
								/>`
							: this.numberFormatter.format(score.rank)}
					</div>
					${this.topten
						? html`<score-button
								style="margin-top: 8px;"
								role="button"
								tabindex="0"
								@click=${this.onTopTen}
								>${msg('Show Top Ten')}</score-button
							>`
						: null}
				</div>
				<div class="box">
					<div class="legend">
						${msg('There are', {
							id: 'same-score-top',
							desc: 'There are _ people who have the same score as you (first part)',
						})}
					</div>
					<div class="stats">
						${msg(
							str`${this.numberFormatter.format(stats.histogram[score.score] - 1)} people`,
							{
								id: 'same-score-value',
								// FIXME: Pluralization
								desc: 'There are _ people who have the same score as you (value part)',
							}
						)}
					</div>
					<div class="legend">
						${msg('who have the same score as you', {
							id: 'same-score-bottom',
							desc: 'There are _ people who have the same score as you (second part)',
						})}
					</div>
				</div>
				<div class="flex">
					<div class="box">
						<div class="icon" aria-hidden="true">
							<img src="${icTeam}" alt="${msg('Examinee')}" />
						</div>
						<div class="legend">${msg('Examinee')}</div>
						<div class="stats">${this.numberFormatter.format(stats.count)}</div>
					</div>
					<div class="box">
						<div class="icon" aria-hidden="true">
							<img src="${icAvg}" alt="${msg('Average')}" />
						</div>
						<div class="legend">${msg('Average')}</div>
						<div class="stats">
							${this.numberFormatter.format(stats.average)}
						</div>
					</div>
					<div class="box">
						<div class="icon" aria-hidden="true">
							<img src="${icSd}" alt="${msg('Standard Deviation')}" />
						</div>
						<div class="legend" title="${msg('Standard Deviation')}">
							${msg('S.D.')}
						</div>
						<div class="stats">${this.numberFormatter.format(stats.sd)}</div>
					</div>
				</div>
				<div class="box">
					<div class="flex">
						<div class="flexitem">
							<div class="legend">${msg('Top Score')}</div>
							<div class="stats">
								${this.numberFormatter.format(stats.hiscore)}
							</div>
						</div>
						<div class="flexitem">
							<div class="legend">${msg('Count (person)')}</div>
							<div class="stats">
								${this.numberFormatter.format(stats.hiscore_cnt)}
							</div>
						</div>
					</div>
				</div>
				<div class="box">
					<div class="mingrid">
						<div class="min" aria-hidden="${this.showWhyMin2}">
							${needLowScore2
								? html`<div class="flex" style="margin-bottom: 8px;">
										<div class="flexitem">
											<div class="legend">${msg('Second Lowest Score')}</div>
											<div class="stats">
												${this.numberFormatter.format(stats.lowscore2)}
											</div>
										</div>
										<div class="flexitem">
											<div class="legend">${msg('Count (person)')}</div>
											<div class="stats">
												${this.numberFormatter.format(stats.lowscore2_cnt)}
											</div>
										</div>
									</div>`
								: null}
							<div class="flex" style="margin-bottom: 8px;">
								<div class="flexitem">
									<div class="legend">${msg('Lowest Score')}</div>
									<div class="stats">
										${this.numberFormatter.format(stats.lowscore)}
									</div>
								</div>
								<div class="flexitem">
									<div class="legend">${msg('Count (person)')}</div>
									<div class="stats">
										${this.numberFormatter.format(stats.lowscore_cnt)}
									</div>
								</div>
							</div>
						</div>
						${cache(
							this.showWhyMin2
								? html`<div class="whymin2" role="alert">
										<div class="whymin2-inner">
											${msg(
												'Two lowest scores are reported because the lowest score can be 0 for people who are absent. The second lowest score should represent actually achieved score.'
											)}
										</div>
									</div>`
								: null
						)}
					</div>
					${needLowScore2
						? html`<score-button
								tabindex="0"
								role="button"
								@click=${() => (this.showWhyMin2 = !this.showWhyMin2)}
								@keyup=${(e: KeyboardEvent) =>
									isActivateKeyboardEvent(e) &&
									(this.showWhyMin2 = !this.showWhyMin2)}
								><img
									src="${icQuestion}"
									style="height: 1.2em; vertical-align: middle;"
									aria-hidden="true"
									alt="?"
								/>
								${msg('Why two lowest scores are reported')}</score-button
							>`
						: null}
				</div>
				${!this.nohistogram
					? html`<div class="box">
							<div class="legend">${msg('Histogram')}</div>
							${guard([stats, score], () =>
								until(this.chartPromise, html`${msg('Loading...')}`)
							)}
						</div>`
					: null}
			</main>`;
	}

	private onClose = (e: MouseEvent | KeyboardEvent) => {
		if ('key' in e) {
			if (!isActivateKeyboardEvent(e)) {
				return;
			}
		}
		e.preventDefault();
		this.dispatchEvent(new CustomEvent('close'));
	};

	private onTopTen = (e: MouseEvent | KeyboardEvent) => {
		if ('key' in e) {
			if (!isActivateKeyboardEvent(e)) {
				return;
			}
		}
		e.preventDefault();
		this.toptenLoad = import('./easteregg/score-topten.ts');
		this.toptenLoad.then(() => {
			let child = document.createElement('score-topten');
			child.style.cursor = 'pointer';
			child.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.removeChild(child);
			});
			document.body.appendChild(child);
		});
	};

	private buildScoreStatsHistogram(): ChartData<
		'bar',
		{ x: number; y: number }[]
	> {
		let data = [];
		for (let i = 0; i <= this.stats!.max; i++) {
			data.push({ x: i, y: this.stats!.histogram[i] || 0 });
		}
		return {
			datasets: [
				{
					backgroundColor: (ctx) => {
						if (ctx.dataIndex === this.score!.score) {
							return 'rgba(0, 0, 0, 0.4)';
						}
						return 'rgba(0, 0, 0, 0.1)';
					},
					data,
				},
			],
		};
	}

	static styles = css`
		:host {
			display: block;
		}

		.fab-bar {
			margin: 16px;
		}

		.fab {
			display: inline-block;
			background: white;
			border-radius: 24px;
			padding: 16px;
			width: 56px;
			height: 56px;
			line-height: 24px;
			box-sizing: border-box;
			text-align: center;
			cursor: pointer;
		}

		.data {
			background: white;
			border-radius: 24px;
			padding: 16px;
			font-family: 'IBM Plex Sans Thai', sans-serif;
		}

		header {
			margin-bottom: 16px;
		}

		.subject {
			font-size: 24px;
			font-weight: 500;
		}

		.userscore {
			display: inline;
			font-size: 64px;
		}
		.fullscore {
			display: inline;
			font-size: 16px;
			color: #656e7c;
		}

		.bar {
			position: relative;
			height: 72px;
		}

		.bar score-bar {
			height: 36px;
			border-radius: 12px;
		}

		.bar score-bar::part(bar) {
			border-radius: 12px;
		}

		.bar .average {
			position: absolute;
			top: 0;
			line-height: 12px;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			transform: translateX(-50%);
		}

		.bar svg {
			display: block;
			height: 36px;
		}

		.bar .average img {
			height: 24px;
			display: block;
			margin-top: -2px;
			margin-bottom: -2px;
		}

		.flex {
			display: flex;
		}
		.flexitem {
			flex: 1;
		}

		.box {
			border: #e0e0e0 solid 1px;
			border-radius: 16px;
			padding: 16px;
			text-align: center;
			margin-bottom: 16px;
		}

		.flex .box {
			flex: 1;
			margin-right: 16px;
		}

		.flex .box:last-child {
			margin-right: 0;
		}

		.legend {
			font-size: 16px;
			color: #656e7c;
		}

		.stats {
			font-size: 24px;
		}

		.rank {
			line-height: 128px;
			font-size: 64px;
		}

		.rank img {
			height: 128px;
			display: block;
			margin: auto;
		}

		.icon {
			margin-bottom: 8px;
			height: 24px;
		}
		.icon img {
			width: 24px;
			height: 24px;
		}

		.mingrid {
			display: grid;
			grid-auto-rows: 1fr;
		}

		.min,
		.whymin2 {
			grid-column: 1;
			grid-row: 1;
		}

		.whymin2 {
			font-size: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			animation: blurin ease-out 250ms forwards;
		}

		score-chartjs {
			display: block;
			width: 100%;
			height: 300px;
		}

		@keyframes blurin {
			from {
				backdrop-filter: blur(0);
				opacity: 0;
			}
			to {
				backdrop-filter: blur(8px);
				opacity: 1;
			}
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-subject-stats': ScoreSubjectStatsComponent;
	}
}
