import { sourceLocale, targetLocales } from './generated/locale-codes.ts';
import { configureLocalization, LocaleModule } from '@lit/localize';
import * as locale_th from './generated/locales/th';
import './whs-score.ts';

const localizedTemplates: {
	[lang: string]: Promise<LocaleModule> | LocaleModule;
} = {
	th: locale_th,
};

const { setLocale } = configureLocalization({
	sourceLocale,
	targetLocales,
	loadLocale: async (locale) => localizedTemplates[locale],
});

const url = new URL(window.location.href);
const locale = url.searchParams.get('locale') || 'th';

setLocale(locale);
