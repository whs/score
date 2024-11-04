import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { cache } from 'lit/directives/cache.js';
import ibmPlex from '@fontsource/ibm-plex-sans-thai/500.css?inline&lit';
import { ScoreSubjectStats, SubjectScore } from './schema.ts';
import type { ChartData } from 'chart.js';
import './score-chartjs.ts';
import './score-button.ts';
import icBack from './icon/ic-back.ts';
import { msg, str } from '@lit/localize';
import icQuestion from './icon/ic-question.ts';
import icTeam from './icon/ic-team.ts';
import icJustify from './icon/ic-justify.ts';
import icSd from './icon/ic-sd.ts';

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

	@state()
	showWhyMin2: boolean = false;

	@state()
	toptenLoad: Promise<{}> | undefined;

	numberFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 2,
	});

	render() {
		let stats = this.stats!;
		let score = this.score!;
		if (!('percent' in score)) {
			return null;
		}

		return html`<div class="fab-bar">
				<div class="fab" @click=${this.onClose}>${icBack}</div>
			</div>
			<div class="data">
				<header>
					<div class="subject">${this.subject}</div>
					<div class="score">
						<div class="userscore">
							${this.numberFormatter.format(score.score)}
						</div>
						<div class="fullscore">
							/${this.numberFormatter.format(stats.max)}
						</div>
					</div>
				</header>
				<div class="box">
					<div class="legend">${msg('Your rank is')}</div>
					<div class="rank">${this.numberFormatter.format(score.rank)}</div>
					${this.topten
						? html`<score-button @click=${this.onTopTen}
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
							str`${this.numberFormatter.format(stats.histogram[score.score])} people`,
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
						<div class="icon">${icTeam}</div>
						<div class="legend">${msg('Examinee')}</div>
						<div class="stats">${this.numberFormatter.format(stats.count)}</div>
					</div>
					<div class="box">
						<div class="icon">${icJustify}</div>
						<div class="legend">${msg('Average')}</div>
						<div class="stats">
							${this.numberFormatter.format(stats.average)}
						</div>
					</div>
					<div class="box">
						<div class="icon">${icSd}</div>
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
					${cache(
						this.showWhyMin2
							? html`<p class="whymin2">
									${msg(
										'Two lowest scores are reported because the lowest score can be 0 for people who are absent. The second lowest score should represent actually achieved score.'
									)}
								</p>`
							: html`<div class="flex" style="margin-bottom: 8px;">
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
									</div>
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
									</div>`
					)}
					<score-button @click=${() => (this.showWhyMin2 = !this.showWhyMin2)}
						>${icQuestion}
						${msg('Why two lowest scores are reported')}</score-button
					>
				</div>
				<div class="box">
					<div class="legend">${msg('Histogram')}</div>
					${guard(
						[stats, score],
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
												bounds: 'data',
												ticks: { maxRotation: 0 },
												grid: { display: false },
											},
											y: {
												beginAtZero: true,
												ticks: { precision: 0 },
											},
										},
									},
								}}
							>
							</score-chartjs>`
					)}
				</div>
			</div>`;
	}

	onClose = (e: MouseEvent) => {
		e.preventDefault();
		this.dispatchEvent(new CustomEvent('close'));
	};

	onTopTen = (e: MouseEvent) => {
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

	buildScoreStatsHistogram(): ChartData<'bar', { x: string; y: number }[]> {
		let data = [];
		for (let i = 0; i <= this.stats!.max; i++) {
			data.push({ x: i.toString(), y: this.stats!.histogram[i] || 0 });
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

	static styles = [
		ibmPlex,
		css`
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
			}

			.data {
				background: white;
				border-radius: 24px;
				padding: 16px;
				font-family: 'IBM Plex Sans Thai', sans-serif;
			}

			.subject {
				font-size: 24pt;
				font-weight: 500;
			}

			.userscore {
				display: inline;
				font-size: 64pt;
			}
			.fullscore {
				display: inline;
				font-size: 16pt;
				color: #656e7c;
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
				font-size: 16pt;
				color: #656e7c;
			}

			.stats {
				font-size: 24pt;
			}

			.icon {
				margin-bottom: 8px;
				height: 24px;
			}

			.whymin2 {
				font-size: 16pt;
			}

			score-chartjs {
				display: block;
				width: 100%;
				height: 200px;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'score-subject-stats': ScoreSubjectStatsComponent;
	}
}
