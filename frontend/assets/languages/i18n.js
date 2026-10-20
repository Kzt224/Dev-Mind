import en from "./en_us.json";
import myMa from "./my_ma.json";

export const LANGUAGES = {
    En: en,
    Myan: myMa
}

export const getTranslations = (lan) => {
    return LANGUAGES[lan] || LANGUAGES.En;
}