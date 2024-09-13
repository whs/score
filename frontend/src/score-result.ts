import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { ScoreStats, SubjectScore, UserScore } from './schema.ts';
import { until } from 'lit/directives/until.js';
import { localized, msg } from '@lit/localize';

@customElement('score-result')
@localized()
export class ScoreResult extends LitElement {
	@property()
	data: UserScore | undefined;
	@property()
	stats: Promise<ScoreStats> | undefined;

	@state()
	statsViewSubject: string | undefined;

	numberFormatter = new Intl.NumberFormat(undefined, {
		maximumFractionDigits: 4,
	});
	percentFormatter = new Intl.NumberFormat(undefined, {
		style: 'percent',
		minimumFractionDigits: 0,
	});

	render() {
		return html`
			<div class="name">${this.data!._name}</div>
			<div class="filename">${this.data!._fname}</div>
			<slot name="beforescore"></slot>
			<table>
				<thead>
					<tr>
						<th style="width: 50%">${msg('Subject')}</th>
						<th>${msg('Score')}</th>
						<th>${msg('%')}</th>
						<th>${msg('z')}</th>
						<th>${msg('Rank')}</th>
					</tr>
				</thead>
				<tbody>
					${repeat(
						Object.keys(this.data!),
						(key) => key,
						(subject) => {
							if (subject.startsWith('_')) {
								return null;
							}

							let score = this.data![subject] as SubjectScore;

							if (!('rank' in score)) {
								return html` <tr>
									<td>${subject}</td>
									<td colspan="4">${score.score}</td>
								</tr>`;
							}

							return html`
								<tr>
									<td>
										<div
											class="viewstat ${classMap({
												active: this.statsViewSubject === subject,
											})}"
											@click="${this.showStatsHandler(subject)}"
										>
											${subject}
										</div>
									</td>
									<td>${this.numberFormatter.format(score.score as number)}</td>
									<td class="percent percent-${score.percent.toFixed(0)}">
										${this.percentFormatter.format(score.percent / 100)}
									</td>
									<td>${this.numberFormatter.format(score.standard)}</td>
									<td>${this.numberFormatter.format(score.rank)}</td>
								</tr>
							`;
						}
					)}
				</tbody>
			</table>
			<slot name="afterscore"></slot>
			<div class="subject-info">
				${until(
					// TODO: until() doesn't null check, this use is invalid
					// If user requested a stats, then only show subject name if stats is loaded
					this.statsViewSubject &&
						this.stats?.then(() => this.statsViewSubject),
					// If user requested a stats but it is not loaded, show loading page
					this.statsViewSubject && msg('Loading...'),
					this.stats && msg('Click the subject names to view statistics'),
					// Stats is not provided, so disable this feature
					null
				)}
			</div>
			${until(
				// TODO: until() doesn't null check, this use is invalid
				this.statsViewSubject &&
					this.stats?.then((stats) => {
						let subjectStats = stats[this.statsViewSubject!];
						// TypeScript assertion
						if (typeof subjectStats === 'string') {
							return null;
						}
						return html` <div class="stats">
							<table>
								<thead>
									<tr>
										<th></th>
										<th>${msg('Highest')}</th>
										<th>${msg('Lowest')}</th>
										<th>${msg(`2nd Lowest`)}</th>
										<th>${msg('Mode')}</th>
										<th>${msg('Average')}</th>
										<th>${msg('S.D.')}</th>
										<th>${msg('Count')}</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>${msg('By score')}</td>
										<td>
											${this.numberFormatter.format(subjectStats.hiscore)}
										</td>
										<td>
											${this.numberFormatter.format(subjectStats.lowscore)}
										</td>
										<td>
											${this.numberFormatter.format(subjectStats.lowscore2)}
										</td>
										<td>${this.numberFormatter.format(subjectStats.mode)}</td>
										<td rowspan="2">
											${this.numberFormatter.format(subjectStats.average)}
										</td>
										<td rowspan="2">
											${this.numberFormatter.format(subjectStats.sd)}
										</td>

										<td rowspan="2">
											${this.numberFormatter.format(subjectStats.count)}
										</td>
									</tr>
									<tr>
										<td>${msg('By count')}</td>
										<td>
											${this.numberFormatter.format(subjectStats.hiscore_cnt)}
										</td>
										<td>
											${this.numberFormatter.format(subjectStats.lowscore_cnt)}
										</td>
										<td>
											${this.numberFormatter.format(subjectStats.lowscore2_cnt)}
										</td>
										<td>
											${this.numberFormatter.format(subjectStats.mode_cnt)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>`;
					}),
				null
			)}
			<div class="graph">
				<canvas></canvas>
			</div>
		`;
	}

	showStats(subject: string) {
		this.statsViewSubject = subject;
	}

	private showStatsHandler(subject: string) {
		return (e: MouseEvent) => {
			e.preventDefault();
			this.showStats(subject);
		};
	}

	static styles = css`
		:host {
			display: block;
			background: white;
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		table tr:nth-child(odd) {
			background: #eee;
		}

		th {
			background: #22416a;
			color: white;
		}

		td {
			font-size: 12pt;
			vertical-align: middle;
			text-align: center;
		}

		th,
		td {
			border: #aaa solid 1px;
			padding: 4px;
		}

		.subject-info {
			margin-top: 10px;
			font-size: 16pt;
			font-family: thaisans, sans-serif;
			font-weight: 500;
		}

		.name,
		.filename {
			font-size: 20pt;
			font-family: thaisans, sans-serif;
			font-weight: 500;
			line-height: 1.2em;
		}

		.filename {
			font-size: 16pt;
			font-weight: 100;
			margin-bottom: 10px;
		}

		.viewstat {
			text-decoration: none;
			cursor: pointer;
			color: #2b8e00;
		}

		.active {
			font-weight: bold;
		}

		.stats td,
		.stats th {
			font-size: 10pt;
		}

		.percent {
			color: black;
		}

		.graph {
			width: 100%;
			height: 200px;
			margin-top: 10px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'score-result': ScoreResult;
	}
}
